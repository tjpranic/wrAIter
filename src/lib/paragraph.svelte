<script module lang="ts">
    export interface Content {
        text:       string,
        prompt:     string,
        note:       string
        tokenCount: number
    };

    export function defaultContent( ) {
        return {
            text: ''
        } as Content;
    }
</script>

<script lang="ts">
    import { fade } from 'svelte/transition';

    import Button from '$lib/button.svelte'

    import { Utility } from '$lib/utility';

    let {
        story    = $bindable( ),
        content  = $bindable( ),
        modified = $bindable( ),
        generating,
        index,
        onsaved,
        onremoved
    } = $props( );

    let temp    = $state( '' );
    let editing = $state( false );

    function save( ): void {
        content.text = temp;

        temp     = '';
        editing  = false;
        modified = true;

        onsaved?.( temp );
    }

    function cancel( ): void {
        temp    = '';
        editing = false;
    }

    function edit( ): void {
        temp    = content.text.trim( );
        editing = true;
    }

    let animate = $state( false );

    const FADE_TIME = 400;

    async function remove( index: number ) {
        animate = true;

        story.content.splice( index, 1 );

        if( story.content.length === 0 ) {
            story.content = [defaultContent( )];
        }
        else {
            story.content = story.content;
        }

        onremoved?.( index );
    }

    function sizeOnLoad( element: HTMLElement ) {
        $effect( ( ) => {
            Utility.autosize( element );
        } );
    }
</script>

<div out:fade={{ duration: animate ? FADE_TIME : 0 }} class="content">
    {#if editing}
        <div class="editor">
            <textarea
                use:sizeOnLoad
                bind:value={temp}
                onfocus={( e ) => Utility.autosize( e.currentTarget )}
                oninput={( e ) => Utility.autosize( e.currentTarget )}
                disabled={generating}>
            </textarea>
        </div>
        <Button onclick={save} disabled={generating}>Save</Button>
        <Button onclick={cancel} disabled={generating}>Cancel</Button>
    {:else if content !== undefined && content.text !== ''}
        <p>{content.text}</p>
        <div class="controls">
            <Button onclick={edit}   disabled={generating}>Edit</Button>
            <Button onclick={( ) => remove( index )} disabled={generating}>Remove</Button>
            <span>Tokens: {generating ? '...' : content.tokenCount}</span>
        </div>
    {:else}
        <p>...</p>
    {/if}
</div>

<style lang="scss">
    .content {
        border: 1px solid #999;
        // border-radius: 15px;
        padding: 1rem;
        margin: 0.5em 0 0.5em 0;

        .editor {
            display: flex;
            flex-direction: column;

            textarea {
                width: 100%;
                box-sizing: border-box;
                min-height: 2rem;
                height: 2rem;
                resize: vertical;
                resize: none;
            }
        }
        p {
            white-space: pre-line;
        }
        .controls {
            display: flex;

            span {
                flex: 1;
                text-align: right;
                align-self: center;
            }
        }
    }
</style>