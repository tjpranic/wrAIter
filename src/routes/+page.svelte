<script module lang="ts">
    export const DEFAULT_FILE_NAME = '0';

    export async function generateDefaultFile( ) {
        let newFile = DEFAULT_FILE_NAME;

        await File.create( newFile, defaultStory( ) );

        return newFile;
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte';

    import { goto } from '$app/navigation';

    import { File } from '$lib/api';

    import { defaultStory } from '$lib/story.svelte';

    onMount( async ( ) => {
        let files = await File.catalogue( );

        let file = files.length === 0
            ? await generateDefaultFile( )
            : files[0].replace( /\.[^/.]+$/, '' );

        goto( `/${file}`, { replaceState: true } );
    } );
</script>