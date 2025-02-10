<script module lang="ts">
    import { Settings } from '$lib/api';

    export function defaultSettings( ) {
        return Settings.defaults( );
    }

    export async function loadSettings( ) {
        return await Settings.load( );
    }

    export async function saveSettings( data: any ) {
        return await Settings.save( data );
    }
</script>

<script lang="ts">
    // import { onMount } from 'svelte';

    import Row from '$lib/row.svelte';

    import { ROW_STYLE_SIDE_BY_SIDE } from '$lib/row.svelte';

    let {
        settings = $bindable( defaultSettings( ) ),
        generating,
        ontemplatechanged,
        onresponsetokenschanged,
        oncontexttokenschanged,
        oncutofftokenschanged,
        ontemperaturechanged,
        ontopkchanged,
        ontoppchanged,
        ontypicalpchanged,
        ontopachanged,
        ontailfreesamplingchanged,
        onepsiloncutoffchanged,
        onetacutoffchanged,
        onrepetitionpenaltychanged
    } = $props( );

    // TODO
    // onMount( async( ) => {
    //     settings = await loadSettings( );
    // } );
</script>

<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="template">Template:</label>
    {/snippet}
    {#snippet content( )}
        <select name="template" id="template" bind:value={settings.template} onchange={( ) => ontemplatechanged?.( )}>
            <!-- TODO: load templates dynamically -->
            <option value="ChatML">ChatML</option>
            <option value="Mistral">Mistral</option>
            <option value="Llama3">Llama3</option>
        </select>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="response-tokens">Response (tokens):</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="response-tokens" min={0} bind:value={settings.responseTokens} disabled={generating} onchange={( ) => onresponsetokenschanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="context-tokens">Context (tokens):</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="context-tokens" min={0} bind:value={settings.contextTokens} disabled={generating} onchange={( ) => oncontexttokenschanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="cutoff-tokens">Cutoff (tokens):</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="cutoff-tokens" min={0} bind:value={settings.cutoffTokens} disabled={generating} onchange={( ) => oncutofftokenschanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="temperature">Temperature:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="temperature" min={0} max={2} step={0.01} bind:value={settings.temperature} disabled={generating} onchange={( ) => ontemperaturechanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="top-k">Top K:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="top-k" min={0} step={1} bind:value={settings.topK} disabled={generating} onchange={( ) => ontopkchanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="top-p">Top P:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="top-p" min={0} max={1} step={0.01} bind:value={settings.topP} disabled={generating} onchange={( ) => ontoppchanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="typical-p">Typical P:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="typical-p" min={0} max={1} step={0.01} bind:value={settings.typicalP} disabled={generating} onchange={( ) => ontypicalpchanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="top-a">Top A:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="top-a" min={0} max={1} step={0.01} bind:value={settings.topA} disabled={generating} onchange={( ) => ontopachanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="tail-free-sampling">Tail Free Sampling:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="tail-free-sampling" min={0} max={1} step={0.01} bind:value={settings.tailFreeSampling} disabled={generating} onchange={( ) => ontailfreesamplingchanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="epsilon-cutoff">Epsilon Cutoff:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="epsilon-cutoff" min={0} max={4} bind:value={settings.epsilonCutoff} disabled={generating} onchange={( ) => onepsiloncutoffchanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="eta-cutoff">Eta Cutoff:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="eta-cutoff" min={0} max={4} bind:value={settings.etaCutoff} disabled={generating} onchange={( ) => onetacutoffchanged?.( )}/>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="repetition-penalty">Repetition Penalty:</label>
    {/snippet}
    {#snippet content( )}
        <input type="number" name="eta-cutoff" min={0} max={2} step={0.01} bind:value={settings.repetitionPenalty} disabled={generating} onchange={( ) => onrepetitionpenaltychanged?.( )}/>
    {/snippet}
</Row>

<style lang="scss">
    #template {
        flex: 1;
        display: flex;
        gap: 0.5rem;
    }
</style>