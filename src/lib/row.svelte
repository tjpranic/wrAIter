<script module lang="ts">
    export const ROW_STYLE_SIDE_BY_SIDE = 'side-by-side';
    export const ROW_STYLE_STACKED      = 'stacked';
</script>

<script lang="ts">
    let { label, content, style } = $props( );

    let rowClass = $state( '' );

    switch( style ) {
        case ROW_STYLE_SIDE_BY_SIDE: {
            rowClass = 'row row-side-by-side';
            break;
        }
        case ROW_STYLE_STACKED: {
            rowClass = 'row row-stacked';
            break;
        }
    }
</script>

<div class={rowClass}>
    <div class="label">
        {@render label( )}
    </div>
    <div class="content">
        {@render content( )}
    </div>
</div>

<style lang="scss">
    .row {
        display: flex;
        padding: 0 0 0.5em 0;

        .label {
            flex: 0.1;
            min-width: 10em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            align-self: start;
        }
        .content {
            display: flex;
            flex: 1.5;
            min-width: 0;
            align-self: center;
            flex-direction: column;

            // TODO: move input and textarea into components
            :global( input ) {
                flex: 1;
            }
            :global( textarea ) {
                flex: 1;
                box-sizing: border-box;
                min-height: 2em;
                height: 2em;
                resize: vertical;
                min-width: 0;
            }
        }
    }
    .row-stacked {
        display: unset;
        padding: 0 0 0.5em 0;

        .label {
            padding: 0.5em 0 0.5em 0;
        }
    }
</style>