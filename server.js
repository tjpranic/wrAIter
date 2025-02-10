import express from 'express';
import cors    from 'cors';
import fs      from 'fs/promises';
import fetch   from 'node-fetch';
import dotenv  from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname }       from 'path';
import { json }          from 'stream/consumers';
import { Readable }      from 'stream';

import { handler } from './build/handler.js';

dotenv.config( );

// lifted from SillyTavern
function forwardFetchResponse( from, to ) {
    let statusCode = from.status;
    let statusText = from.statusText;

    if( !from.ok ) {
        console.error( `Streaming request failed with status ${statusCode} ${statusText}` );
    }

    // Avoid sending 401 responses as they reset the client Basic auth.
    // This can produce an interesting artifact as "400 Unauthorized", but it's not out of spec.
    // https://www.rfc-editor.org/rfc/rfc9110.html#name-overview-of-status-codes
    // "The reason phrases listed here are only recommendations -- they can be replaced by local
    //  equivalents or left out altogether without affecting the protocol."
    if( statusCode === 401 ) {
        statusCode = 400;
    }

    to.statusCode    = statusCode;
    to.statusMessage = statusText;

    from.body.pipe( to );

    to.socket.on(
        'close',
        function( ) {
            if( from.body instanceof Readable ) {
                from.body.destroy( );
            }
            to.end( );
        }
    );

    from.body.on(
        'end',
        function( ) {
            console.log( 'Text generation streaming completed!' );

            to.end( );
        }
    );
}

const __filename = fileURLToPath( import.meta.url );
const __dirname  = dirname( __filename );

const app = express( );

app.use(
    cors(
        {
            origin: function( origin, callback ) { return callback( null, true ); } // ['http://localhost:8080', 'http://127.0.0.1:8080'],
        }
    )
);

app.get(
    '/',
    ( request, response ) => {
        response.end( 'OK' );
    }
);

// prevent favicon.ico from throwing errors
app.get(
    '/favicon.ico',
    ( request, response ) => {
        response.sendStatus( 404 );
    }
);

const router = express.Router( );

const jsonParser = express.json( { limit: '200mb' } );

let settings = JSON.parse( await fs.readFile( __dirname + `/settings.json`, { encoding: 'utf8' } ) );

