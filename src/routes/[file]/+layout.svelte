<script lang="ts">
    let { children } = $props( );
</script>

<div class="page">
    {@render children( )}
</div>

<style lang="scss">
    @media( min-width: 99em ) {
        .page {
            width: 99em;
            align-self: center;
            padding: 0.5em;
            background-color: #333;
        }
    }
    .page {
        padding: 0 1em 0 1em;
        background-color: #333;
    }
</style>