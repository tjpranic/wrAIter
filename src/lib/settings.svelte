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

<div class="settings-container">
    <div class="settings-group">
        <h4 class="group-title">Model Settings</h4>
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
                <label for="response-tokens">Response Tokens:</label>
            {/snippet}
            {#snippet content( )}
                <input type="number" name="response-tokens" min={0} bind:value={settings.responseTokens} disabled={generating} onchange={( ) => onresponsetokenschanged?.( )}/>
            {/snippet}
        </Row>
        <Row style={ROW_STYLE_SIDE_BY_SIDE}>
            {#snippet label( )}
                <label for="context-tokens">Context Tokens:</label>
            {/snippet}
            {#snippet content( )}
                <input type="number" name="context-tokens" min={0} bind:value={settings.contextTokens} disabled={generating} onchange={( ) => oncontexttokenschanged?.( )}/>
            {/snippet}
        </Row>
        <Row style={ROW_STYLE_SIDE_BY_SIDE}>
            {#snippet label( )}
                <label for="cutoff-tokens">Cutoff Tokens:</label>
            {/snippet}
            {#snippet content( )}
                <input type="number" name="cutoff-tokens" min={0} bind:value={settings.cutoffTokens} disabled={generating} onchange={( ) => oncutofftokenschanged?.( )}/>
            {/snippet}
        </Row>
    </div>

    <div class="settings-group">
        <h4 class="group-title">Generation Parameters</h4>
        <Row style={ROW_STYLE_SIDE_BY_SIDE}>
            {#snippet label( )}
                <label for="temperature">Temperature:</label>
            {/snippet}
            {#snippet content( )}
                <div class="slider-container">
                    <input type="range" min={0} max={2} step={0.01} bind:value={settings.temperature} disabled={generating} onchange={( ) => ontemperaturechanged?.( )}/>
                    <input type="number" min={0} max={2} step={0.01} bind:value={settings.temperature} disabled={generating} onchange={( ) => ontemperaturechanged?.( )}/>
                </div>
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
                <div class="slider-container">
                    <input type="range" min={0} max={1} step={0.01} bind:value={settings.topP} disabled={generating} onchange={( ) => ontoppchanged?.( )}/>
                    <input type="number" min={0} max={1} step={0.01} bind:value={settings.topP} disabled={generating} onchange={( ) => ontoppchanged?.( )}/>
                </div>
            {/snippet}
        </Row>
        <Row style={ROW_STYLE_SIDE_BY_SIDE}>
            {#snippet label( )}
                <label for="typical-p">Typical P:</label>
            {/snippet}
            {#snippet content( )}
                <div class="slider-container">
                    <input type="range" min={0} max={1} step={0.01} bind:value={settings.typicalP} disabled={generating} onchange={( ) => ontypicalpchanged?.( )}/>
                    <input type="number" min={0} max={1} step={0.01} bind:value={settings.typicalP} disabled={generating} onchange={( ) => ontypicalpchanged?.( )}/>
                </div>
            {/snippet}
        </Row>
        <Row style={ROW_STYLE_SIDE_BY_SIDE}>
            {#snippet label( )}
                <label for="top-a">Top A:</label>
            {/snippet}
            {#snippet content( )}
                <div class="slider-container">
                    <input type="range" min={0} max={1} step={0.01} bind:value={settings.topA} disabled={generating} onchange={( ) => ontopachanged?.( )}/>
                    <input type="number" min={0} max={1} step={0.01} bind:value={settings.topA} disabled={generating} onchange={( ) => ontopachanged?.( )}/>
                </div>
            {/snippet}
        </Row>
        <Row style={ROW_STYLE_SIDE_BY_SIDE}>
            {#snippet label( )}
                <label for="tail-free-sampling">Tail Free Sampling:</label>
            {/snippet}
            {#snippet content( )}
                <div class="slider-container">
                    <input type="range" min={0} max={1} step={0.01} bind:value={settings.tailFreeSampling} disabled={generating} onchange={( ) => ontailfreesamplingchanged?.( )}/>
                    <input type="number" min={0} max={1} step={0.01} bind:value={settings.tailFreeSampling} disabled={generating} onchange={( ) => ontailfreesamplingchanged?.( )}/>
                </div>
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
                <div class="slider-container">
                    <input type="range" min={0} max={2} step={0.01} bind:value={settings.repetitionPenalty} disabled={generating} onchange={( ) => onrepetitionpenaltychanged?.( )}/>
                    <input type="number" min={0} max={2} step={0.01} bind:value={settings.repetitionPenalty} disabled={generating} onchange={( ) => onrepetitionpenaltychanged?.( )}/>
                </div>
            {/snippet}
        </Row>
    </div>
</div>

<style lang="scss">
    .settings-container {
        display:        flex;
        flex-direction: column;
        gap:            1.5rem;
    }

    .settings-group {
        padding:          1rem;
        border-radius:    var( --border-radius );
        background-color: var( --bg-secondary );
        border: 1px solid var( --border-color );

        .group-title {
            margin-top:    0;
            margin-bottom: 1rem;
            position:      relative;
            display:       inline-block;

            &::after {
                content:    '';
                position:   absolute;
                bottom:    -5px;
                left:       0;
                width:      40px;
                height:     2px;
                background: var( --accent-primary );
            }
        }

        :global( .row:last-child ) {
            padding-bottom: 0;
        }
    }

    #template {
        display:          flex;
        flex:             1;
        padding:          0.5rem;
        background-color: var( --bg-input );
        border: 1px solid var( --border-color );
        border-radius:    var( --border-radius );
        color:            var( --text-primary );

        &:focus {
            border-color: var( --accent-primary );
            outline:      none;
        }
    }

    .slider-container {
        display:     flex;
        align-items: center;
        gap:         0.5rem;


        input[type="range"] {
            flex:          1;
            height:        6px;
            border-radius: 10px;
            background:    var( --bg-tertiary );
            outline:       none;
            appearance:    none;

            &::-webkit-slider-thumb {
                width:         16px;
                height:        16px;
                border-radius: 50%;
                background:    var( --accent-primary );
                transition:    background var( --transition-speed ) ease;
                cursor:        pointer;
                appearance:    none;

                &:hover {
                    background: var( --accent-hover );
                }
            }
            &::-moz-range-thumb {
                width:         16px;
                height:        16px;
                border-radius: 50%;
                background:    var( --accent-primary );
                transition:    background var( --transition-speed ) ease;
                cursor:        pointer;
                border:        none;

                &:hover {
                    background: var( --accent-hover );
                }
            }
        }

        input[type="number"] {
            width:      70px;
            text-align: center;
        }
    }
</style>