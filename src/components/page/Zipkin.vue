<template>
    <div class="iframe-div">
         <iframe id="zipkin-iframe" class="iframe" frameborder="0" scrolling="auto" ref="iframe" src="http://www.luojie.site:9411"></iframe>
    </div>
</template>

<script>

    export default {
        name: 'zipkin',
        data() {

        },
        created:function () {
        },
        method: {
        }
    }

</script>


<style scoped>
    .iframe {
        width: 100%;
        height: 100%;
        border: 0;
        overflow: hidden;
        box-sizing: border-box;
    }
    .iframe-div{
        height: 100%;
    }
</style>
