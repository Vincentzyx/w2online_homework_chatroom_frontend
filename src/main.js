import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SocketIO from 'socket.io-client';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.prototype.io = SocketIO();

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
