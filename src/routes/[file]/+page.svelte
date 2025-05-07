<script lang="ts">
    import { onMount } from 'svelte';
    import { fade }    from 'svelte/transition';

    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    import Header   from '$lib/header.svelte';
    import Model    from '$lib/model.svelte';
    import Divider  from '$lib/divider.svelte';
    import File     from '$lib/file.svelte';
    import Story    from '$lib/story.svelte';
    import Settings from '$lib/settings.svelte';

    // can't use at the moment because something broke somewhere
    // import Toaster from '$lib/toaster.svelte';

    import { DIVIDER_STYLE_SOLID } from '$lib/divider.svelte';

    import { EMPTY_FILE }   from '$lib/file.svelte';
    import { defaultStory } from '$lib/story.svelte';

    import { loadSettings, saveSettings } from '$lib/settings.svelte';

    // import { toast } from '$lib/toaster.svelte';

    import { Utility } from '$lib/utility';

    let file = $state( EMPTY_FILE );

    if( page.params.file !== undefined ) {
        file = page.params.file;
    }

    let story      = $state( defaultStory( ) );
    let settings   = $state( null );
    let connected  = $state( false );
    let modified   = $state( false );
    let generating = $state( false );

    function onConnect( success: boolean ) {
        if( success ) {
            // toast.success( 'Connected sucessfully! :D', { position: 'top-right' } );
        }
        else {
            // toast.error( 'Unable to connect... :^(', { position: 'top-right' } );
        }
    }

    function onDisconnect( ) {
        // toast( 'Disconnected successfully! :)', { icon: '🗿', position: 'top-right' } );
    }

    async function onSettingChanged( ) {
        Utility.debounce( async ( ) => await saveSettings( settings ) );
    }

    function onNewFile( file: string ) {
        goto( `/${file}`, { replaceState: true } );
    }

    function onLoadFile( file: string ) {
        if( file === null ) {
            goto( '/', { replaceState: true } );

            // toast.error( `Unable to load file... :['`, { position: 'top-right' } );
        }
        else {
            goto( `/${file}`, { replaceState: true } );
        }
    }

    function onRenameFile( file: string ) {
        goto( `/${file}`, { replaceState: true } );
    }

    function onDeleteFile( ) {
        goto( '/', { replaceState: true } );
    }

    let ready = $state( false );

    onMount( async( ) => {
        // TODO: move this into settings.svelte
        settings = await loadSettings( );

        ready = true;
    } );
</script>

<Header/>
<Divider style={DIVIDER_STYLE_SOLID}/>

{#if ready}
    <div in:fade>
        <h3>Model:</h3>
        <Model
            bind:settings={settings}
            bind:connected={connected}
            generating={generating}
            onconnect={onConnect}
            ondisconnect={onDisconnect}
            onhostchanged={onSettingChanged}
            onportchanged={onSettingChanged}/>
        <Divider style={DIVIDER_STYLE_SOLID}/>
        <h3>File:</h3>
        <File
            bind:file={file}
            bind:data={story}
            bind:modified={modified}
            generating={generating}
            onnew={onNewFile}
            onsave={null}
            onload={onLoadFile}
            onrename={onRenameFile}
            ondelete={onDeleteFile}/>
        <h3>Story:</h3>
        <Divider style={DIVIDER_STYLE_SOLID}/>
        <Story
            bind:story={story}
            bind:modified={modified}
            bind:generating={generating}
            file={file}
            settings={settings}
            connected={connected}
            ontitlechanged={null}
            ongenrechanged={null}
            onauthorchanged={null}
            oncontentchanged={null}
            oncontentremoved={null}
            onpromptchanged={null}
            ongenerateclicked={null}
            onregenerateclicked={null}
            onabortclicked={null}
            onnotechanged={null}
            onmemorychanged={null}/>
        <Divider style={DIVIDER_STYLE_SOLID}/>
        <h3>Settings:</h3>
        <Settings
            bind:settings={settings}
            generating={generating}
            ontemplatechanged={onSettingChanged}
            onresponsetokenschanged={onSettingChanged}
            oncontexttokenschanged={onSettingChanged}
            oncutofftokenschanged={onSettingChanged}
            ontemperaturechanged={onSettingChanged}
            ontopkchanged={onSettingChanged}
            ontoppchanged={onSettingChanged}
            ontypicalpchanged={onSettingChanged}
            ontopachanged={onSettingChanged}
            ontailfreesamplingchanged={onSettingChanged}
            onepsiloncutoffchanged={onSettingChanged}
            onetacutoffchanged={onSettingChanged}
            onrepetitionpenaltychanged={onSettingChanged}/>
        <!-- <Toaster/> -->
    </div>
{:else}
    <div class="loading-container">
        <div class="spinner"></div>
        <div class="loading-text">Loading...</div>
    </div>
{/if}

<style lang="scss">
    .loading-container {
        display:         flex;
        flex-direction:  column;
        align-items:     center;
        justify-content: center;
        padding:         2rem;
        gap:             1rem;
    }

    .loading-text {
        color:       var( --accent-primary );
        font-size:   1rem;
        font-weight: 500;
    }

    .spinner {
        width:  50px;
        height: 50px;
        border: 3px solid var( --bg-tertiary );
        border-top-color: var( --accent-primary );
        border-radius:    50%;
        animation:        spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to {
            transform: rotate( 360deg );
        }
    }
</style>