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
        padding: 0 0 1rem 0;

        .label {
            flex:        0.2;
            min-width:   8rem;
            padding-top: 0.5rem;
            font-weight: 500;
            color:       var( --text-secondary );

            :global( label ) {
                display: inline-block;
            }
        }

        .content {
            display:        flex;
            flex-direction: column;
            flex:           1;
            min-width:      0;

            :global( textarea ) {
                padding:                 0.5rem;
                min-height:              2.5rem;
                height:                  2.5rem;
                min-width:               0;
                border-radius:           var( --border-radius );
                background-color:        var( --bg-input );
                border:        1px solid var( --border-color );
                color:                   var( --text-primary );
                transition: border-color var( --transition-speed ) ease;
                resize:                  vertical;
                box-sizing:              border-box;
                font-family:             inherit;

                &:focus {
                    border-color: var( --accent-primary );
                    outline:      none;
                }

                &:disabled {
                    opacity: 0.6;
                    cursor:  not-allowed;
                }
            }

            :global( input ) {
                height:     2.5rem;
                box-sizing: border-box;
            }
        }
    }

    .row-stacked {
        display:        flex;
        flex-direction: column;
        padding:        0 0 1.5rem 0;

        .label {
            padding: 0 0 0.5rem 0;
        }
    }

    @media( max-width: 768px ) {
        .row-side-by-side {
            flex-direction: column;

            .label {
                padding:   0 0 0.5rem 0;
                min-width: 100%;
            }
        }
    }
</style>