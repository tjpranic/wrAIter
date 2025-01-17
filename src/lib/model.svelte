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

<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <label for="url">URL:</label>
    {/snippet}
    {#snippet content( )}
        <div id="url">
            <input placeholder="host" bind:value={settings.modelHost} onchange={onhostchanged} disabled={connected || generating}/>
            <span>:</span>
            <input placeholder="port" type="number" bind:value={settings.modelPort} onchange={onportchanged} disabled={connected || generating}/>
            <Button onclick={connect}    disabled={ connected || generating}>Connect</Button>
            <Button onclick={disconnect} disabled={!connected || generating}>Disconnect</Button>
        </div>
    {/snippet}
</Row>
<Row style={ROW_STYLE_SIDE_BY_SIDE}>
    {#snippet label( )}
        <div>Model:</div>
    {/snippet}
    {#snippet content( )}
        <div>{model}</div>
    {/snippet}
</Row>

<style lang="scss">
    #url {
        flex: 1;
        display: flex;
        gap: 0.5em;
        min-width: 0; // wtf css

        input {
            flex: 1;
            min-width: 0; // seriously
        }
    }
</style>