import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'
import test1 from '../views/test1'
import test2 from '../views/test2'
import ChatRoom from  '../views/ChatRoom'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        hidden: true
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        hidden: true,
        children: [
            {
                path: '/chatRoom',
                name: '聊天室',
                component: ChatRoom
            }
        ]
    },
    // {
    //     path: '/',
    //     name: '导航一',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/test9991',
    //             name: 'test1',
    //             component: test1
    //         },
    //         {
    //             path: '/test9992',
    //             name: 'test2',
    //             component: test2
    //         },
    //     ]
    // },

]

const router = new VueRouter({
    routes
})

export default router
