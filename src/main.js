import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SocketIO from 'socket.io-client';
import VueClipboard from 'vue-clipboard2';

let debug = false;

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueClipboard);

Vue.prototype.config = {
    httpProtocol: "http://",
    fullurl: "http://chat.vi.tn/#",
    fullurl_s: "http://chat.vi.tn/#/",
    host: "chat.vi.tn",
    socketioUrl: "http://106.53.7.10:5000/",
    gravatarUrl: "http://chat.vi.tn/gravatar"
}

if (debug)
{
    Vue.prototype.config = {
        httpProtocol: "http://",
        fullurl: "http://localhost:8081/#",
        fullurl_s: "http://localhost:8081/#/",
        host: "localhost:8081",
        socketioUrl: "http://localhost:5000/",
        gravatarUrl: "https://www.gravatar.com"
    }
}



Vue.prototype.io = SocketIO("http://106.53.7.10:5000/");

const routes = [
    {
        path: "/",
        component: ()=>import("@/components/Join.vue")
    },
    {
        path: "/profile",
        component: ()=>import("@/components/Profile.vue")
    },
    {
        path: "/:room",
        component: ()=>import("@/components/Chat.vue")
    }
]

const router = new VueRouter({
    routes
})


new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
