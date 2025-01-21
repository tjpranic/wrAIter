<script module lang="ts">
    import { defaultContent } from '$lib/paragraph.svelte';

    export function defaultStory( ) {
        return {
            title:      '',
            genre:      '',
            author:     '',
            content:    [defaultContent( )],
            prompt:     '',
            note:       '',
            memory:     [],
            stopReason: LLM.StopReason.Stop
        };
    }
</script>

<script lang="ts">
    import Meta      from '$lib/meta.svelte';
    import Divider   from '$lib/divider.svelte';
    import Paragraph from '$lib/paragraph.svelte';
    import Row       from '$lib/row.svelte';
    import Button    from '$lib/button.svelte';
    import Memory    from '$lib/memory.svelte';

    import { EMPTY_FILE }           from '$lib/file.svelte';
    import { DIVIDER_STYLE_DASHED } from '$lib/divider.svelte';
    import { ROW_STYLE_STACKED }    from '$lib/row.svelte';

    import { MEMORY_INCLUDE, MEMORY_AUTO } from '$lib/memory.svelte';

    import { LLM }     from '$lib/api';
    import { Utility } from '$lib/utility';

    let {
        story      = $bindable( defaultStory( ) ),
        modified   = $bindable( false ),
        generating = $bindable( false ),
        file,
        settings,
        connected,
        ontitlechanged,
        ongenrechanged,
        onauthorchanged,
        oncontentchanged,
        oncontentremoved,
        onpromptchanged,
        onregenerateclicked,
        ongenerateclicked,
        onabortclicked,
        onnotechanged,
        onmemorychanged
    } = $props( );

    let tokenCount  = $state( 0 );
    let cutoffPoint = $state( 0 );

    function modifyPassthrough( callback: any ) {
        modified = true;

        callback?.( );
    }

    function prepareFullPrompt( ): string {
        const mode =
            'You are wrAIter, the writer of a fictional story as directed by the user.\n' +
            'Your role is to write a story that follows the prompt given by the user.\n';

        const genre =
            `The genre of the story is: ${story.genre.trim( )}\n`;

        let memory = '';

        if( story.memory.length > 0 ) {
            for( const entry of story.memory ) {

                if( entry.included === MEMORY_INCLUDE ) {
                    memory += `${entry.text.trim( )}\n`;
                }
                else if( entry.included === MEMORY_AUTO ) {
                    let containsKeyword = false;

                    for( const keyword of entry.keywords.split( ',' ) ) {
                        if( story.prompt.includes( keyword ) ) {
                            containsKeyword = true;
                            break;
                        }
                    }

                    if( containsKeyword ) {
                        memory += `${entry.text.trim( )}\n`;
                    }
                }

            }
        }

        if( memory !== '' ) {
            memory = `Here is some information about the world the story takes place in:\n${memory}`;
        }

        let selected = story.content;

        if( selected.length > cutoffPoint ) {
            selected = selected.slice( cutoffPoint );
        }

        console.log( selected );

        let storySoFar = '';

        if( selected.length > 0 ) {
            storySoFar += `Here is the story so far:\n`;

            if( story.stopReason === LLM.StopReason.Length ) {
                storySoFar += `${selected.slice( 0, -1 ).map( ( paragraph: any ) => paragraph.text ).join( '' ).trim( )}\n`;
            }
            else {
                storySoFar += `${selected.map( ( paragraph: any ) => paragraph.text ).join( '' ).trim( )}\n`;
            }
        }

        const note   = story.note.trim( )   !== '' ? `${story.note.trim( )}\n`   : '';
        const prompt = story.prompt.trim( ) !== '' ? `${story.prompt.trim( )}\n` : '';

        let current = story.stopReason === LLM.StopReason.Length
            ? selected[selected.length - 1].text
            : '';

        let text = LLM.templatize(
            settings.template,
            {
                mode,
                genre,
                memory,
                storySoFar,
                note,
                prompt,
                current
            }
        );

        console.log( text );

        return text;
    }

    function recalculateCutoffPoint( ): void {
        cutoffPoint = story.content.length - story.content.reduceRight(
            ( accumulator: any, paragraph: any ) => {
                if( accumulator.tokenCount <= settings.cutoffTokens ) {
                    accumulator.cutoff     += 1;
                    accumulator.tokenCount += paragraph.tokenCount;
                }
                return accumulator;
            },
            {
                cutoff:     0,
                tokenCount: 0
            }
        ).cutoff;

        // console.log( cutoffPoint );
    }

    async function recalculateCurrentTokenCount( ): Promise<void> {
        if( connected ) {
            recalculateCutoffPoint( );

            tokenCount = await LLM.countTokens( prepareFullPrompt( ) );
        }
        else {
            cutoffPoint = 0;
            tokenCount  = 0;
        }
    }

    async function finish( ): Promise<void> {
        story.stopReason = LLM.StopReason.Stop;

        await recalculateCurrentTokenCount( );

        modified = true;
    }

    async function complete( ): Promise<void> {
        generating = true;

        if( story.stopReason === LLM.StopReason.Stop && story.content[story.content.length - 1].text !== '' ) {
            story.content = [ ...story.content, defaultContent( ) ];
        }

        const note   = story.note.trim( )   !== '' ? `${story.note.trim( )}\n`   : '';
        const prompt = story.prompt.trim( ) !== '' ? `${story.prompt.trim( )}\n` : '';

        story.content[story.content.length - 1].note   = note;
        story.content[story.content.length - 1].prompt = prompt;

        return LLM.complete(
            prepareFullPrompt( ),
            ( text, stoppedBecause ) => {
                story.content[story.content.length - 1].text += text;

                if( stoppedBecause !== null ) {
                    story.stopReason = stoppedBecause;
                }
                else {
                    story.stopReason = LLM.StopReason.Abort;
                }
            },
            async ( ) => {
                if( story.stopReason === LLM.StopReason.Stop ) {
                    await finish( );
                }

                story.content[story.content.length - 1].tokenCount = await LLM.countTokens( story.content[story.content.length - 1].text );

                await recalculateCurrentTokenCount( );

                modified   = true;
                generating = false;
            },
            settings
        );
    }

    async function proceed( ) {
        await complete( );
    }

    async function generate( ) {
        await finish( );
        await complete( );

        ongenerateclicked?.( );
    }

    function restart( ): void {
        story.content[story.content.length - 1].text = '';

        story.stopReason = LLM.StopReason.Stop;
    }

    async function regenerate( ) {
        restart( );

        await complete( );

        onregenerateclicked?.( );
    }

    async function recalculateTokenCountAt( index: number ) {
        story.content[index].tokenCount = await LLM.countTokens( story.content[index].text );
    }

    async function abort( ) {
        await LLM.abort( );

        await recalculateTokenCountAt( story.content.length - 1 );

        await recalculateCurrentTokenCount( );

        modified   = true;
        generating = false;

        onabortclicked?.( );
    }

    function sizeOnLoad( element: HTMLElement ) {
        $effect( ( ) => {
            Utility.autosize( element );
        } );
    }
