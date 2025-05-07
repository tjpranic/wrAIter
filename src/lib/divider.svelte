<script module lang="ts">
    export const DIVIDER_STYLE_SOLID  = 'solid';
    export const DIVIDER_STYLE_DASHED = 'dashed';
    export const DIVIDER_STYLE_DOTTED = 'dotted';
</script>

<script lang="ts">
    let { style, ...props } = $props( );
</script>

<hr class={style} {...props}/>

<style lang="scss">
    .solid {
        border: 0;
        border-bottom: 1px solid;
        color: var( --border-color );
    }
    .dashed {
        border: 1px dashed;
        color: var( --border-color );
    }
    .dotted {
        border: 1px dotted;
        color: var( --border-color );
    }
</style>