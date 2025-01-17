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
    <div>
        <div class="header">
            <div class="title">
                {@render title( )}
            </div>
            <Button onclick={close}>X</Button>
        </div>
        <hr />
        {@render content?.( )}
        <Button onclick={ok}>OK</Button>
        <Button onclick={cancel}>Cancel</Button>
    </div>
</dialog>

<style lang="scss">
    dialog {
        max-width: 32em;
        border-radius: 0.2em;
        border: none;
        padding: 0;
        background-color: #333;
        color: #eee;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
        padding: 0.5em;

        .header {
            display: flex;

            .title {
                flex: 1;
                padding-right: 0.5em;
            }
        }
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
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