</script>

<Meta
    bind:title={story.title}
    bind:genre={story.genre}
    bind:author={story.author}
    file={file}
    generating={generating}
    ontitlechanged={( ) => modifyPassthrough( ontitlechanged )}
    ongenrechanged={( ) => modifyPassthrough( ongenrechanged )}
    onauthorchanged={( ) => modifyPassthrough( onauthorchanged )}/>
{#each story.content as _, index}
    {#if index === cutoffPoint}
        <Divider style={DIVIDER_STYLE_DASHED}/>
    {/if}
    <Paragraph
        bind:story={story}
        bind:content={story.content[index]}
        bind:modified={modified}
        generating={generating || file === EMPTY_FILE}
        index={index}
        onsaved={( ) => modifyPassthrough( oncontentchanged )}
        onremoved={( ) => modifyPassthrough( oncontentremoved )}/>
{/each}
{#if story.stopReason === LLM.StopReason.Length}
    <div class="controls">
        <Button onclick={proceed}>Continue</Button>
        <Button onclick={finish}>Finish</Button>
    </div>
{/if}
<Row style={ROW_STYLE_STACKED}>
    {#snippet label( )}
        <label for="prompt">Prompt:</label>
    {/snippet}
    {#snippet content( )}
        <textarea
            use:sizeOnLoad
            bind:value={story.prompt}
            class="prompt"
            name="prompt"
            onfocus={( e ) => Utility.autosize( e.currentTarget )}
            oninput={( e ) => Utility.autosize( e.currentTarget )}
            onkeyup={( ) => modifyPassthrough( onpromptchanged )}
            disabled={generating || file === EMPTY_FILE}>
        </textarea>
        <div>
            <Button onclick={generate} disabled={!connected || generating}>Generate</Button>
            {#if story.content[story.content.length - 1].text !== ''}
                <Button onclick={regenerate} disabled={!connected || generating || story.content[story.content.length - 1].text === ''}>Regenerate</Button>
            {/if}
            <Button onclick={abort} disabled={!connected || !generating}>Abort</Button>
        </div>
    {/snippet}
</Row>
<Row style={ROW_STYLE_STACKED}>
    {#snippet label( )}
        <label for="note">Note:</label>
    {/snippet}
    {#snippet content( )}
        <textarea
            use:sizeOnLoad
            bind:value={story.note}
            name="note"
            onfocus={( e ) => Utility.autosize( e.currentTarget )}
            oninput={( e ) => Utility.autosize( e.currentTarget )}
            onkeyup={( ) => modifyPassthrough( onnotechanged )}
            disabled={generating || file === EMPTY_FILE}>
        </textarea>
    {/snippet}
</Row>
<Row style={ROW_STYLE_STACKED}>
    {#snippet label( )}
        <label for="memory">Memory:</label>
    {/snippet}
    {#snippet content( )}
        <Memory
            bind:memory={story.memory}
            prompt={story.prompt}
            generating={generating || file === EMPTY_FILE}
            onentryadded={( ) => modifyPassthrough( onmemorychanged )}
            onentryremoved={( ) => modifyPassthrough( onmemorychanged )}
            onentrychanged={( ) => modifyPassthrough( onmemorychanged )}/>
    {/snippet}
</Row>

<style lang="scss">
    .controls {
        padding: 0 0 0.5em 0;
    }
    .prompt {
        margin: 0 0 0.5em 0;
    }
</style>