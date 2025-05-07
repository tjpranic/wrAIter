<script lang="ts">
    let props = $props( );

    // Extract the class property to merge it with our button classes
    let buttonClass = props.class || '';
</script>

<button class={buttonClass} {...props}>
    {@render props.children?.( )}
</button>

<style lang="scss">
    button {
        background-color: var( --bg-tertiary );
        border: 1px solid var( --border-color );
        color:            var( --text-primary );
        border-radius:    var( --border-radius );
        transition:   all var( --transition-speed ) ease;
        cursor:           pointer;
        font-family:      inherit;

        &:hover:not( :disabled ) {
            background-color: var( --bg-hover );
            border-color:     var( --accent-primary );
        }
        &:disabled {
            opacity: 0.6;
            cursor:  not-allowed;
        }
        &.primary {
            background-color: var( --accent-primary );
            border-color:     var( --accent-primary );

            &:hover:not( :disabled ) {
                background-color: var( --accent-hover );
                border-color:     var( --accent-hover );
            }
        }
        &.danger {
            background-color: var( --error-color );
            border-color:     var( --error-color );

            &:hover:not( :disabled ) {
                background-color: color-mix( in srgb, var( --error-color ) 80%, white );
                border-color:     color-mix( in srgb, var( --error-color ) 80%, white );
            }
        }
    }
</style>