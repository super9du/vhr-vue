import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui'
import {initMenu} from "./utils/menu";
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css';



Vue.config.productionTip = false;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next();
    } else {
        if (window.sessionStorage.getItem('user')) {
            initMenu(store, router);
            next();
        }
        else {
            next('/?redirect=' + to.path);
        }
    }
});

// import {postKvRequest} from "./utils/api";
// import {postRequest} from "./utils/api";
// import {putRequest} from "./utils/api";
// import {getRequest} from "./utils/api";
// import {deleteRequest} from "./utils/api";
//
// Vue.prototype.postKvRequest = postKvRequest();
// Vue.prototype.postRequest = postRequest();
// Vue.prototype.putRequest = putRequest();
// Vue.prototype.getRequest = getRequest();
// Vue.prototype.deleteRequest = deleteRequest();

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
