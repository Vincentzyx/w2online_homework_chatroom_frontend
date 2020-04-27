import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
    {
        path: "/",
        components: ()=>import("@/components/HelloWorld.vue")
    }
]

const router = new VueRouter({
    routes
})


new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
