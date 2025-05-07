<script lang="ts">
</script>

<div class="header">
    <h1>wrAIter</h1>
</div>

<style lang="scss">
    .header {
        display:     flex;
        align-items: center;
        padding:     1rem 0;

        h1 {
            flex:            1;
            margin:          0;
            font-weight:     700;
            font-size:       2.2rem;
            letter-spacing: -0.5px;
            color:           var( --text-primary );
            position:        relative;
            display:         inline-block;

            &::after {
                content:       '';
                position:      absolute;
                bottom:        0;
                left:          0;
                width:         60px;
                height:        4px;
                background:    linear-gradient( 90deg, var( --accent-primary ), var( --accent-secondary ) );
                border-radius: 2px;
            }
        }
    }
</style>