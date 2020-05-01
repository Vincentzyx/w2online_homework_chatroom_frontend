<template>
    <dir class="container">
        <div class="title">聊天室</div>
        <div class="mid">
            <input v-model="$parent.roomInfo.roomid" @keydown.enter="joinRoom()" placeholder="请输入房间号" type="text">
            <button @click="joinRoom()"><i class="el-icon-arrow-right"></i></button>
        </div>
        <div class="create-tip">不知道房间号？<span @click="showCreatePanel=!showCreatePanel">创建房间</span></div>
        <transition name="fade">
            <div class="room-info" v-show="showCreatePanel">
                <div class="label">房间信息</div>
                <button class="choose-avatar" @click="showCropUpload=true" :style="editAvatarBackground">选择头像</button>
                <input type="text" placeholder="房间名" v-model="createRoomInfo.name" />
                <input type="text" placeholder="房间描述" v-model="createRoomInfo.description" />
                <div class="btn-container">
                    <button @click="createRoom()">创建房间</button>
                </div>
                <image-upload url="/api/avatar-upload" field="file"
                @crop-upload-success="cropUploadSuccess"
                @crop-upload-fail="cropUploadFail" v-model="showCropUpload">
                </image-upload>
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
        margin-top: 5%;
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
        .label {
            margin-bottom: 10px;
        }
        .choose-avatar {
            background-color:#777777;
            &:hover {
                background-color:#777777;
            }
            background-size: cover;
            background-position-y: 50%;
        }
        div {
            font-size: 1.1rem;
        }
        input {
            display: block;
            margin-top: 10px;
            height: 40px;
            width: 100%;
            border-radius: 5px;
        }
        .btn-container 
        {
            width: 100%;
            text-align: center;
        }
        button {
            margin-top: 10px;
            width: 100%;
            height: 40px;
            border-radius: 5px;
        }
    }
}
</style>

<script>
import ImageUpload from "vue-image-crop-upload"

export default {
    components: {
        ImageUpload
    },
    data() {
        return {
            showCreatePanel: false,
            showCropUpload: false,
            createRoomInfo: {
                name: "",
                description: "",
                avatar: ""
            }
        }
    },
    computed: {
        editAvatarBackground() {
            if (this.createRoomInfo.avatar != this.$parent.roomInfo.avatar)
            {
                return "background-image: url('/api" + this.createRoomInfo.avatar + "')";
            }
            else
            {
                return "";
            }
        }
    },
    methods: {
        joinRoom() {
            if (this.$parent.roomInfo.roomid != "")
            {
                this.io.emit("join_room", this.$parent.roomInfo.roomid, true, (r)=>{
                    if (r.code == 0)
                    {
                        this.$parent.roomInfo = r.data;
                        this.$router.push("/" + r.data.roomid);
                    }
                    else
                    {
                        this.$message.error(r.msg);
                    }
                });
            }
        },
        createRoom() {
            this.io.emit("leave_room", (r)=>{
                this.io.emit("create_room", (r)=>{
                    this.io.emit("message", "我创建了群聊");
                    this.io.emit("modify_roominfo", r.data.roomid, this.createRoomInfo, (r)=>{
                        this.$parent.roomInfo.name = r.data.name;
                        this.$parent.roomInfo.avatar = r.data.avatar;
                        this.$parent.roomInfo.description = r.data.description;
                    });
                    this.$router.push("/" + r.data.roomid);
                });
            });
        },
        cropUploadSuccess(r, field){
            if (r.code == 0)
            {
                this.createRoomInfo.avatar = r.data;
            }
            else
            {
                this.$message.error("上传失败：" + r.msg);
            }
        },
        cropUploadFail(status, field){
            this.$message.error("上传失败：" + status);
        }
    }
}
</script>