<template>
    <div class="container">
        <div class="mid-content">
            <div class="info-bar">
                <img src="/default_avatar.jpg" />
                <div class="text-info">
                    <div class="room-name">{{roomInfo.name}}</div>
                    <div class="description">{{roomInfo.online + " 在线 · " + roomInfo.description}}</div>
                </div>
                <div class="right-side-btns">
                    <div class="search-btn">
                        <i class="el-icon-search"></i>
                    </div>
                    <div class="invite-btn">
                        <i class="el-icon-circle-plus-outline"></i>
                    </div>
                    <div class="more-btn">
                        <i class="el-icon-more"></i>
                        <div class="more-dropdown">
                            <div @click="showSidebar=true">
                                修改信息
                                <i class="el-icon-edit"></i>
                            </div>
                            <div>
                                解散群组
                                <i class="el-icon-delete"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="message-area">
                <div v-for="msg in msgList" :key="msg.id" class="msg" :class="{'self-msg': msg.user==account.uidMd5}">
                    <img v-if="msg.user!=account.uidMd5" :src="'https://www.gravatar.com/avatar/'+msg.user+'?s=64&d=identicon'" />
                    <div v-if="msg.user!=account.uidMd5" class="text">
                        <div class="name">{{msg.name}}</div>
                        <div class="content">{{msg.msg}}</div>
                    </div>
                    <div v-if="msg.user==account.uidMd5" class="text">
                        <div class="name">{{msg.name}}</div>
                        <div class="content">{{msg.msg}}</div>
                    </div>
                    <img v-if="msg.user==account.uidMd5" :src="'https://www.gravatar.com/avatar/'+msg.user+'?s=64&d=identicon'" />
                </div>
            </div>
            <div class="input-area">
                <textarea @keydown="enterInput" spellcheck="false"
                v-model="msgInput">
                </textarea>
                <div class="edit-toolbox">
                    <div class="face"><i class="el-icon-picture-outline-round"></i></div>
                    <div class="select-file"><i class="el-icon-paperclip"></i></div>
                    <button @click="sendMsg"><i class="el-icon-s-promotion"></i></button>
                </div>
            </div>
        </div>
        <transition name="width">
            <div class="right-side-bar" v-show="showSidebar">
                <div class="close-sidebar" @click="showSidebar=false"><i class="el-icon-arrow-left"></i></div>
                <div class="room-info">
                    <img class="avatar" :src="roomInfo.avatar==''?'/default_avatar.jpg':roomInfo.avatar" />
                    <div class="text-info">
                        <div class="room-name">{{roomInfo.name}}</div>
                        <div class="description">{{roomInfo.description}}</div>
                    </div>
                </div>
                <div class="edit-info">
                    <div class="label">上传头像</div>
                    <div class="upload">
                        <el-upload
                        class="upload-avatar"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple>
                        <i class="el-icon-picture-outline"></i>
                        <div class="el-upload__text">拖拽文件，或<em>点击上传</em></div>
                        </el-upload>
                    </div>
                    <div class="label">群名</div>
                    <input spellcheck="false" v-model="modifyRoomInfo.name" />
                    <div class="label">简介</div>
                    <input spellcheck="false" v-model="modifyRoomInfo.description" />
                    <button>确认</button>
                </div>


            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
$hoverColor: rgb(37, 139, 255);
$activeColor: rgb(34, 108, 194);
$mainBorder: 2px solid rgba(211, 211, 211, 0.5);
$mainShadow: 1px 1px 3px lightgray;
$bottomShadow: 0px 1px 3px rgba(211, 211, 211, 0.5);
$leftShadow: -2px 0px 2px rgba(211, 211, 211, 0.5);

@mixin setHoverColor {
    transition: color 0.3s;
    &:hover {
        color: $hoverColor;
        cursor: pointer;
    }
    &:active {
        color: $activeColor;
    }
}

.width-enter-active, .width-leave-active {
    transition: width .3s;
}

.width-enter, .width-leave-to {
    width: 0% !important;
}

