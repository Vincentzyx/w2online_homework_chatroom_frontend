import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SocketIO from 'socket.io-client';
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueClipboard);

Vue.prototype.io = SocketIO();
// Vue.prototype.config = {
//     fullurl: "http://localhost:8081/#",
//     fullurl_s: "http://localhost:8081/#/",
//     host: "localhost"
// }

Vue.prototype.config = {
    fullurl: "http://chat.vi.tn/#",
    fullurl_s: "http://chat.vi.tn/#/",
    host: "chat.vi.tn"
}

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
