import Vue from 'vue'
import Vuex from 'vuex'
import {Notification} from 'element-ui';
import {getRequest} from "../utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

Vue.use(Vuex);

let store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {
            'you>friend': [{
                username: 'username',
                userface: 'userfaceUrl',
                date: new Date(),
                content: 'content',
                to: 'friend'
            }],
        },
        hrs: [],
        friend: undefined,
        you: JSON.parse(window.sessionStorage.getItem('user')),
        filterKey: '',
        stomp: null,
        unread: {},
        msgDot: null,
    },
    mutations: {
        changeFriend(state, friend) {
            Vue.set(state, 'friend', friend);
            if (state.unread[friend.username] && state.msgDot) {
                let msgDot = state.msgDot - state.unread[friend.username];
                Vue.set(state, 'msgDot', msgDot === 0 ? null : msgDot);
            }
            Vue.set(state.unread, friend.username, null);
        },
        addMessage(state, chat) {
            let you = state.you.username;
            let friend = you === chat.to ? chat.username : chat.to;
            let session = state.sessions[you + '>' + friend];
            if (!session) {
                // state.sessions[you + '>' + friend] = [];
                Vue.set(state.sessions, you + '>' + friend, []);
            }
            state.sessions[you + '>' + friend].push(chat);
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        INIT_DATA(state) {
            //恢复历史聊天记录
            let data = localStorage.getItem('vue-chat-session');
            //console.log(data)
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_HRS(state, hrs) {
            state.hrs = hrs;
        },
        INIT_CURRENT_HR(state, hr) {
            // state.you = hr;
            Vue.set(state, 'you', hr);
        },
    },
    actions: {
        connect(context) {
            context.state.stomp = Stomp.over(
                new SockJS('/ws/ep')
            );
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    let chat = JSON.parse(msg.body);
                    console.log('msg.body-----------');
                    console.log(chat);
                    if (!context.state.friend || chat.username !== context.state.friend.username) {
                        Notification({
                            title: '[ ' + chat.nickname + ' ] 发来的消息',
                            message: chat.content.length > 25 ? chat.content.substr(0, 25).concat('...') : chat.content,
                            position: 'bottom-right'
                        });
                        let unread = context.state.unread[chat.username];
                        unread ? Vue.set(context.state.unread, chat.username, unread + 1)
                            : Vue.set(context.state.unread, chat.username, 1);
                        let msgDot = context.state.msgDot;
                        msgDot ? Vue.set(context.state, 'msgDot', msgDot + 1)
                            : Vue.set(context.state, 'msgDot', 1)
                    }
                    context.commit('addMessage', chat);
                });
            })
        },
        initData(context) {
            getRequest('/chat-room/hrs').then(resp => {
                if (resp && resp.status === 200) {
                    context.commit('INIT_HRS', resp.obj);
                }
            });
            context.commit('INIT_DATA');
        }
    },
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;