.container {
    display: flex;
    flex-direction: row;

    .mid-content {
        flex: 1;

        .info-bar {
            height: 70px;
            display: flex;
            flex-direction: row;
            align-items: center;
            box-shadow: $bottomShadow;

            img {
                height: 50px;
                width: 50px;
                margin: {
                    left: 4vw;
                }
                border-radius: 50%;
            }

            .text-info {
                margin: {
                    top: 1.4vh;
                    left: 0.8vw;
                }
                .room-name {
                    line-height: 0.8rem;
                    font-size: 0.9rem;
                }
                .description {
                    line-height: 2rem;
                    font-size: 0.8rem;
                    color: gray;
                }
            }

            .right-side-btns {
                position: relative;
                margin-left: auto;
                margin-right: 30px;
                font-size: 1.3rem;
                .search-btn {
                    display: inline-block;
                    @include setHoverColor;
                }
                .invite-btn {
                    display: inline-block;
                    margin-left: 20px;
                    @include setHoverColor;
                }
                .more-btn {
                    display: inline-block;
                    margin-left: 20px;
                    @include setHoverColor;

                    &:hover .more-dropdown {
                        height: 68px;
                        padding-top: 10px;
                    }
                }
                .more-dropdown {
                    position: absolute;
                    left: -20px;
                    top: 30px;
                    width: 140px;
                    height: 0px;
                    padding-top: 0px;
                    color: black;
                    text-align: center;
                    font-size: 1rem;
                    line-height: 1.6rem;
                    background-color: white;
                    box-shadow: 1px 1px 5px lightgray;
                    overflow: hidden;
                    transition: all .3s;
                    div {
                        @include setHoverColor;
                        i {
                            margin-left: 10px;
                            margin-bottom: 10px;
                        }
                    }
                }
            }
        }
        
        .message-area {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: calc(80vh - 70px);
            overflow-y: auto;
            padding: 20px 0;
            box-shadow: $bottomShadow;
            box-sizing: border-box;
            /* width */
            &::-webkit-scrollbar {
                width: 5px;
            }
            /* Track */
            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            /* Handle */
            &::-webkit-scrollbar-thumb {
                background: #888;
            }
            /* Handle on hover */
            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            .self-msg {
                align-self: flex-end;
                margin-left: 0 !important;
                margin-right: 40px;
                text-align: right;

                .text {
                    .name {
                        white-space: nowrap;
                    }

                    border-radius: 10px 10px 0 10px !important;
                }
            }

            .msg {
                margin-left: 40px;
                img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: inline-block;
                }
                .text {
                    display: inline-block;
                    background-color: #f5f6fa;
                    padding: 15px;
                    margin: 15px;
                    max-width: 40%;
                    vertical-align: bottom;
                    border-radius: 10px 10px 10px 0;
                    .name {
                        font-weight: bold;
                        font-size: 0.95rem;
                    }
                    .content {
                        margin-top: 5px;
                    }
                }
            }
        }

        .input-area {
            width: 100%;
            height: 20vh;
            display: flex;
            flex-direction: row;

            textarea {
                display: block;
                flex: 1;
                outline: none;
                border: none;
                margin: 20px;
                font-size: 1.6rem;
                overflow-y: auto;
                background-color: rgb(245, 245, 245);
                resize: none;
                /* width */
                &::-webkit-scrollbar {
                    width: 3px;
                }
                /* Track */
                &::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                /* Handle */
                &::-webkit-scrollbar-thumb {
                    background: #888;
                }
                /* Handle on hover */
                &::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            }

            .edit-toolbox {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin-top: 20px;
                line-height: 2.8rem;
                font-size: 1.2rem;
                color:gray;
                width: 150px;
                margin-left: auto;

                .select-file {
                    @include setHoverColor;
                }

                .face {
                    @include setHoverColor;
                }

                button {
                    color: white;
                    background-color: #0176ff;
                    border: none;
                    outline: none;
                    height: 40px;
                    width: 40px;
                    margin-right: 20px;
                    font-size: 1.3rem;
                    border-radius: 50%;
                    &:hover {
                        background-color: #006deb;
                        cursor: pointer;
                    }
                    &:active {
                        background-color: #0055b6;
                    }
                }
            }
        }
    }

    .right-side-bar {
        display: flex;
        flex-direction: column;
        width: 25%;
        border-left: $mainBorder;
        overflow-x: hidden;
        overflow-y: auto;
        .close-sidebar {
            margin-top: 10px;
            margin-left: 10px;
            font-size: 1.6rem;
            @include setHoverColor;
        }

        .room-info {
            text-align: center;
            min-width: 100px;
            .avatar {
                width: 100px;
                height: 100px;
                margin-top: 10%;
                border-radius: 50%;
            }
            .room-name {
                font-size: 1.3rem;
            }
            .description {
                margin-top: 5px;
                color:gray;
            }
        }
        .edit-info {
            flex: 1;
            margin-top: 10%;
            height: 50%;
            border-radius: 5px;
            background-color: #f5f6fa;

            .upload {
                margin-top: 10px;
            }
            .label {
                margin-top: 20px;
                margin-left: 10%;
                font-size: 0.9rem;
                color:gray;
                white-space: nowrap;
            }
            input {
                display: block;
                margin: auto;
                margin-top: 10px;
                padding: 5px;
                font-size: 1rem;
                width: 80%;
                height: 1.8rem;
                text-indent: 5px;
                border: none;
                background-color: #edeef6;

                &:hover {
                    background-color: #e0e0f0;
                }

                &:focus {
                    outline: #d5d5e5 solid 1px;
                }
            }
            button {
                display: block;
                border: none;
                border-radius: 5px;
                color: white;
                width: 85%;
                height: 35px;
                margin: auto;
                margin-top: 20px;
                font-size: 0.95rem;
                outline: none;
                background-color: #0176ff;
                &:hover {
                    background-color: #006deb;
                    cursor: pointer;
                }
                &:active {
                    background-color: #0055b6;
                }
            }
        }
    }
}