router.get(
    '/settings/load',
    async ( request, response ) => {

        try {

            let data = await fs.readFile( __dirname + `/settings.json`, { encoding: 'utf8' } );

            data = JSON.parse( data );

            // TODO: validate settings

            // console.log( data );

            response.send( data );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.post(
    '/settings/save',
    jsonParser,
    async ( request, response ) => {

        try {

            const data = JSON.stringify( request.body, null, 4 );

            // console.log( data );

            // TODO: validate settings

            settings = data;

            await fs.writeFile( __dirname + `/settings.json`, data, { flag: 'w' } );

            response.send( { result: 'OK' } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.get(
    '/file/catalogue',
    async ( request, response ) => {

        try {

            const contents = await fs.readdir( __dirname + '/data/' );

            // console.log( contents );

            const catalogue = contents.filter( ( file ) => file.includes( '.json' ) );

            response.send( { catalogue } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.post(
    '/file/new/:file',
    jsonParser,
    async ( request, response ) => {

        try {

            const file = request.params.file;

            if( file === undefined || file === null || file === '' ) {
                throw { message: 'u forgor to send the file name, dumbie' };
            }

            let data = request.body.data;

            if( data === undefined || data === null || data === '' ) {
                data = '{}';
            }

            data = JSON.stringify( data, null, 4 );

            await fs.writeFile( __dirname + `/data/${file}.json`, data, { flag: 'w' } );

            response.sendStatus( 200 );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.get(
    '/file/load/:file',
    async ( request, response ) => {

        try {

            const file = request.params.file;

            if( file === undefined || file === null || file === '' ) {
                throw { message: 'u forgor to send the file name, dumbie' };
            }

            let data = await fs.readFile( __dirname + `/data/${file}.json` );

            data = JSON.parse( data );

            // console.log( data );

            response.send( { data } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.send( { data: null } );
        }

    }
);

router.post(
    '/file/save/:file',
    jsonParser,
    async ( request, response ) => {

        try {

            const file = request.params.file;

            if( file === undefined || file === null || file === '' ) {
                throw { message: 'u forgor to send the file name, dumbie' };
            }

            // console.log( request.body );

            const data = JSON.stringify( request.body, null, 4 );

            // console.log( data );

            await fs.writeFile( __dirname + `/data/${file}.json`, data, { flag: 'w' } );

            response.send( { result: 'OK' } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.post(
    '/file/rename/:oldFile',
    jsonParser,
    async ( request, response ) => {

        try {

            const oldFile = request.params.oldFile;
            const newFile = request.body.newFile;

            if( oldFile === undefined || oldFile === null || oldFile === '' ) {
                throw { message: 'u forgor to send the old file name, dumbie' };
            }

            if( newFile === undefined || newFile === null || newFile === '' ) {
                throw { message: 'u forgont to send the new file name, dumboe' };
            }

            await fs.rename( __dirname + `/data/${oldFile}.json`, __dirname + `/data/${newFile}.json` );

            response.send( { result: 'OK' } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.post(
    '/file/delete/:file',
    jsonParser,
    async ( request, response ) => {

        try {

            const file = request.params.file;

            if( file === undefined || file === null || file === '' ) {
                throw { message: 'u forgor to send the file name, dumbie' };
            }

            await fs.unlink( __dirname + `/data/${file}.json` );

            response.sendStatus( 200 );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.get(
    '/llm/hello',
    async ( request, response ) => {

        try {

            const host = settings.modelHost
            const port = settings.modelPort;

            if( host === null || host === '' ) {
                throw { message: 'host doesn\'t real' };
            }

            if( port === null ) {
                throw { message: 'port don\'t real' };
            }

            const hello = await fetch(
                `http://${host}:${port}/v1/models`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await hello.json( );

            // console.log( data );

            response.send( { ok: data.data.length > 0 } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.send( { ok: false } );
        }

    }
);

router.get(
    '/llm/model',
    async ( request, response ) => {

        try {

            const host = settings.modelHost
            const port = settings.modelPort;

            if( host === null || host === '' ) {
                throw { message: 'host doesn\'t real' };
            }

            if( port === null ) {
                throw { message: 'port don\'t real' };
            }

            const model = await fetch(
                `http://${host}:${port}/v1/internal/model/info`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await model.json( );

            // console.log( data );

            response.send( { model: data.model_name } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.send( { model: 'None' } );
        }

    }
);

router.post(
    '/llm/count_tokens',
    jsonParser,
    async ( request, response ) => {

        try {

            const host = settings.modelHost
            const port = settings.modelPort;

            if( host === null || host === '' ) {
                throw 'host doesn\'t real';
            }

            if( port === null ) {
                throw 'port don\'t real';
            }

            const text = request.body.text;

            const tokenCount = await fetch(
                `http://${host}:${port}/v1/internal/encode`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( { text } )
                }
            );

            const data = await tokenCount.json( );

            // console.log( data );

            response.send( { tokenCount: data.length } );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

let abortController = null;

router.post(
    '/llm/complete',
    jsonParser,
    async ( request, response ) => {

        try {

            const host = settings.modelHost
            const port = settings.modelPort;

            if( host === null || host === '' ) {
                throw 'host doesn\'t real';
            }

            if( port === null ) {
                throw 'port don\'t real';
            }

            abortController = new AbortController( );

            const generate = await fetch(
                `http://${host}:${port}/v1/completions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( request.body ),
                    signal: abortController.signal,
                    timeout: 0,
                }
            );

            forwardFetchResponse( generate, response );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

router.post(
    '/llm/abort',
    jsonParser,
    async ( request, response ) => {

        try {

            if( abortController !== null ) {
                abortController.abort( );
            }

            response.sendStatus( 200 );

        }
        catch( exception ) {
            console.error( exception.message );

            response.sendStatus( 500 );
        }

    }
);

app.use( '/api', router );

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use( handler );

app.listen(
    process.env.PUBLIC_PORT || 3000,
    ( ) => {
        console.log( `Listening on port ${process.env.PUBLIC_PORT}...` );
    }
);