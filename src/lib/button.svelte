<script lang="ts">
    let props = $props( );
</script>

<button {...props}>
    {@render props.children?.( )}
</button>