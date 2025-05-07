<script lang="ts">
    import Button from './button.svelte';

    let { showing, title, content, ok, cancel, close } = $props( );

    let dialog: HTMLDialogElement;

    $effect( ( ) => {
        if( showing ) {
            dialog.showModal( );
        }
        else {
            dialog.close( );
        }
    } );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-container">
        <div class="header">
            <div class="title">
                {@render title( )}
            </div>
            <Button onclick={close} class="close-button">×</Button>
        </div>
        <hr />
        <div class="modal-content">
            {@render content?.( )}
        </div>
        <div class="controls">
            <Button onclick={ok} class="primary">OK</Button>
            <Button onclick={cancel}>Cancel</Button>
        </div>
    </div>
</dialog>

<style lang="scss">
    dialog {
        max-width:        32rem;
        padding:          0;
        background-color: var( --bg-secondary );
        border-radius:    var( --border-radius );
        color:            var( --text-primary );
        border:           none;
    }

    dialog::backdrop {
        background:      rgba( 0, 0, 0, 0.5 );
        backdrop-filter: blur( 2px );
    }

    .modal-container {
        padding: 1rem;

        .header {
            display:       flex;
            align-items:   center;
            margin-bottom: 0.5rem;

            .title {
                flex:          1;
                padding-right: 0.5rem;

                :global( h3 ) {
                    margin:      0;
                    font-weight: 500;
                }
            }

            :global( .close-button ) {
                padding:     0.25rem 0.5rem;
                font-size:   1rem;
                line-height: 1;
            }
        }

        hr {
            border:     none;
            border-top: 1px solid var( --border-color );
            margin:     0.5rem 0 1rem 0;
        }

        .modal-content {
            margin-bottom: 1.5rem;
        }

        .controls {
            display:         flex;
            justify-content: flex-end;
            gap:             0.5rem;
        }
    }

    dialog[open] {
        animation: zoom 0.3s cubic-bezier( 0.34, 1.56, 0.64, 1 );
    }

    @keyframes zoom {
        from {
            transform: scale( 0.95 );
            opacity:   0;
        }
        to {
            transform: scale( 1 );
            opacity:   1;
        }
    }

    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
