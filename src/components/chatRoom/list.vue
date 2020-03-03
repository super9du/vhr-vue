<template>
    <div id="list">
        <ul>
            <li v-for="item in hrs" :class="{ active: friend?item.username===friend.username:false }"
                v-on:click="changeFriend(item)">
                <img class="avatar" :src="item.userface" :alt="item.username">
                <el-badge :value="unread[item.username]" :max="99"><p class="name">{{item.username}}</p></el-badge>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'list',
        data() {
            return {
                hasMsg: false,
            }
        },
        computed: mapState([
            'hrs',
            'friend',
            'unread'
        ]),
        methods: {
            changeFriend: function (friend) {
                this.$store.commit('changeFriend', friend)
            }
        }
    }
</script>

<style lang="scss" scoped>
    #list {
        ul {
            padding-left: 0;
        }
        li {
            padding: 15px 15px;
            border-bottom: 1px solid #292C33;
            cursor: pointer;
            &:hover {
                background-color: rgba(255, 255, 255, 0.03);
            }
        }
        li.active { /*注意这个是.不是冒号:*/
            background-color: rgba(255, 255, 255, 0.1);
        }
        .avatar {
            border-radius: 2px;
            width: 30px;
            height: 30px;
            vertical-align: middle;
        }
        .name {
            display: inline-block;
            margin-left: 15px;
            margin-top: 0;
            margin-bottom: 0;
        }
    }
</style>
