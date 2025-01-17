<script lang="ts">
    import Row from '$lib/row.svelte';

    import { EMPTY_FILE } from '$lib/file.svelte';

    import { ROW_STYLE_SIDE_BY_SIDE } from '$lib/row.svelte';

    let {
        title  = $bindable( ),
        genre  = $bindable( ),
        author = $bindable( ),
        file,
        generating,
        ontitlechanged,
        ongenrechanged,
        onauthorchanged
    } = $props( );
</script>

<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="title">Title:</label>
    {/snippet}
    {#snippet content( )}
        <input type="text" name="title" bind:value={title} onkeyup={( ) => ontitlechanged?.( )} disabled={generating || file === EMPTY_FILE}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="genre">Genre:</label>
    {/snippet}
    {#snippet content( )}
        <input type="text" name="genre" placeholder="comma separated list" bind:value={genre} onkeyup={( ) => ongenrechanged?.( )} disabled={generating || file === EMPTY_FILE}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="author">Author:</label>
    {/snippet}
    {#snippet content( )}
        <input type="text" name="author" bind:value={author} onkeyup={( ) => onauthorchanged?.( )} disabled={generating || file === EMPTY_FILE}/>
    {/snippet}
</Row>


<style lang="scss">
</style>