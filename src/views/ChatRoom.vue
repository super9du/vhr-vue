<template>
    <div id="chatRoom">
        <div class="sidebar">
            <card></card>
            <list></list>
        </div>
        <div class="main">
            <message></message>
            <usertext></usertext>
        </div>
    </div>
</template>

<script>
    import card from '../components/chatRoom/card.vue'
    import list from '../components/chatRoom/list.vue'
    import message from '../components/chatRoom/message.vue'
    import usertext from '../components/chatRoom/usertext.vue'

    export default {
        name: 'chatRoom',
        data () {
            return {

            }
        },
        mounted:function() {
            this.$store.dispatch('initData');
        },
        components:{
            card,
            list,
            message,
            usertext
        }
    }
</script>

<style lang="scss" scoped>
    #chatRoom {
        margin: 20px auto;
        width: 800px;
        height: 600px;
        overflow: hidden;
        border-radius: 10px;
        .sidebar, .main {
            height: 100%;
        }
        .sidebar {
            float: left;
            color: #f4f4f4;
            background-color: #2e3238;
            width: 200px;
        }
        .main {
            position: relative;
            overflow: hidden;
            background-color: #eee;
        }
    }
</style>
