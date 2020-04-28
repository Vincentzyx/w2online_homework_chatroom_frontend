import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
    {
        path: "/",
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
