<template>
    <el-container>
        <!---------------------
         |       顶栏        |
        ---------------------->
        <el-header class="header">
            <div>微人事</div>
            <div class="header--right">
                <el-button class="el-button--text" type="text"
                           :disabled="$route.path==='/chatRoom'"
                           @click="handleChatClick">
                    <el-badge :value="msgDot" :max="99"><i class="el-icon-chat-line-round"></i></el-badge>
                </el-button>
                <el-dropdown @command="commandHandler">
                    <span class="user">
                        <img class="userface" :src="user.userface" alt="">{{user.name}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="my">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>

        <el-container>
            <!---------------------
             |     左侧菜单      |
            ---------------------->
            <el-aside class="aside" width="200px">
                <el-menu router unique-opened v-for="(item, index) in this.$router.options.routes" :key="index+10">
                    <el-submenu :index="index.toString()" v-if="!item.hidden">
                        <template slot="title">
                            <i :class="item.iconcls" style="color: blueviolet; margin-right: 5px;"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
                            {{child.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
                <el-menu router unique-opened v-for="(item, index) in routes" :key="index">
                    <el-submenu :index="index.toString()" v-if="!item.hidden">
                        <template slot="title">
                            <i :class="item.iconcls" style="color: blueviolet; margin-right: 5px;"></i>
                            <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.path" v-for="child in item.children" :key="child.path">
                            {{child.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!---------------------
             |     主要内容页     |
            ---------------------->
            <el-main class="el-main">
                <el-breadcrumb class="breadcrumb" separator="/" v-if="this.$router.currentRoute.path!=='/home'">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div v-else>微人事首页</div>
                <!---------------------
                 |      子 页 面      |
                ---------------------->
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import {getRequest} from "../utils/api";
    import {mapState} from 'vuex'

    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem('user')),
                opens: []
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            },
            ...mapState([
                'msgDot'
            ])
        },
        methods: {
            commandHandler(cmd) {
                let _this = this;
                if (cmd === 'logout') {
                    _this.$confirm('点击确定退出登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        getRequest('/logout');
                        window.sessionStorage.removeItem('user');
                        _this.$store.commit('initMenu', []);
                        _this.$router.replace('/');
                    }).catch(() => {
                        _this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }
            },
            handleChatClick() {
                this.$router.push('/chatRoom');
            }
        }
    }
</script>

<style>
    .header {
        background-color: #5394ec;
        color: #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header--right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .el-button--text {
        color: #ccc !important;
        font-size: 2em !important;;
        margin-right: 15px !important;;
    }

    .el-button--text:hover {
        color: #eee !important;;
    }

    .user {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .userface {
        width: 32px;
        height: 32px;
        -webkit-border-radius: 16px;
        -moz-border-radius: 16px;
        border-radius: 16px;
        margin-right: 10px;
    }

    .aside {
        height: 100%;
    }

    .el-main {
        text-align: left;
    }

    .breadcrumb {
        padding: 0 0 15px 0;
    }
</style>