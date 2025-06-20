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
        <div class="controls">
            <Button onclick={save} disabled={generating} class="primary">Save</Button>
            <Button onclick={cancel} disabled={generating}>Cancel</Button>
        </div>
    {:else if content !== undefined && content.text !== ''}
        <p>{content.text}</p>
        <div class="controls">
            <Button onclick={edit} disabled={generating}>Edit</Button>
            <Button onclick={( ) => remove( index )} disabled={generating} class="danger">Remove</Button>
            <span class="token-count">Tokens: {generating ? '...' : content.tokenCount}</span>
        </div>
    {:else}
        <p>...</p>
    {/if}
</div>

<style lang="scss">
    .content {
        background-color: var( --bg-secondary );
        border: 1px solid var( --border-color );
        border-radius:    var( --border-radius );
        padding:          1rem;
        margin:           1rem 0;


        .editor {
            display:        flex;
            flex-direction: column;
            margin-bottom:  1rem;

            textarea {

                background-color: var( --bg-input );
                border: 1px solid var( --border-color );
                border-radius:    var( --border-radius );
                width:            100%;
                box-sizing:       border-box;
                resize:           vertical;
                padding:          1rem;
                color:            var( --text-primary );
                font-family:      inherit;
                line-height:      1.5;

                &:focus {
                    border-color: var( --accent-primary );
                    outline:      none;
                }
            }
        }

        p {
            white-space: pre-line;
            line-height: 1.5;
            margin:      0 0 1rem 0;
            color:       var( --text-primary );
        }

        .controls {
            display:     flex;
            align-items: center;
            gap:         0.5rem;

            .token-count {
                text-align: right;
                flex:       1;
                font-size:  1rem;
                color:      var( --text-muted );
            }
        }
    }
</style>