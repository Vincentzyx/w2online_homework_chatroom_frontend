<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import socket from "@/socket.js"
import { MessageBox } from "element-ui"

export default {
    name: 'App',
    components: {

    },
    data() {
        return {
            
        }
    },
    mounted() {
        socket.connect();

    }
}
</script>

<style>

</style>
