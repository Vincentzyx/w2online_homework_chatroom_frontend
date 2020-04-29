<template>
    <dir class="container">
        <div class="title">聊天室</div>
        <div class="mid">
            <input v-model="roomInfo.roomid" @keydown.enter="joinRoom()" placeholder="请输入房间号" type="text">
            <button @click="joinRoom()"><i class="el-icon-arrow-right"></i></button>
        </div>
        <div class="create-tip">不知道房间号？<span @click="showCreatePanel=!showCreatePanel">创建房间</span></div>
        <transition name="fade">
            <div class="room-info" v-show="showCreatePanel">
                <div>房间信息</div>
                <input type="text" placeholder="房间名" v-model="createRoomInfo.name" />
                <input type="text" placeholder="房间描述" v-model="createRoomInfo.description" />
                <div class="btn-container">
                    <button @click="createRoom()">创建房间</button>
                </div>
            </div>
        </transition>
    </dir>
</template>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}


.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    .title {
        margin-top: 10%;
        margin-bottom: 3%;
        font-size: 3rem;
        font-weight: 120;
        color: #0176ff;
    }

    .mid {
        display: flex;
        width: 60%;
        text-align: center;
    }

    button {
        display: inline-block;
        border: none;
        border-radius: 0 5px 5px 0;
        color: white;
        width: 3rem;
        height: 3rem;
        font-size: 1rem;
        
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

    input {
        display: inline-block;
        padding: 5px 1rem;
        font-size: 1rem;
        flex: 1;
        height: 3rem;
        text-indent: 5px;
        box-sizing: border-box;
        border: none;
        background-color: #ededed;
        border-radius: 5px 0 0 5px;
        outline: none;
    }
    
    .create-tip {
        text-align: left;
        width: 60%;
        margin-left: 10px;
        margin-top: 10px;
        span {
            color: #0176ff;
            text-decoration: underline;
            cursor: pointer;
            &:hover {
                color: #006deb;
                cursor: pointer;
            }
            &:active {
                color: #0055b6;
            }
        }
    }

    .room-info {
        box-sizing: border-box;
        margin-top: 5%;
        text-align: left;
        width: 60%;
        padding: 20px;
        border-radius: 5px;
        // background-color:#fafafa;
        box-shadow: 0 0 5px rgba(128, 128, 128, 0.61);
        div {
            font-size: 1.1rem;
            margin-left: 5px;
            margin-bottom: 10px;
        }
        input {
            display: block;
            margin-top: 10px;
            width: 100%;
        }
        .btn-container 
        {
            text-align: center;
        }
        button {
            margin-top: 20px;
            width: 100%;
            border-radius: 5px;
        }
    }
}
</style>

<script>

export default {
    inject: [
        "roomInfo",
        "account"
    ],
    data() {
        return {
            showCreatePanel: false,
            createRoomInfo: {
                name: "",
                description: "",
                avatar: ""
            }
        }
    },
    methods: {
        joinRoom() {
            if (this.$parent.roomInfo.roomid != "")
            {
                this.io.emit("leave_room");
            }
            this.io.emit("join_room", this.roomInfo.roomid, (r)=>{
                if (r.code == 0)
                {
                    this.roomInfo = r.data;
                    this.$router.push("/" + r.data.roomid);
                }
                else
                {
                    this.$message.error(r.msg);
                }
            });
        },
        createRoom() {
            if (this.$parent.roomInfo.roomid != "")
            {
                this.io.emit("leave_room");
            }
            this.io.emit("create_room", (r)=>{
                this.io.emit("message", "我创建了群聊");
                console.log(r);
                this.io.emit("modify_roominfo", r.data.roomid, this.createRoomInfo, (r)=>{
                    console.log(r);
                    this.roomInfo.name = r.data.name;
                    this.roomInfo.avatar = r.data.avatar;
                    this.roomInfo.description = r.data.description;
                });
                this.$router.push("/" + r.data.roomid);
            });
        }
    }
}
</script>