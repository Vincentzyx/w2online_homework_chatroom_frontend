<template>
    <div class="container">
        <div class="mid-content">
            <div class="info-bar">
                <img :src="roomAvatar" />
                <div class="text-info">
                    <div class="room-name">{{$parent.roomInfo.name}}</div>
                    <div class="description"><span :title="onlineDisplay">{{onlineList.length + " 在线"}}</span> · <span :title="$parent.roomInfo.description">{{$parent.roomInfo.description}}</span></div>
                </div>
                <div class="loading" v-show="loadingHistory">加载中 <i class="el-icon-loading"></i></div>
                <transition name="fade">
                    <div class="search-bar" v-show="showSearchbar">
                        <input type="text" placeholder="搜索聊天记录" v-model="searchText">
                    </div>
                </transition>
                <div class="right-side-btns">
                    <div class="search-btn" @click="showSearchbar=!showSearchbar">
                        <i class="el-icon-search"></i>
                    </div>
                    <div class="invite-btn" @click="showSidebar_Share=!showSidebar_Share">
                        <i class="el-icon-share"></i>
                    </div>
                    <div class="more-btn">
                        <i class="el-icon-more"></i>
                        <div class="more-dropdown">
                            <div class="btn-edit-info" @click="showSidebar_Info=true">
                                修改信息
                                <i class="el-icon-edit"></i>
                            </div>
                            <div class="btn-delete-room" @click="deleteRoom">
                                解散群组
                                <i class="el-icon-delete"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="message-area">
                <div v-for="msg in msgList" :key="msg.id" class="msg" :class="{'self-msg': msg.user==$parent.account.uidMd5}">
                    <div v-show="!showSearchbar || searchText=='' || msg.msg.indexOf(searchText) != -1">
                        <img class="user-avatar" v-if="msg.user!=$parent.account.uidMd5" :src="config.gravatarUrl + '/avatar/'+msg.user+'?s=64&d=identicon'" />
                        <div v-if="msg.user!=$parent.account.uidMd5" class="text">
                            <div class="name">{{msg.name}}</div>
                            <div class="content">{{msg.msg}}</div>
                            <div class="image" v-if="'images' in msg">
                                <div class="img" :style="'background-image:url(\'' + img + '\')'" v-for="(img, index) of msg.images" :key="index+img"></div>
                                <!-- <img class="img" :src="img" v-for="(img, index) of msg.images" :key="index+img"> -->
                            </div>
                        </div>
                        <div v-if="msg.user==$parent.account.uidMd5" class="text">
                            <div class="name">{{msg.name}}</div>
                            <div class="content">{{msg.msg}}</div>
                            <div class="image" v-if="'images' in msg">
                                <div class="img" :style="'background-image:url(\'' + img + '\')'" v-for="(img, index) of msg.images" :key="index+img"></div>
                                <!-- <img class="img" :src="img" v-for="(img, index) of msg.images" :key="index+img"> -->
                            </div>
                        </div>
                        <img class="user-avatar" v-if="msg.user==$parent.account.uidMd5" :src=" config.gravatarUrl + '/avatar/'+msg.user+'?s=64&d=identicon'" />
                    </div>
                </div>
            </div>
            <div class="input-area">
                <textarea @keydown="enterInput" spellcheck="false"
                v-model="msgInput">
                </textarea>
                <div class="edit-toolbox">
                    <div class="face">
                        <span @click="showFacePanel=!showFacePanel" :class="{active:showFacePanel}">☺</span>
                        <div v-if="showFacePanel" class="face-panel">
                            <div class="emoji-select">
                                <span :class="{active: emojiType==0}" @click="emojiType=0">😀</span>
                                <span :class="{active: emojiType==1}" @click="emojiType=1">🐱</span>
                                <span :class="{active: emojiType==2}" @click="emojiType=2">🍎</span>
                                <span :class="{active: emojiType==3}" @click="emojiType=3">⚽</span>
                                <span :class="{active: emojiType==4}" @click="emojiType=4">🚗</span>
                                <span :class="{active: emojiType==5}" @click="emojiType=5">💻</span>
                                <span :class="{active: emojiType==6}" @click="emojiType=6">🉑</span>
                                <span :class="{active: emojiType==7}" @click="emojiType=7">🚩</span>
                            </div>
                            <div class="emojis">
                                <div @click="msgInput+=emoji" v-for="emoji in emojis[emojiType]" :key="emoji">{{emoji}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="select-file" @click="showAttachPanel=!showAttachPanel"><i class="el-icon-paperclip"></i></div>
                    <div class="attach-panel" v-if="showAttachPanel">
                        <el-upload
                        class="upload-attachment"
                        action="/api/attachment-upload"
                        :on-success="attachmentUploadSuccess"
                        :on-error="attachmentUploadError"
                        multiple
                        :file-list="attachmentList">
                        <button>点击上传</button>
                        <div class="label">只能上传图片/文档</div>
                        </el-upload>
                    </div>
                    <button @click="sendMsg" class="btn-send"><i class="el-icon-s-promotion"></i></button>
                </div>
            </div>
        </div>
        <transition name="width">
            <div class="side-bar-info" v-show="showSidebar_Info">
                <div class="close-sidebar" @click="showSidebar_Info=false"><i class="el-icon-arrow-left"></i></div>
                <div class="room-info">
                    <img class="avatar" :src="roomAvatar" />
                    <div class="text-info">
                        <div class="room-name">{{$parent.roomInfo.name}}</div>
                        <div class="description">{{$parent.roomInfo.description}}</div>
                    </div>
                </div>
                <div class="edit-info">
                    <div class="label">上传头像</div>
                    <div>
                        <image-upload url="/api/avatar-upload" field="file"
                        @crop-upload-success="cropUploadSuccess"
                        @crop-upload-fail="cropUploadFail" v-model="showCropUpload">
                        </image-upload>
                    </div>
                    <div class="upload" @click="showCropUpload=true">
                        <i class="image-icon" :class="{'el-icon-picture-outline': this.modifyRoomInfo.avatar == this.$parent.roomInfo.avatar}" :style="editAvatarBackground"></i>
                        <div>点击选择头像文件</div>
                    </div>
                    <div class="label">群名</div>
                    <input spellcheck="false" v-model="modifyRoomInfo.name" />
                    <div class="label">简介</div>
                    <input spellcheck="false" v-model="modifyRoomInfo.description" />
                    <button @click="setRoomInfo()">保存</button>
                </div>


            </div>
        </transition>
        <transition name="width">
            <div class="side-bar-share" v-show="showSidebar_Share">
                <div class="close-sidebar" @click="showSidebar_Share=false"><i class="el-icon-arrow-left"></i></div>
                <div class="room-info">
                    <img class="avatar" :src="roomAvatar" />
                    <div class="text-info">
                        <div class="room-name">{{$parent.roomInfo.name}}</div>
                        <div class="link" @click="copyLink()">
                            <div class="description">{{$parent.roomInfo.description}}</div>
                            <i class="el-icon-link"></i>
                        </div>
                    </div>
                </div>
                <div class="share-links">
                    <div class="qq" @click="shareToPlatform('qq')">
                        <span><i class="el-icon-link"></i> QQ分享</span>
                    </div>
                    <div class="weibo" @click="shareToPlatform('weibo')">
                        <span><i class="el-icon-link"></i> 分享到微博</span>
                    </div>
                    <div class="wechat" @click="shareToPlatform('wechat')">
                        <span><i class="el-icon-link"></i> 分享到微信</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
$hoverColor: rgb(37, 139, 255);
$activeColor: rgb(34, 108, 194);
$hoverColorRed: rgb(231, 78, 78);
$activeColorRed: rgb(160, 49, 49);
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

@mixin setHoverColorRed {
    transition: color 0.3s;
    &:hover {
        color: $hoverColorRed;
        cursor: pointer;
    }
    &:active {
        color: $activeColorRed;
    }
}

@mixin defaultButton {
    color: white;
    background-color: #0176ff;
    border: none;
    outline: none;
    border-radius: 5px;
    transition: background-color .3s;
    &:hover {
        background-color: #006deb;
        cursor: pointer;
    }
    &:active {
        background-color: #0055b6;
    }
}

@mixin defaultInput {
    display: block;
    padding: 5px;
    font-size: 1rem;
    text-indent: 5px;
    border: none;
    border-radius: 5px;
    background-color: #edeef6;
    &:hover {
        background-color: #e0e0f0;
    }
    &:focus {
        outline: #d5d5e5 solid 1px;
    }
}

.width-enter-active, .width-leave-active {
    transition: width .3s;
}

.width-enter, .width-leave-to {
    width: 0% !important;
}

.height-enter-active, .height-leave-active {
    transition: width .3s;
}

.height-enter, .height-leave-to {
    height: 0px !important;
}

.container {
    display: flex;
    flex-direction: row;

    .mid-content {
        flex: 1;

        .info-bar {
            position: relative;
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
                width: 30%;
                overflow: hidden;
                margin: {
                    top: 1.4vh;
                    left: 0.8vw;
                }
                .room-name {
                    line-height: 0.8rem;
                    font-size: 0.9rem;
                }
                .description {
                    display: inline-block;
                    line-height: 2rem;
                    font-size: 0.8rem;
                    width: 100%;
                    color: gray;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .loading {
                position: absolute;
                text-align: center;
                top: 80px;
                left: calc(50% - 1.5rem);
                color: gray;
                font-size: 0.8rem;
                i {
                    font-size: 0.9rem;
                }
            }

            .search-bar {
                position: absolute;
                top: 85px;
                left: 0;
                width: 100%;
                height: 30px;
                text-align: center;
                

                input {
                    @include defaultInput;
                    margin: auto;
                    width: 95%;
                    height: 100%;
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
                    div i {
                        margin-left: 10px;
                        margin-bottom: 10px;
                    }
                    .btn-edit-info {
                        @include setHoverColor;
                    }
                    .btn-delete-room {
                        @include setHoverColorRed;
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
            overflow-x: hidden;
            padding: 20px 0;
            box-shadow: $bottomShadow;
            box-sizing: border-box;
            &::-webkit-scrollbar {
                width: 5px;
            }
            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            &::-webkit-scrollbar-thumb {
                background: #888;
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            .self-msg {
                align-self: flex-end;
                margin-left: 0 !important;
                margin-right: 40px;
                text-align: right;
                ::selection {
                    background-color: white;
                    color: black;
                }

                .text {
                    background-color: #0176ff !important;
                    .name {
                        white-space: nowrap;
                        color: #c8e1ff !important;
                    }
                    .content {
                        color: white;
                        text-align: left;
                    }

                    border-radius: 10px 10px 0 10px !important;
                }
                .img {
                    background-position-x: 100%;
                }
            }

            .msg {
                margin-left: 40px;
                width: 100%;
                .user-avatar {
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
                    max-width: 300px;
                    vertical-align: bottom;
                    border-radius: 10px 10px 10px 0;
                    .name {
                        color: rgb(126, 126, 126);
                        font-size: 0.95rem;
                    }
                    .content {
                        margin-top: 5px;
                        word-wrap: break-word;
                    }
                    .img {
                        width: 200px;
                        height: 123px;
                        background-size: contain;
                        background-repeat: no-repeat;
                        margin: 5px;
                        margin-top: 10px;
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
                font-size: 1.2rem;
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
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                padding-bottom: calc(3% + 20px);
                line-height: 2.8rem;
                font-size: 1.2rem;
                color:gray;
                width: 150px;
                margin-left: auto;
                user-select: none;

                .active {
                    color:#006deb;
                }

                .emoji-select {
                    margin-left: 2px;
                    span {
                        display: inline-block;
                        font-size: 1.2rem;
                        box-sizing: border-box;
                        height: 30px;
                        width: 30px;
                        line-height: 30px;
                        text-align: center;
                        border-radius: 3px;
                    }

                    .active {
                        background-color: lightgray;
                    }
                }

                .face-panel {
                    position: absolute;
                    background-color: white;
                    left: -170px;
                    bottom: 20vh;
                    
                    width: 245px;
                    height: 225px;
                    .emojis {
                        display: flex;
                        flex-wrap: wrap;
                        overflow-y: auto;
                        overflow-x: hidden;
                        width: 245px;
                        height: 180px;
                        &::-webkit-scrollbar {
                            width: 5px;
                        }
                        &::-webkit-scrollbar-track {
                            background: #e8e8e8;
                        }
                        &::-webkit-scrollbar-thumb {
                            background: #888;
                        }
                        &::-webkit-scrollbar-thumb:hover {
                            background: #555;
                        }
                        div {
                            display: block;
                            width: 30px;
                            height: 30px;
                            text-align: center;
                            line-height: 30px;
                            &:hover {
                                background-color: lightgray;
                            }
                        }
                    }
                    
                    box-shadow: 0 0 5px lightgray;
                    user-select: none;
                }

                .select-file {
                    @include setHoverColor;
                }

                .attach-panel {
                    position: absolute;
                    bottom: 20vh;
                    left:-200px;
                    padding: 20px;
                    width: 250px;
                    overflow: hidden;
                    box-shadow: 0 0 5px lightgray;
                    background-color: white;
                    
                    transition: all .3s;
                    .label {
                        font-size: 0.9rem;
                    }
                    button {
                        @include defaultButton;
                        height: 30px;
                        width: 100px;
                    }
                }

                .face {
                    @include setHoverColor;
                }

                .btn-send{
                    @include defaultButton;
                    height: 40px;
                    width: 40px;
                    margin-right: 20px;
                    font-size: 1.3rem;
                    border-radius: 50%;
                }
            }
        }
    }

    .side-bar-info {
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
                display: -webkit-box;
                box-sizing: border-box;
                padding: 0 10px;
                margin: auto;
                margin-top: 5px;
                color:gray;
                width: 200px;
                height: 2.55rem;
                overflow: hidden;
                white-space: normal;
                word-wrap: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
        .edit-info {
            flex: 1;
            margin-top: 10%;
            height: 50%;
            border-radius: 5px;
            background-color: #f5f6fa;

            .upload {
                text-align: center;
                display: block;
                width: 80%;
                min-width: 100px;
                height: 120px;
                margin: 0 auto;
                margin-top: 10px;
                background-color: #edeef6;

                &:hover {
                    background-color: #e0e0f0;
                    cursor: pointer;
                }
                &:active {
                    background-color: #d5d5e5
                }
                div {
                    margin-top: 10px;
                    font-size: 0.9rem;
                    color: gray;
                }
                
                .image-icon {
                    display: inline-block;
                    margin-top: 20px;
                    line-height: 3.2rem;
                    font-size: 1.6rem;
                    color: white;
                    background: #0176ff;
                    background-size: contain;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                }   
            }
            .label {
                margin-top: 20px;
                margin-left: 10%;
                font-size: 0.9rem;
                color:gray;
                white-space: nowrap;
            }
            input {
                @include defaultInput;
                margin: auto;
                margin-top: 10px;
                padding: 5px;
                font-size: 1rem;
                width: 80%;
                height: 1.8rem;
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

    .side-bar-share {
        display: flex;
        flex-direction: column;
        width: 20%;
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
            text-align: left;
            min-width: 100px;
            margin-top: 15%;
            vertical-align: center;
            .avatar {
                display: inline-block;
                width: 40px;
                height: 40px;
                margin-left: 15%;
                border-radius: 50%;
            }
            .text-info {
                display: inline-block;
                margin-left: 10px;
                line-height: 1.4rem;
                width: calc(75% - 60px);
                .room-name {
                    font-size: 1rem;
                }
                .link {
                    &:hover {
                        color:#0176ff;
                        cursor: pointer;
                        .description {
                            color:#0176ff;
                        }
                    }
                    .description {
                        display: inline-block;
                        box-sizing: border-box;
                        color:gray;
                        width: 80%;
                        font-size: 0.8rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    i {
                        display: inline-block;
                        vertical-align: bottom;
                        padding-bottom: 0.50rem;
                        font-size: 0.95rem;
                    }
                }

            }
        }

        .share-links {
            display: flex;
            flex-direction: column;
            width: 100%;
            flex: 1;
            margin-top: 40px;
            background-color: #f5f6fa;
            .qq {
                margin-top: 30px;
            }
            div {
                width: 90%;
                height: 60px;
                line-height: 60px;
                margin-left: 5%;
                margin-bottom: 10px;
                border-radius: 5px;
                background-color: white;
                transition: all .3s;
                user-select: none;
                &:hover {
                    cursor: pointer;
                    background-color: lightgray;
                }
                &:active {
                    background-color: rgb(189, 189, 189);
                }
                span {
                    margin-left: 20px;
                    font-size: 0.9rem;
                }
            }
            .wechat {
                border-bottom: none;
            }
        }
    }
}

</style>

<style lang="scss">
.vicp-operate {
    a {
        color:#0176ff !important;
    }
}
.el-upload--text {
    text-align: left;
}
</style>

<script>
import ImageUpload from "vue-image-crop-upload"
import md5 from "js-md5"
import emojiList from "@/emoji.js"


export default {
    components: {
        ImageUpload
    },
    data() {
        return {
            modifyRoomInfo: {
                roomid: "",
                name: "群聊",
                description: "这里什么都没有",
                avatar: "",
            },
            showSidebar_Info: false,
            showSidebar_Share: false,
            showSearchbar: false,
            showCropUpload: false,
            showFacePanel: false,
            showAttachPanel: false,
            finishLoading: false,
            loadingHistory: false,
            newMsg: false,
            newMsgWatcher: -1,
            loadMsgWatcher: -1,
            msgList: [],
            msgInput: "",
            searchText: "",
            onlineList: [],
            attachmentList: [],
            emojis: emojiList,
            emojiType: 0,
            imageRegExp: null
        }
    },
    computed: {
        editAvatarBackground() {
            if (this.modifyRoomInfo.avatar != this.$parent.roomInfo.avatar)
            {
                return "background-image: url('/api" + this.modifyRoomInfo.avatar + "')";
            }
            else
            {
                return "";
            }
        },
        roomAvatar() {
            if (this.$parent.roomInfo.avatar.length == 0)
            {
                return this.config.gravatarUrl + '/avatar/' + md5(this.$parent.roomInfo.roomid) + '?s=64&d=identicon';
            }
            else
            {
                return "/api" + this.$parent.roomInfo.avatar;
            }
        },
        onlineDisplay() {
            let str = ""
            for (let usr of this.onlineList)
            {
                str += usr.name + '\n';
            }
            return str;
        }
    },
    methods: {
        sendMsg() {
            if (this.msgInput.length > 0)
            {
                this.io.emit("message", this.msgInput);
                this.msgInput = "";
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
        setRoomInfo() {
            this.io.emit("modify_roominfo", this.$parent.roomInfo.roomid, this.modifyRoomInfo, (r)=>{
                if (r.code == 0)
                {
                    this.$parent.roomInfo.name = r.data.name;
                    this.$parent.roomInfo.avatar = r.data.avatar;
                    this.$parent.roomInfo.description = r.data.description;
                    this.$message.success("修改成功！");
                }
                else
                {
                    this.$message.error("修改失败：" + r.msg);
                }
            });
        },
        deleteRoom() {
            this.$confirm(`你确定要解散房间 ${this.$parent.roomInfo.name} 吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.io.emit("delete_room", this.$parent.roomInfo.roomid, r=>{
                    if (r.code == 0)
                    {
                        this.$message({
                            type: 'success',
                            message: '解散成功!'
                        });
                        this.$router.push("/");
                    }
                    else
                    {
                        this.$message({
                            type: 'error',
                            message: '解散失败: ' + r.msg
                        });
                    }
                })

            }).catch(() => {
     
            });
        },
        getHistory() {
            this.loadingHistory = true;
            if (this.msgList.length == 0)
            {
                this.io.emit("msg_history", this.$parent.roomInfo.roomid, 1, -1, (r) => {
                    if (r.code == 0)
                    {
                        for (let msg of r.data.list)
                        {
                            let imgs = msg.msg.match(this.imageRegExp);
                            if (imgs != null)
                            {
                                msg.images = [];
                                for (let img of imgs)
                                {
                                    msg.images.push(img);
                                    msg.msg = msg.msg.replace(img, "");
                                }
                            }
                        }
                        this.finishLoading = r.data.done;
                        this.msgList = r.data.list;
                        this.$nextTick(()=>{
                            this.scrollToEnd();
                            this.loadingHistory = false;
                        });
                    }
                    else
                    {
                        this.$message.error(r.msg);
                        this.loadingHistory = false;
                        this.finishLoading = true;
                    }
                    this.startWatchingLoading();
                });
            }
            else
            {
                this.io.emit("msg_history", this.$parent.roomInfo.roomid, 1, this.msgList[0].id, (r) => {
                    if (r.code == 0)
                    {
                        for (let msg of r.data.list)
                        {
                            let imgs = msg.msg.match(this.imageRegExp);
                            if (imgs != null)
                            {
                                msg.images = [];
                                for (let img of imgs)
                                {
                                    msg.images.push(img);
                                    msg.msg = msg.msg.replace(img, "");
                                }
                            }
                        }
                        this.finishLoading = r.data.done;
                        r.data.list.reverse();
                        for (let msg of r.data.list)
                        {
                            this.msgList.splice(0, 0, msg);
                        }
                        let msgArea = this.$el.querySelector(".message-area");
                        if (msgArea.scrollTop == 0)
                        {
                            msgArea.scrollTop += 50;
                        }
                        this.$nextTick(()=>{
                            this.loadingHistory = false;
                        });
                    }
                    else
                    {
                        this.$message.error(r.msg);
                        this.loadingHistory = false;
                        this.finishLoading = true;
                    }
                    this.startWatchingLoading();
                });
            }
        },
        scrollToEnd(force=true) {
            let msgArea = this.$el.querySelector(".message-area");
            if (force)
            {
                msgArea.scrollTop = msgArea.scrollHeight;
                return true;
            }
            else
            {
                if (Math.abs(msgArea.clientHeight + msgArea.scrollTop - msgArea.scrollHeight) < 300)
                {
                    msgArea.scrollTop = msgArea.scrollHeight;
                    return true;
                }
            }
            return false;
        },
        startWatchingNewMsg() {
            this.newMsgWatcher = setInterval(()=>{
                let msgArea = this.$el.querySelector(".message-area");
                if (Math.abs(msgArea.clientHeight + msgArea.scrollTop - msgArea.scrollHeight) < 300)
                {
                    this.$parent.newMsg = false;
                    clearInterval(this.newMsgWatcher);
                }
            }, 200);
        },
        startWatchingLoading() {
            setTimeout(()=>{
                this.loadMsgWatcher = setInterval(()=>{
                    if (!this.finishLoading && !this.loadingHistory)
                    {
                        let msgArea = this.$el.querySelector(".message-area");
                        if (msgArea.scrollTop <= 100)
                        {
                            clearInterval(this.loadMsgWatcher);
                            this.getHistory();
                        }
                    }
                }, 200);
            }, 1000);
        },
        cropUploadSuccess(r, field){
            if (r.code == 0)
            {
                this.modifyRoomInfo.avatar = r.data;
            }
            else
            {
                this.$message.error("上传失败：" + r.msg);
            }
        },
        cropUploadFail(status, field){
            this.$message.error("上传失败：" + status);
        },
        attachmentUploadSuccess(rep, file, fileList) {
            if (rep.code == 0)
            {
                this.$message.success("上传成功！");
                this.msgInput += ` http://${this.config.host}/api${rep.data} `;
            }
            else if (rep.code == -1)
            {
                this.$message.error("上传失败：文件格式不受支持！")
            }
            else
            {
                this.$message.error(rep.msg);
            }
        },
        attachmentUploadError(err, file, fileList) {
            this.$message.error(err);
        },
        copyLink()
        {
            this.$copyText(this.config.fullurl_s + this.$parent.roomInfo.roomid);
            this.$message.success("已将房间链接复制到剪切板！");
        },
        shareToPlatform(platform) {
            if (platform == "qq")
            {
                window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(document.location) + '?sharesource=qzone&title=' + this.$parent.roomInfo.name + '&pics=' + "" + '&summary=' + '');
            }
            else
            {
                this.$message.info("平台需要 APIKey，时间紧迫，没去弄");
            }
        }
    },
    mounted() {
        this.imageRegExp = new RegExp(`${this.config.httpProtocol}${this.config.host}/api/attachments/[a-zA-Z0-9]*?\.(jpg|png|gif|bmp|webp)`, "g");
        this.io.on("message", (r) => {
            let msg = r.data.msg;
            let imgs = msg.match(this.imageRegExp);
            if (imgs != null)
            {
                r.data.images = [];
                for (let img of imgs)
                {
                    r.data.images.push(img);
                    r.data.msg = msg.replace(img, "");
                }
            }
            this.msgList.push(r.data);
            this.$nextTick(()=>{
                if (r.data.user == this.$parent.account.uidMd5)
                {
                    this.scrollToEnd();
                }
                else
                {
                    let status = this.scrollToEnd(false);
                    if (!status)
                    {
                        this.$message.info(r.data.name+": "+r.data.msg);
                        this.$parent.newMsg = true;
                        this.startWatchingNewMsg();
                    }
                }
            });
        });

        this.io.on("user_record", (r)=>{
            console.log(r);
            if (r.msg == "join")
            {
                if (r.data.uid != this.$parent.account.uidMd5)
                {
                    let usr = this.onlineList.find((val)=>(val.uid==r.data.uid));
                    if (usr == undefined)
                    {
                        this.onlineList.push(r.data);
                        this.$notify({
                            title: "系统提醒",
                            message: `${r.data.name} 加入了聊天室`
                        });
                    }
                }
            }
            else
            {
                if (r.data.uid != this.$parent.account.uidMd5)
                {
                    let usr = this.onlineList.find((val)=>(val.uid==r.data.uid));
                    if (usr != undefined)
                    {
                        this.onlineList.splice(this.onlineList.indexOf(usr), 1);
                        this.$notify({
                            title: "系统提醒",
                            message: `${r.data.name} 离开了聊天室`
                        });
                    }
                }
            }
        });
    },
    beforeRouteUpdate (to, from, next) {
        this.$parent.roomInfo.roomid = to.params["room"];
        if (to.params["room"].length != 0)
        {
            this.msgList = [];
            this.io.emit("join_room", this.$parent.roomInfo.roomid, true, r=>{
                if (r.code == 0)
                {
                    this.io.emit("get_online", r=>{
                        this.onlineList = r.data;
                        console.log(vm.onlineList);
                    });
                    this.$parent.roomInfo = r.data;
                    this.$parent.roomInfo.name = r.data.name;
                    this.$parent.roomInfo.description = r.data.description;
                    this.$parent.roomInfo.roomid = r.data.roomid;
                    this.getHistory();
                }
                else
                {
                    this.$message.error(r.msg);
                    this.$router.push("/");
                }
            });
        }
        next();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$parent.roomInfo.roomid = vm.$route.params["room"];
            vm.io.emit("join_room", vm.$parent.roomInfo.roomid, false, r=>{
                if (r.code == 0)
                {
                    vm.io.emit("get_online", r=>{
                        console.log(r);
                        vm.onlineList = r.data;
                        console.log(vm.onlineList);
                    });
                    vm.$parent.roomInfo = r.data;
                    vm.$parent.roomInfo.name = r.data.name;
                    vm.$parent.roomInfo.description = r.data.description;
                    vm.$parent.roomInfo.roomid = r.data.roomid;
                    vm.getHistory();
                }
                else
                {
                    vm.$message.error(r.msg);
                    vm.$router.push("/");
                }
            });
        })
    },
    watch: {
        "$parent.roomInfo": {
            handler(val) {
                this.modifyRoomInfo.roomid = val.roomid;
                this.modifyRoomInfo.name = val.name;
                this.modifyRoomInfo.description = val.description;
                this.modifyRoomInfo.avatar = val.avatar;
            },
            deep: true
        }
    }
}
</script>