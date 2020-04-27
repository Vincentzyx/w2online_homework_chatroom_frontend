<template>
  <div id="app">
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import SocketIO from 'socket.io-client'

export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data() {
        return {
            socket: {}
        }
    },
    mounted() {
        this.socket = SocketIO("http://localhost:8081/");
        this.socket.on("message", function(msg) {
            console.log(msg);
            console.log("test");
        });
        setInterval(()=>{
            this.socket.emit("message", "connected from client");
        }, 1000);
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
