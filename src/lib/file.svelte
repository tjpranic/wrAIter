<script module lang="ts">
    export const EMPTY_FILE = 'none';
</script>

<script lang="ts">
    import { onMount } from 'svelte';

    import Row    from '$lib/row.svelte';
    import Button from '$lib/button.svelte';
    import Modal  from '$lib/modal.svelte';

    import { File }         from '$lib/api';
    import { defaultStory } from '$lib/story.svelte';

    import { ROW_STYLE_SIDE_BY_SIDE } from '$lib/row.svelte';

    let {
        file     = $bindable( ),
        data     = $bindable( ),
        modified = $bindable( false ),
        generating,
        onnew,
        onsave,
        onload,
        onrename,
        ondelete
    } = $props( );

    let showCreateFileDialog = $state( false );
    let newFile              = $state( '' );

    function openCreateFileDialog( ) {
        showCreateFileDialog = true;
    }

    function closeCreateFileDialog( ) {
        showCreateFileDialog = false;
    }

    async function listFiles( ) {
        allFiles = await File.catalogue( );
    }

    async function createNewFile( ) {
        await File.create( newFile, defaultStory( ) );

        await listFiles( );

        file    = newFile;
        newFile = '';

        closeCreateFileDialog( );

        await loadFile( );

        modified = false;

        onnew?.( file );
    }

    async function saveFile( ) {
        await File.save( file, data );

        modified = false;

        onsave?.( file );
    }

    async function loadFile( ) {
        const temp = await File.load( file );

        if( temp === null ) {
            file = null;
        }
        else {
            data = temp;
        }

        modified = false;

        onload?.( file );
    }

    let showRenameFileDialog = $state( false );

    function openRenameFileDialog( ) {
        showRenameFileDialog = true;
    }

    function closeRenameFileDialog( ) {
        showRenameFileDialog = false;
    }

    async function renameFile( ) {
        await saveFile( );

        await File.rename( file, newFile );

        await listFiles( );

        file    = newFile;
        newFile = '';

        closeRenameFileDialog( );

        onrename?.( file );
    }

    let showDeleteFileDialog = $state( false );

    function openDeleteFileDialog( ) {
        showDeleteFileDialog = true;
    }

    function closeDeleteFileDialog( ) {
        showDeleteFileDialog = false;
    }

    async function deleteSelectedFile( ) {
        await File.destroy( file );

        closeDeleteFileDialog( );

        ondelete?.( file );
    }

    let allFiles: string[] = $state( [] );

    onMount( async ( ) => {
        await listFiles( );

        if( allFiles.length === 0 ) {
            file = EMPTY_FILE;
        }

        if( file !== EMPTY_FILE ) {
            await loadFile( );
        }
    } );
</script>

<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="file">File:</label>
    {/snippet}
    {#snippet content( )}
        <div id="files">
            <select class="file" name="file" id="file" bind:value={file} onchange={loadFile} disabled={generating}>
                {#if allFiles.length === 0}
                    <option value={EMPTY_FILE}>[none]</option>
                {:else}
                    {#each allFiles as filename}
                        <option value={filename}>{filename}</option>
                    {/each}
                {/if}
            </select>
            <Button onclick={openCreateFileDialog} disabled={generating}>New</Button>
            {#if modified}<span>* </span>{/if}<Button onclick={saveFile} disabled={generating || file === EMPTY_FILE}>Save</Button>
            <Button onclick={loadFile} disabled={generating || file === EMPTY_FILE}>Load</Button>
            <Button onclick={openRenameFileDialog} disabled={generating || file === EMPTY_FILE}>Rename</Button>
            <Button onclick={openDeleteFileDialog} disabled={generating || file === EMPTY_FILE}>Delete</Button>
        </div>
    {/snippet}
</Row>

<div id="create-file-dialog">
    <Modal
        showing={showCreateFileDialog}
        ok={createNewFile}
        cancel={closeCreateFileDialog}
        close={closeCreateFileDialog}>
        {#snippet title( )}
            <h3>Create new file?</h3>
        {/snippet}
        {#snippet content( )}
            <input bind:value={newFile} type="text" placeholder="filename"/>
        {/snippet}
    </Modal>
</div>

<div id="rename-file-dialog">
    <Modal
        showing={showRenameFileDialog}
        ok={renameFile}
        cancel={closeRenameFileDialog}
        close={closeRenameFileDialog}>
        {#snippet title( )}
            <h3>Rename file?</h3>
        {/snippet}
        {#snippet content( )}
            <input bind:value={newFile} type="text" placeholder="filename"/>
        {/snippet}
    </Modal>
</div>

<div id="delete-file-dialog">
    <Modal
        showing={showDeleteFileDialog}
        ok={deleteSelectedFile}
        cancel={closeDeleteFileDialog}
        close={closeDeleteFileDialog}>
        {#snippet title( )}
            <h3>Delete {file}?</h3>
        {/snippet}
        {#snippet content( )}{/snippet}
    </Modal>
</div>

<style lang="scss">
    #files {
        flex: 1;
        display: flex;
        gap: 0.5rem;

        .file {
            flex: 1;
        }
    }
    #create-file-dialog h3 {
        margin: 0;
    }
    #rename-file-dialog h3 {
        margin: 0;
    }
    #delete-file-dialog h3 {
        margin: 0;
    }
</style>