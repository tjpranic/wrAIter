<script lang="ts">
    import { onMount } from 'svelte';

    import Row    from '$lib/row.svelte';
    import Button from '$lib/button.svelte';

    import { ROW_STYLE_SIDE_BY_SIDE } from '$lib/row.svelte';

    import { LLM, Settings } from '$lib/api';

    let {
        settings  = $bindable( Settings.defaults( ) ),
        connected = $bindable( false ),
        generating,
        onconnect,
        ondisconnect,
        onhostchanged,
        onportchanged
    } = $props( );

    let model = $state( 'None' );

    async function connect( ) {
        if( await LLM.hello( ) ) {
            model = await LLM.model( );

            connected = model !== 'None';
        }
        else {
            connected = false;
        }

        onconnect?.( connected );
    }

    function disconnect( ) {
        connected = false;
        model     = 'None';

        ondisconnect?.( );
    }

    onMount( async( ) => {
        await connect( );
    } );
</script>

<div class="model-container">
    <Row style={ROW_STYLE_SIDE_BY_SIDE}>
        {#snippet label( )}
            <label for="url">URL:</label>
        {/snippet}
        {#snippet content( )}
            <div id="url">
                <div class="connection-fields">
                    <input placeholder="host" bind:value={settings.modelHost} onchange={onhostchanged} disabled={connected || generating}/>
                    <span>:</span>
                    <input placeholder="port" type="number" bind:value={settings.modelPort} onchange={onportchanged} disabled={connected || generating}/>
                </div>
                <div class="connection-buttons">
                    <Button onclick={connect} disabled={connected || generating} class="primary">Connect</Button>
                    <Button onclick={disconnect} disabled={!connected || generating} class="danger">Disconnect</Button>
                </div>
            </div>
        {/snippet}
    </Row>
    <Row style={ROW_STYLE_SIDE_BY_SIDE}>
        {#snippet label( )}
            <div class="model-label">Model:</div>
        {/snippet}
        {#snippet content( )}
            <div class="model-name">{model}</div>
        {/snippet}
    </Row>
</div>

<style lang="scss">
    .model-container {
        padding:          1rem;
        margin-bottom:    1rem;
        border-radius:    var( --border-radius );
        background-color: var( --bg-secondary );
        border: 1px solid var( --border-color );

        :global( .row:last-child ) {
            padding-bottom: 0;
        }

        #url {
            display:        flex;
            flex-direction: column;
            flex:           1;
            gap:            0.5rem;
            min-width:      0;

            @media( min-width: 768px ) {
                flex-direction: row;
            }

            .connection-fields {
                display:     flex;
                align-items: center;
                flex:        2;
                gap:         0.5rem;

                input {
                    flex:             1;
                    min-width:        0;
                    padding:          0.5rem;
                    border-radius:    var( --border-radius );
                    background-color: var( --bg-input );
                    border: 1px solid var( --border-color );
                    color:            var( --text-primary );

                    &:focus {
                        border-color: var( --accent-primary );
                        outline:      none;
                    }
                }

                span {
                    font-size: 1rem;
                    color:     var( --text-secondary );
                }
            }

            .connection-buttons {
                display: flex;
                flex:    1;
                gap:     0.5rem;
            }
        }

        .model-label {
            font-weight: 500;
        }

        .model-name {
            font-family:           'Inconsolata', monospace;
            padding:               0.5rem 1rem;
            border-radius:         var( --border-radius );
            border-left: 3px solid var( --accent-primary );
            background-color:      var( --bg-tertiary );
        }
    }
</style>