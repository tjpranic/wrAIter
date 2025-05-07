<script lang="ts">
    let { children } = $props( );
</script>

<div class="page">
    {@render children( )}
</div>

<style lang="scss">
    .page {
        max-width:        99rem;
        width:            100%;
        margin:           0 auto;
        padding:          1.5rem;
        min-height:       100vh;
        background-color: var( --bg-primary );
        box-sizing:       border-box;

        @media( min-width: 768px ) {
            padding: 2rem;
        }
    }
</style>