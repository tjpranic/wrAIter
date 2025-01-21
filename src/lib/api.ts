import { page } from '$app/state';

import Handlebars from 'handlebars';

import SSEStream from '$lib/sse-stream.js';

export namespace Server {

    export function URL( ): string {
        const host = page.url.hostname;
        const port = settings.serverPort;

        return `http://${host}:${port}`;
    }

}

export namespace File {

    export async function catalogue( ): Promise<string[]> {
        const response = await fetch(
            `${Server.URL( )}/api/file/catalogue`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        const data = await response.json( );

        return data.catalogue.map( ( filename: string ) => filename.replace( /\.[^/.]+$/, '' ) );
    }

    export async function create( file: string, data: any = null ): Promise<boolean> {
        file = file.replace( /\.[^/.]+$/, '' );

        const response = await fetch(
            `${Server.URL( )}/api/file/new/${file}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { data } )
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        return true;
    }

    export async function save( file: string, data: any ): Promise<boolean> {
        file = file.replace( /\.[^/.]+$/, '' );

        const response = await fetch(
            `${Server.URL( )}/api/file/save/${file}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( data )
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        return true;
    }

    export async function load( file: string ): Promise<any> {
        file = file.replace( /\.[^/.]+$/, '' );

        const response = await fetch(
            `${Server.URL( )}/api/file/load/${file}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        return ( await response.json( ) ).data;
    }

    export async function rename( oldFile: string, newFile: string ): Promise<boolean> {
        oldFile = oldFile.replace( /\.[^/.]+$/, '' );
        newFile = newFile.replace( /\.[^/.]+$/, '' );

        const response = await fetch(
            `${Server.URL( )}/api/file/rename/${oldFile}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( { newFile } )
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        return true;
    }

    export async function destroy( file: string ): Promise<boolean> {
        file = file.replace( /\.[^/.]+$/, '' );

        const response = await fetch(
            `${Server.URL( )}/api/file/delete/${file}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        return true;
    }

}

export namespace LLM {

    export enum StopReason {
        Stop   = 'stop',
        Length = 'length',
        Abort  = 'abort'
    }

    export const templates = {
        ChatML: Handlebars.compile(
            '<|im_start|>system\n'    +
            '{{{mode}}}'              +
            '{{{genre}}}'             +
            '{{{memory}}}'            +
            '{{{storySoFar}}}'        +
            '<|im_end|>\n'            +
            '<|im_start|>user\n'      +
            '{{{note}}}'              +
            '{{{prompt}}}'            +
            '<|im_end|>\n'            +
            '<|im_start|>assistant\n' +
            '{{{current}}}'
        ),
        Mistral: Handlebars.compile(
            '[INST] \n'        +
            '{{{mode}}}'       +
            '{{{genre}}}'      +
            '{{{memory}}}'     +
            '{{{storySoFar}}}' +
            '{{{note}}}'       +
            '{{{prompt}}}'     +
            ' [/INST]\n'       +
            '{{{current}}}'
        )
    }

    export function templatize( template: string, data: any ): string {
        switch( template ) {
            case 'ChatML': {
                return LLM.templates.ChatML( data );
            }
            case 'Mistral': {
                return LLM.templates.Mistral( data );
            }
            default: {
                return '';
            }
        }
    }

    export async function hello( ): Promise<boolean> {
        try {
            const response = await fetch(
                `${Server.URL( )}/api/llm/hello`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if( !response.ok ) {
                console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
            }

            const data = await response.json( );

            return data.ok;
        }
        catch( exception ) {
            return false;
        }
    }

    export async function model( ): Promise<string> {
        const response = await fetch(
            `${Server.URL( )}/api/llm/model`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        const data = await response.json( );

        return data.model;
    }

    export async function countTokens( text: string ): Promise<number> {
        const response = await fetch(
            `${Server.URL( )}/api/llm/count_tokens`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        text
                    }
                )
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        const data = await response.json( );

        return data.tokenCount;
    }

    export async function complete(
        prompt:   string,
        stream:   ( text: string, stopReason: LLM.StopReason ) => void,
        success:  ( ) => void,
        settings: any
    ): Promise<void> {

        // console.log( prompt );

        const response = await fetch(
            `${Server.URL( )}/api/llm/complete`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        prompt,
                        max_tokens:           settings.responseTokens,
                        max_new_tokens:       settings.responseTokens,
                        n_predict:            settings.responseTokens,
                        num_predict:          settings.responseTokens,
                        num_ctx:              settings.contextTokens,
                        truncation_length:    settings.contextTokens,
                        temperature:          settings.temperature,
                        top_k:                settings.topK,
                        top_p:                settings.topP,
                        typical_p:            settings.typicalP,
                        top_a:                settings.topA,
                        tfs:                  settings.tailFreeSampling,
                        epsilon_cutoff:       settings.epsilonCutoff,
                        eta_cutoff:           settings.etaCutoff,
                        rep_pen:              settings.repetitionPenalty,
                        repeat_penalty:       settings.repetitionPenalty,
                        repetition_penalty:   settings.repetitionPenalty,
                        rep_pen_range:        settings.repetitionRange,
                        rep_pen_slope:        settings.repetitionSlope,
                        frequency_penalty:    settings.frequencyPenalty,
                        presence_penalty:     settings.presencePenalty,
                        no_repeat_ngram_size: settings.noRepeatNGramSize,
                        min_length:           settings.minimumLength,
                        stream:               true
                    }
                )
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        const reader = response.body?.pipeThrough( new SSEStream( ) ).getReader( );

        reader?.read( ).then(
            function pump( { done, value } ): any {
                if( done ) {
                    success( );

                    return;
                }
                else {
                    var parsed = JSON.parse( value.data );

                    // console.log( parsed.choices[0].text );

                    stream( parsed.choices[0].text, parsed.choices[0].finish_reason as LLM.StopReason );

                    return reader.read( ).then( pump );
                }
            }
        );
    }

    export async function abort( ): Promise<void> {
        const response = await fetch(
            `${Server.URL( )}/api/llm/abort`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }
    }

}

export namespace Settings {

    // TODO: add typing

    export function defaults( ) {
        return {
            serverPort:         3000,
            modelHost:          '127.0.0.1',
            modelPort:          5000,
            template:           'ChatML',
            responseTokens:     200,
            contextTokens:      2048,
            cutoffTokens:       2048,
            temperature:        1,
            topK:               0,
            topP:               1,
            typicalP:           1,
            minimumP:           0.1,
            topA:               0,
            tailFreeSampling:   1,
            epsilonCutoff:      0,
            etaCutoff:          0,
            repetitionPenalty:  1.08,
            repetitionRange:    0,
            repetitionSlope:    1,
            frequencyPenalty:   0,
            presencePenalty:    0,
            noRepeatNGramSize:  0,
            minimumLength:      0
        };
    }

    export function validate( data: any ): boolean {

        // TODO

        return true;
    }

    export async function load( ): Promise<any> {
        const response = await fetch(
            `${Server.URL( )}/api/settings/load`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }

        settings = await response.json( );

        return settings;
    }

    export async function save( data: any ): Promise<void> {
        const response = await fetch(
            `${Server.URL( )}/api/settings/save`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( data )
            }
        );

        if( !response.ok ) {
            console.error( `Streaming request failed with status ${response.status} ${response.statusText}` );
        }
    }

}

let settings = Settings.defaults( );