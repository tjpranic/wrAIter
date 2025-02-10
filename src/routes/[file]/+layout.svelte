<script lang="ts">
    let { children } = $props( );
</script>

<div class="page">
    {@render children( )}
</div>

<style lang="scss">
    @media( min-width: 99em ) {
        .page {
            width: 99rem;
            align-self: center;
            padding: 0.5rem;
            background-color: #333;
        }
    }
    .page {
        padding: 0 1em 0 1rem;
        background-color: #333;
    }
</style>