</style>

<style lang="scss">

.el-upload {
    display: block;
    width: 80%;
    min-width: 100px;
    height: 120px;
    margin: 0 auto;

    .el-upload-dragger {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #edeef6;
        border: none;

        &:hover {
            background-color: #e0e0f0;
            border: none;
        }

        .el-icon-picture-outline {
            margin-top: 20px;
            line-height: 3.2rem;
            font-size: 1.6rem;
            color: white;
            background-color: #0176ff;
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        .el-upload__text {
            margin-top: 10px;
            white-space: nowrap;
        }
    }
}
</style>

<script>
export default {
    data() {
        return {
            roomInfo: this.$parent.roomInfo,
            account: this.$parent.account,
            modifyRoomInfo: {
                roomid: "",
                name: "群聊",
                description: "这里什么都没有",
                avatar: "default_avatar.jpg",
            },
            showSidebar: false,
            msgList: [

            ],
            msgInput: ""
        }
    },
    methods: {
        sendMsg() {
            if (this.msgInput.length > 0)
            {
                this.io.emit("message", this.msgInput);
            }
        },
        enterInput(e){
            if(e.keyCode == 13 && e.ctrlKey)
            {
                this.msgInput += "\n";
            }
            else if(e.keyCode == 13){
                this.sendMsg();
                e.preventDefault();
            }
        },
        roomInfoChange() {
            this.modifyRoomInfo.roomid = val.roomid;
            this.modifyRoomInfo.name = val.name;
            this.modifyRoomInfo.description = val.description;
            this.modifyRoomInfo.avatar = val.avatar;
            console.log("modified");
        },
        joinRoom(roomid, callback) {
            this.io.emit("join_room", roomid, callback);
        },
        getHistory() {
            if (this.msgList.length == 0)
            {
                this.io.emit("msg_history", this.roomInfo.roomid, 1, -1, (r) => {
                    if (r.code == 0)
                    {
                        this.msgList = r.data;
                    }
                    else
                    {
                        this.$message.error(r.msg);
                    }
                });
            }
            else
            {
                this.io.emit("msg_history", this.roomInfo.roomid, 1, msgList[0].id, (r) => {
                    if (r.code == 0)
                    {
                        for (let msg of r.data)
                        {
                            this.msgList.splice(0, 0, msg);
                        }
                    }
                    else
                    {
                        this.$message.error(r.msg);
                    }
                });
            }
            this.scrollToEnd();
        },
        scrollToEnd() {
            var container = this.$el.getElementsByClassName("message-area")[0];
            container.scrollTop = container.scrollHeight;
        }
    },
    mounted() {
        this.$parent.$on("roomInfoChange", this.roomInfoChange);
        this.io.on("message", (data) => {
            this.msgList.push(data);
            this.scrollToEnd();
        });
    },
    beforeRouteUpdate (to, from, next) {
        this.roomInfo.roomid = to.params["room"];
        this.getHistory();
        next();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.roomInfo.roomid = vm.$route.params["room"];
            vm.joinRoom(vm.roomInfo.roomid, (r) => {
                vm.getHistory();
            });
        })
    },
    watch: {

    }
}
</script>