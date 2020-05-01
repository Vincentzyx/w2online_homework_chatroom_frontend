<template>
    <div class="container" @click="$message.info('图片加载中，请稍后')">

    </div>
</template>

<style lang="scss" scoped>
.container {
    background-image: url('http://chat.vi.tn/cute-girls/');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
}
</style>

<script>
export default {
    computed: {

    }
}
</script>