<template>
    <div id="uesrtext">
        <textarea v-model="content"
                  :placeholder="inputTip"
                  v-on:keyup="addMessage"
                  :disabled="disableInput">
        </textarea>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'uesrtext',
        data() {
            return {
                content: '',
                inputTip: '',
            }
        },
        computed: {
            disableInput() {
                if (this.friend) {
                    this.inputTip = '按 Ctrl + Enter 发送';
                    return false;
                } else {
                    this.inputTip = '您未选择好友，请先选择好友';
                    return true;
                }
            },
            ...mapState([
                'friend',
                'you'
            ])
        },
        methods: {
            addMessage(e) {
                if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
                    let chat = {
                        to: this.friend.username,
                        content: this.content,
                    };
                    console.log('chat.to' + chat.to);
                    this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(chat));

                    console.log('this.you:' + this.you);
                    chat.date = new Date();
                    chat.username = this.you.username;
                    chat.nickname = this.you.name;
                    console.log('chat.username' + chat.username);
                    console.log(chat.nickname);
                    this.$store.commit('addMessage', chat);

                    this.content = '';
                }
            },

        }
    }
</script>

<style lang="scss" scoped>
    #uesrtext {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 30%;
        border-top: solid 1px #DDD;
        > textarea {
            padding: 10px;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
        }
    }
</style>
