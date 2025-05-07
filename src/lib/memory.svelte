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
                    <div slot="header" class="title">
                        <span class="keywords">{entry.keywords}</span>
                        {#if entry.included === MEMORY_INCLUDE}
                            <aside class="status included">included</aside>
                        {/if}
                        {#if entry.included === MEMORY_EXCLUDE}
                            <aside class="status excluded">excluded</aside>
                        {/if}
                        {#if entry.included === MEMORY_AUTO}
                            {#if prompt.includes( entry.keywords )}
                                <aside class="status included">auto-included</aside>
                            {:else}
                                <aside class="status excluded">auto-excluded</aside>
                            {/if}
                        {/if}
                    </div>
                    <div slot="body" class="content">
                        <div class="keywords">
                            <label for="keywords">Keywords:</label>
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
                            <label for="text">Memory text:</label>
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
                        <div class="entry-controls">
                            <Button onclick={( ) => remove( index )} disabled={generating} class="danger">Remove</Button>
                            <div class="radio-group">
                                <label class="radio-label"><input bind:group={entry.included} type="radio" name={`included_${index}`} value={MEMORY_INCLUDE} onchange={( ) => onentrychanged?.( entry )}/> include</label>
                                <label class="radio-label"><input bind:group={entry.included} type="radio" name={`included_${index}`} value={MEMORY_EXCLUDE} onchange={( ) => onentrychanged?.( entry )}/> exclude</label>
                                <label class="radio-label"><input bind:group={entry.included} type="radio" name={`included_${index}`} value={MEMORY_AUTO}    onchange={( ) => onentrychanged?.( entry )}/> auto</label>
                            </div>
                        </div>
                    </div>
                </AccordionItem>
            </div>
        {/each}
    </Accordion>
{:else}
    <div class="memory-entry empty">
        <div class="title">
            <span class="keywords">No memories yet</span>
        </div>
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
    <Button onclick={( ) => add( keywords, text )} disabled={keywords.trim( ) === '' || text.trim( ) === '' || generating} class="primary">Add Memory</Button>
</div>

<style lang="scss">
    :global( .accordion ) {
        margin:        0;
        border-radius: var( --border-radius );
        overflow:      hidden;
    }

    :global( .accordion-item ) {
        display:              flex;
        flex-direction:       column;
        overflow:             hidden;
        margin-bottom:        1rem;
        border-radius:        var( --border-radius );
        background-color:     var( --bg-secondary );
        transition: transform var( --transition-speed ) ease;
    }

    :global( .accordion-item:last-child ) {
        margin-bottom: 0;
    }

    :global( .accordion-item-header ) {
        background-color: var( --bg-tertiary );
        color:            var( --text-primary );
        padding:          1rem 1rem;
        font-family:      inherit;
        font-size:        unset;
        text-align:       left;
        cursor:           pointer;

        &:hover {
            background-color: var( --bg-hover );
        }
    }

    .memory-entry {
        border: 1px solid var( --border-color );
        border-radius:    var( --border-radius );
        background-color: var( --bg-secondary );
        margin-bottom:    1rem;

        &.empty {
            padding:          1rem;
            color:            var( --text-muted );
            background-color: var( --bg-tertiary );
            text-align:       center;
        }

        .title {
            display:     flex;
            align-items: center;
            gap:         0.5rem;
            padding:     0.5rem 0;

            .keywords {
                flex:        1;
                font-weight: 500;
            }

            .status {
                padding:       0 0.5rem;
                border-radius: 1rem;
                font-size:     1rem;

                &.included {
                    background-color: var( --success-color );
                    color:            var( --text-primary );
                }
                &.excluded {
                    background-color: var( --error-color );
                    color:            var( --text-primary );
                }
            }
        }

        .content {
            padding: 1rem;

            label {
                color:         var( --text-secondary );
                display:       block;
                margin-bottom: 0.5rem;
                font-weight:   500;
            }

            .keywords, .text {
                margin-bottom: 1rem;

                textarea {
                    width:         100%;
                    min-height:    2.5rem;
                    border-radius: var( --border-radius );
                    resize:        vertical;
                }
            }

            .entry-controls {
                display:     flex;
                flex-wrap:   wrap;
                align-items: center;
                gap:         1rem;

                .radio-group {
                    display:   flex;
                    flex-wrap: wrap;
                    gap:       1rem;

                    .radio-label {
                        display:     flex;
                        align-items: center;
                        gap:         0.5rem;

                        input[type="radio"] {
                            margin:       0;
                            accent-color: var( --accent-primary );
                        }
                    }
                }
            }
        }
    }

    .entry {
        padding:          1.5rem;
        border: 1px solid var( --border-color );
        border-radius:    var( --border-radius );
        background-color: var( --bg-secondary );

        :global( button ) {
            align-self: flex-start;
        }
    }
</style>