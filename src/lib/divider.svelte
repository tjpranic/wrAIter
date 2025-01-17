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
        border: 1px solid;
    }
    .dashed {
        border: 1px dashed;
    }
    .dotted {
        border: 1px dotted;
    }
</style>