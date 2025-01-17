<script module lang="ts">
    export interface Entry {
        keywords: string,
        text:     string,
        included: string
    }

    export const MEMORY_INCLUDE = 'include';
    export const MEMORY_EXCLUDE = 'exclude';
    export const MEMORY_AUTO    = 'auto';
</script>

<script lang="ts">
    // typescript can't find the module, even though IT WORKS
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import { Accordion, AccordionItem } from 'svelte-collapsible';

    import Row    from '$lib/row.svelte';
    import Button from '$lib/button.svelte'

    import { ROW_STYLE_SIDE_BY_SIDE } from '$lib/row.svelte';

    import { Utility } from '$lib/utility';

    let {
        memory = $bindable( ),
        prompt,
        generating,
        onentryadded,
        onentryremoved,
        onentrychanged
    } = $props( );

    let keywords = $state( '' );
    let text     = $state( '' );

    function add( kaywords: string, toxt: string ): void {
        memory = [
            ...memory,
            {
                keywords: kaywords.trim( ),
                text:     toxt.trim( ),
                included: MEMORY_AUTO
            }
        ];

        keywords = '';
        text     = '';

        onentryadded?.( memory[memory.length - 1] );
    }

    function remove( index: number ): void {
        const removedEntry = memory[index];

        memory.splice( index, 1 );
        memory = memory;

        onentryremoved?.( removedEntry );
    }

    function entryChangeDebouncer( entry: Entry ) {
        Utility.debounce( ( ) => {
            onentrychanged?.( entry );
        } );
    }

    function sizeOnLoad( element: HTMLElement ) {
        $effect( ( ) => {
            Utility.autosize( element );
        } );
    }
</script>

{#if memory.length > 0}
    <Accordion>
        {#each memory as entry, index}
            <div class="memory-entry">
                <AccordionItem key={index}>
                    <ul slot="header" class="title">
                        <li>{entry.keywords}</li>
                        {#if entry.included === MEMORY_INCLUDE}
                            <aside class="green-text">^ included</aside>
                        {/if}
                        {#if entry.included === MEMORY_EXCLUDE}
                            <aside class="red-text">^ excluded</aside>
                        {/if}
                        {#if entry.included === MEMORY_AUTO}
                            {#if prompt.includes( entry.keywords )}
                                <aside class="green-text">included</aside>
                            {:else}
                                <aside class="red-text">excluded</aside>
                            {/if}
                        {/if}
                    </ul>
                    <div slot="body" class="content">
                        <div class="keywords">
                            <textarea
                                use:sizeOnLoad
                                bind:value={entry.keywords}
                                name="keywords"
                                onfocus={( e ) => Utility.autosize( e.currentTarget )}
                                oninput={( e ) => Utility.autosize( e.currentTarget )}
                                onkeyup={( ) => entryChangeDebouncer( entry )}
                                disabled={generating}>
                            </textarea>
                        </div>
                        <div class="text">
                            <textarea
                                use:sizeOnLoad
                                bind:value={entry.text}
                                name="text"
                                onfocus={( e ) => Utility.autosize( e.currentTarget )}
                                oninput={( e ) => Utility.autosize( e.currentTarget )}
                                onkeyup={( ) => entryChangeDebouncer( entry )}
                                disabled={generating}>
                            </textarea>
                        </div>
                        <Button onclick={( ) => remove( index )} disabled={generating}>Remove</Button>
                        <label><input bind:group={entry.included} type="radio" name={`included_${index}`} value={MEMORY_INCLUDE} onchange={( ) => onentrychanged?.( entry )}/> include</label>
                        <label><input bind:group={entry.included} type="radio" name={`included_${index}`} value={MEMORY_EXCLUDE} onchange={( ) => onentrychanged?.( entry )}/> exclude</label>
                        <label><input bind:group={entry.included} type="radio" name={`included_${index}`} value={MEMORY_AUTO}    onchange={( ) => onentrychanged?.( entry )}/> auto</label>
                    </div>
                </AccordionItem>
            </div>
        {/each}
    </Accordion>
{:else}
    <div class="memory-entry">
        <ul class="title">
            <li>...</li>
        </ul>
    </div>
{/if}
<div class="entry">
    <Row style={ROW_STYLE_SIDE_BY_SIDE}>
        {#snippet label( )}
            <label for="keywords">Keywords:</label>
        {/snippet}
        {#snippet content( )}
            <textarea
                bind:value={keywords}
                name="keywords"
                placeholder="comma separated list"
                onfocus={( e ) => Utility.autosize( e.currentTarget )}
                oninput={( e ) => Utility.autosize( e.currentTarget )}
                disabled={generating}>
            </textarea>
        {/snippet}
    </Row>
    <Row style={ROW_STYLE_SIDE_BY_SIDE}>
        {#snippet label( )}
        <label for="text">Text:</label>
        {/snippet}
        {#snippet content( )}
            <textarea
                use:sizeOnLoad
                bind:value={text}
                name="text"
                onfocus={( e ) => Utility.autosize( e.currentTarget )}
                oninput={( e ) => Utility.autosize( e.currentTarget )}
                disabled={generating}>
            </textarea>
        {/snippet}
    </Row>
    <Button onclick={( ) => add( keywords, text )} disabled={keywords.trim( ) === '' || text.trim( ) === '' || generating}>Add</Button>
</div>

<style lang="scss">
    :global( .accordion ) {
        margin: 0;
    }
    :global( .accordion-item ) {
        display: flex;
        flex-direction: column;
        padding: 0.5em 0 0 0;
    }
    :global( .accordion-item:first-of-type ) {
        padding: 0;
    }
    :global( .accordion-item-header ) {
        color: #eee;
        font-family: 'Inconsolata';
        font-size: unset;
        text-align: left;
    }

    .memory-entry {
        border: 1px solid #999;
        // border-radius: 15px;
        margin: 0 0 0.5em 0;

        .title {
            display: flex;
            margin: 0;
            padding: 1em 1em 1em 2em;
            list-style-type: square;

            li {
                flex: 1;
                margin: 0;
            }
        }
        .content {
            padding: 0 1em 1em 1em;
        }
    }
    .keywords {
        display: flex;
        padding: 0 0 0.5em 0;

        textarea {
            flex: 1;
            resize: vertical;
        }
    }
    .text {
        display: flex;
        padding: 0 0 0.5em 0;

        textarea {
            flex: 1;
            resize: vertical;
        }
    }
</style>