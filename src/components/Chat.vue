<template>
    <div class="container">
        <div class="mid-content">
            <div class="info-bar">
                <img :src="roomAvatar" />
                <div class="text-info">
                    <div class="room-name">{{$parent.roomInfo.name}}</div>
                    <div class="description">{{online + " 在线 · " + $parent.roomInfo.description}}</div>
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
                <div v-for="msg in msgList" :key="msg.id" class="msg" :class="{'self-msg': msg.user==$parent.account.uidMd5}">
                    <img v-if="msg.user!=$parent.account.uidMd5" :src="'https://www.gravatar.com/avatar/'+msg.user+'?s=64&d=identicon'" />
                    <div v-if="msg.user!=$parent.account.uidMd5" class="text">
                        <div class="name">{{msg.name}}</div>
                        <div class="content">{{msg.msg}}</div>
                    </div>
                    <div v-if="msg.user==$parent.account.uidMd5" class="text">
                        <div class="name">{{msg.name}}</div>
                        <div class="content">{{msg.msg}}</div>
                    </div>
                    <img v-if="msg.user==$parent.account.uidMd5" :src="'https://www.gravatar.com/avatar/'+msg.user+'?s=64&d=identicon'" />
                </div>
            </div>
            <div class="input-area">
                <textarea @keydown="enterInput" spellcheck="false"
                v-model="msgInput">
                </textarea>
                <div class="edit-toolbox">
                    <div class="face">
                        <span @click="showFacePanel=!showFacePanel" :class="{active:showFacePanel}">☺</span>
                        <div v-show="showFacePanel" class="face-panel">
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
                    <div class="select-file" @click="$message.info('尚未实现')"><i class="el-icon-paperclip"></i></div>
                    <button @click="sendMsg"><i class="el-icon-s-promotion"></i></button>
                </div>
            </div>
        </div>
        <transition name="width">
            <div class="right-side-bar" v-show="showSidebar">
                <div class="close-sidebar" @click="showSidebar=false"><i class="el-icon-arrow-left"></i></div>
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
                max-width: 200px;
                
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
                    display: inline;
                    line-height: 2rem;
                    font-size: 0.8rem;
                    color: gray;
                    white-space: nowrap;
                    text-overflow: ellipsis;
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

                .text {
                    .name {
                        white-space: nowrap;
                    }
                    .content {
                        text-align: left;
                    }

                    border-radius: 10px 10px 0 10px !important;
                }
            }

            .msg {
                margin-left: 40px;
                width: 100%;
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
                        color: rgb(126, 126, 126);
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
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                padding-bottom: 8%;
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
                    top: -220px;
                    
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
                box-sizing: border-box;
                padding: 0 10px;
                margin: auto;
                margin-top: 5px;
                color:gray;
                width: 200px;
                height: 2.55rem;
                overflow: hidden;
                white-space: normal;
                word-wrap: break-word;
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
.vicp-operate {
    a {
        color:#0176ff !important;
    }
}
</style>

<script>
import ImageUpload from "vue-image-crop-upload"
import md5 from "js-md5"


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
            showSidebar: false,
            showCropUpload: false,
            showFacePanel: false,
            newMsg: false,
            newMsgWatcher: 0,
            msgList: [

            ],
            msgInput: "",
            online: 0,
            emojis: [
                ["😀","😃","😄","😁","😆","😅","😂","🤣","😇","😉","😊","🙂","🙃","☺","😋","😌","😍","🥰","😘","😗","😙","😚","🤪","😜","😝","😛","🤑","😎","🤓","🧐","🤠","🥳","🤗","🤡","😏","😶","😐","😑","😒","🙄","🤨","🤔","🤫","🤭","🤥","😳","😞","😟","😠","😡","🤬","😔","😕","🙁","☹","😬","🥺","😣","😖","😫","😩","🥱","😤","😮","😱","😨","😰","😯","😦","😧","😢","😥","😪","🤤","😓","😭","🤩","😵","🥴","😲","🤯","🤐","😷","🤕","🤒","🤮","🤢","🤧","🥵","🥶","😴","💤","😈","👿","👹","👺","💩","👻","💀","☠","👽","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾","👐","🤲","🙌","👏","🙏","🤝","👍","👎","👊","✊","🤛","🤜","🤞","✌","🤘","🤟","👌","🤏","👈","👉","👆","👇","☝","✋","🤚","🖐","🖖","👋","🤙","💪","🦾","🖕","✍","🤳","💅","🦵","🦿","🦶","👄","🦷","👅","👂","🦻","👃","👁","👀","🧠","🦴","👤","👥","🗣","👶","👧","🧒","👦","👩","🧑","👨","👩‍🦱","🧑‍🦱","👨‍🦱","👩‍🦰","🧑‍🦰","👨‍🦰","👱‍♀️","👱","👱‍♂️","👩‍🦳","🧑‍🦳","👨‍🦳","👩‍🦲","🧑‍🦲","👨‍🦲","🧔","👵","🧓","👴","👲","👳‍♀️","👳","👳‍♂️","🧕","👼","👸","🤴","👰","🤵‍♀️","🤵","🤵‍♂️","🙇‍♀️","🙇","🙇‍♂️","💁‍♀️","💁","💁‍♂️","🙅‍♀️","🙅","🙅‍♂️","🙆‍♀️","🙆","🙆‍♂️","🤷‍♀️","🤷","🤷‍♂️","🙋‍♀️","🙋","🙋‍♂️","🤦‍♀️","🤦","🤦‍♂️","🧏‍♀️","🧏","🧏‍♂️","🙎‍♀️","🙎","🙎‍♂️","🙍‍♀️","🙍","🙍‍♂️","💇‍♀️","💇","💇‍♂️","💆‍♀️","💆","💆‍♂️","🤰","🤱","🧎‍♀️","🧎","🧎‍♂️","🧍‍♀️","🧍","🧍‍♂️","🚶‍♀️","🚶","🚶‍♂️","👩‍🦯","🧑‍🦯","👨‍🦯","🏃‍♀️","🏃","🏃‍♂️","👩‍🦼","🧑‍🦼","👨‍🦼","👩‍🦽","🧑‍🦽","👨‍🦽","💃","🕺","👫","👭","👬","🧑‍🤝‍🧑","👩‍❤️‍👨","👩‍❤️‍👩","💑","👨‍❤️‍👨","👩‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","💏","👨‍❤️‍💋‍👨","❤","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💔","❣","💕","💞","💓","💗","💖","💘","💝","💟"],
                ["🐶","🐱","🐭","🐹","🐰","🐻","🧸","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🦍","🦧","🐔","🐧","🐦","🐤","🐣","🐥","🐺","🦊","🦝","🐗","🐴","🦓","🦒","🦌","🦘","🦥","🦦","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦗","🕷","🕸","🦂","🦟","🦠","🐢","🐍","🦎","🐙","🦑","🦞","🦀","🦐","🦪","🐠","🐟","🐡","🐬","🦈","🐳","🐋","🐊","🐆","🐅","🐃","🐂","🐄","🐪","🐫","🦙","🐘","🦏","🦛","🐐","🐏","🐑","🐎","🐖","🦇","🐓","🦃","🕊","🦅","🦆","🦢","🦉","🦩","🦚","🦜","🐕","🦮","🐕‍🦺","🐩","🐈","🐇","🐀","🐁","🐿","🦨","🦡","🦔","🐾","🐉","🐲","🦕","🦖","🌵","🎄","🌲","🌳","🌴","🌱","🌿","☘","🍀","🎍","🎋","🍃","🍂","🍁","🌾","🌺","🌻","🌹","🥀","🌷","🌼","🌸","💐","🍄","🌰","🐚","🌎","🌍","🌏","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌙","🌚","🌝","🌛","🌜","⭐","🌟","💫","✨","☄","🪐","🌞","☀","🌤","⛅","🌥","🌦","☁","🌧","⛈","🌩","⚡","🔥","💥","❄","🌨","☃","⛄","🌬","💨","🌪","🌫","🌈","☔","💧","💦","🌊"],
                ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🥑","🍆","🌶","🥒","🥬","🥦","🧄","🧅","🌽","🥕","🥗","🥔","🍠","🥜","🍯","🍞","🥐","🥖","🥨","🥯","🥞","🧇","🧀","🍗","🍖","🥩","🍤","🥚","🍳","🥓","🍔","🍟","🌭","🍕","🍝","🥪","🌮","🌯","🥙","🧆","🍜","🥘","🍲","🥫","🧂","🧈","🍥","🍣","🍱","🍛","🍙","🍚","🍘","🥟","🍢","🍡","🍧","🍨","🍦","🍰","🎂","🧁","🥧","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🥠","🥮","☕","🍵","🥣","🍼","🥤","🧃","🧉","🥛","🍺","🍻","🍷","🥂","🥃","🍸","🍹","🍾","🍶","🧊","🥄","🍴","🍽","🥢","🥡"],
                ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🎱","🥏","🏓","🏸","🥅","🏒","🏑","🏏","🥍","🥌","⛳","🏹","🎣","🤿","🥊","🥋","⛸","🎿","🛷","⛷","🏂","🏋️‍♀️","🏋","🏋️‍♂️","🤺","🤼‍♀️","🤼","🤼‍♂️","🤸‍♀️","🤸","🤸‍♂️","⛹️‍♀️","⛹","⛹️‍♂️","🤾‍♀️","🤾","🤾‍♂️","🧗‍♀️","🧗","🧗‍♂️","🏌️‍♀️","🏌","🏌️‍♂️","🧘‍♀️","🧘","🧘‍♂️","🧖‍♀️","🧖","🧖‍♂️","🏄‍♀️","🏄","🏄‍♂️","🏊‍♀️","🏊","🏊‍♂️","🤽‍♀️","🤽","🤽‍♂️","🚣‍♀️","🚣","🚣‍♂️","🏇","🚴‍♀️","🚴","🚴‍♂️","🚵‍♀️","🚵","🚵‍♂️","🎽","🎖","🏅","🥇","🥈","🥉","🏆","🏵","🎗","🎫","🎟","🎪","🤹‍♀️","🤹","🤹‍♂️","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","🧩","♟","🎯","🎳","🪀","🪁","🎮","👾","🎰","👮‍♀️","👮","👮‍♂️","👩‍🚒","🧑‍🚒","👨‍🚒","👷‍♀️","👷","👷‍♂️","👩‍🏭","🧑‍🏭","👨‍🏭","👩‍🔧","🧑‍🔧","👨‍🔧","👩‍🌾","🧑‍🌾","👨‍🌾","👩‍🍳","🧑‍🍳","👨‍🍳","👩‍🎤","🧑‍🎤","👨‍🎤","👩‍🎨","🧑‍🎨","👨‍🎨","👩‍🏫","🧑‍🏫","👨‍🏫","👩‍🎓","🧑‍🎓","👨‍🎓","👩‍💼","🧑‍💼","👨‍💼","👩‍💻","🧑‍💻","👨‍💻","👩‍🔬","🧑‍🔬","👨‍🔬","👩‍🚀","🧑‍🚀","👨‍🚀","👩‍⚕️","🧑‍⚕️","👨‍⚕️","👩‍⚖️","🧑‍⚖️","👨‍⚖️","👩‍✈️","🧑‍✈️","👨‍✈️","💂‍♀️","💂","💂‍♂️","🕵️‍♀️","🕵","🕵️‍♂️","🤶","🎅","🕴️‍♀️","🕴","🕴️‍♂️","🦸‍♀️","🦸","🦸‍♂️","🦹‍♀️","🦹","🦹‍♂️","🧙‍♀️","🧙","🧙‍♂️","🧝‍♀️","🧝","🧝‍♂️","🧚‍♀️","🧚","🧚‍♂️","🧞‍♀️","🧞","🧞‍♂️","🧜‍♀️","🧜","🧜‍♂️","🧛‍♀️","🧛","🧛‍♂️","🧟‍♀️","🧟","🧟‍♂️","👯‍♀️","👯","👯‍♂️","👪","👨‍👩‍👧","👨‍👩‍👧‍👦","👨‍👩‍👦‍👦","👨‍👩‍👧‍👧","👩‍👩‍👦","👩‍👩‍👧","👩‍👩‍👧‍👦","👩‍👩‍👦‍👦","👩‍👩‍👧‍👧","👨‍👨‍👦","👨‍👨‍👧","👨‍👨‍👧‍👦","👨‍👨‍👦‍👦","👨‍👨‍👧‍👧","👩‍👦","👩‍👧","👩‍👧‍👦","👩‍👦‍👦","👩‍👧‍👧","👨‍👦","👨‍👧","👨‍👧‍👦","👨‍👦‍👦","👨‍👧‍👧"],
                ["🚗","🚙","🚕","🛺","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🚚","🚛","🚜","🏍","🛵","🚲","🦼","🦽","🛴","🛹","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋","🚝","🚄","🚅","🚈","🚞","🚂","🚆","🚇","🚊","🚉","🚁","🛩","✈","🛫","🛬","🪂","💺","🛰","🚀","🛸","🛶","⛵","🛥","🚤","⛴","🛳","🚢","⚓","⛽","🚧","🚏","🚦","🚥","🛑","🎡","🎢","🎠","🏗","🌁","🗼","🏭","⛲","🎑","⛰","🏔","🗻","🌋","🗾","🏕","⛺","🏞","🛣","🛤","🌅","🌄","🏜","🏖","🏝","🌇","🌆","🏙","🌃","🌉","🌌","🌠","🎇","🎆","🏘","🏰","🏯","🏟","🗽","🏠","🏡","🏚","🏢","🏬","🏣","🏤","🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛","⛪","🕌","🛕","🕍","🕋","⛩"],
                ["⌚","📱","📲","💻","⌨","🖥","🖨","🖱","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎","📟","📠","📺","📻","🎙","🎚","🎛","⏱","⏲","⏰","🕰","⏳","⌛","🧮","📡","🔋","🔌","💡","🔦","🕯","🧯","🗑","🛢","🛒","💸","💵","💴","💶","💷","💰","💳","🧾","💎","⚖","🦯","🧰","🔧","🔨","⚒","🛠","⛏","🪓","🔩","⚙","⛓","🧱","🔫","🧨","💣","🔪","🗡","⚔","🛡","🚬","⚰","⚱","🏺","🔮","📿","🧿","💈","🧲","⚗","🧪","🧫","🧬","🔭","🔬","🕳","💊","💉","🩸","🩹","🩺","🌡","🏷","🔖","🚽","🚿","🛁","🛀","🪒","🧴","🧻","🧼","🧽","🧹","🧺","🔑","🗝","🛋","🪑","🛌","🛏","🚪","🧳","🛎","🖼","🧭","🗺","⛱","🗿","🛍","🎈","🎏","🎀","🧧","🎁","🎊","🎉","🎎","🎐","🏮","🪔","✉","📩","📨","📧","💌","📮","📪","📫","📬","📭","📦","📯","📥","📤","📜","📃","📑","📊","📈","📉","📄","📅","📆","🗓","📇","🗃","🗳","🗄","📋","🗒","📁","📂","🗂","🗞","📰","📓","📕","📗","📘","📙","📔","📒","📚","📖","🔗","📎","🖇","✂","📐","📏","📌","📍","🧷","🧵","🧶","🔐","🔒","🔓","🔏","🖊","🖋","✒","📝","✏","🖍","🖌","🔍","🔎","👚","👕","🥼","🦺","🧥","👖","👔","👗","👘","🥻","🩱","👙","🩲","🩳","💄","💋","👣","🧦","👠","👡","👢","🥿","👞","👟","🩰","🥾","🧢","👒","🎩","🎓","👑","⛑","🎒","👝","👛","👜","💼","👓","🕶","🥽","🧣","🧤","💍","🌂","☂"],
                ["☮","✝","☪","🕉","☸","✡","🔯","🕎","☯","☦","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛","⚕","☢","☣","📴","📳","🈶","🈚","🈸","🈺","🈷","✴","🆚","🉑","💮","🉐","㊙","㊗","🈴","🈵","🈹","🈲","🅰","🅱","🆎","🆑","🅾","🆘","⛔","📛","🚫","❌","⭕","💢","♨","🚷","🚯","🚳","🚱","🔞","📵","🚭","❗","❕","❓","❔","‼","⁉","💯","🔅","🔆","🔱","⚜","〽","⚠","🚸","🔰","♻","🈯","💹","❇","✳","❎","✅","💠","🌀","➿","🌐","♾","Ⓜ","🏧","🚾","♿","🅿","🈳","🈂","🛂","🛃","🛄","🛅","🚰","🚹","♂","🚺","♀","⚧","🚼","🚻","🚮","🎦","📶","🈁","🆖","🆗","🆙","🆒","🆕","🆓","0⃣","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣","9⃣","🔟","🔢","▶","⏸","⏯","⏹","⏺","⏏","⏭","⏮","⏩","⏪","🔀","🔁","🔂","◀","🔼","🔽","⏫","⏬","➡","⬅","⬆","⬇","↗","↘","↙","↖","↕","↔","🔄","↪","↩","🔃","⤴","⤵","#⃣","*⃣","ℹ","🔤","🔡","🔠","🔣","🎵","🎶","〰","➰","✔","➕","➖","➗","✖","💲","💱","©","®","™","🔚","🔙","🔛","🔝","🔜","☑","🔘","🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪","🟥","🟧","🟨","🟩","🟦","🟪","🟫","⬛","⬜","◼","◻","◾","◽","▪","▫","🔸","🔹","🔶","🔷","🔺","🔻","🔲","🔳","🔈","🔉","🔊","🔇","📣","📢","🔔","🔕","🃏","🀄","♠","♣","♥","♦","🎴","👁‍🗨","🗨","💭","🗯","💬","🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛","🕜","🕝","🕞","🕟","🕠","🕡","🕢","🕣","🕤","🕥","🕦","🕧"],
                ["🏳","🏴","🏁","🚩","🎌","🏴‍☠️","🏳️‍🌈","🏳️‍⚧️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧🇭","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇨","🏴󠁧󠁢󠁥󠁮󠁧󠁿","🇪🇪","🇪🇬","🇪🇭","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬🇭","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇪","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇹","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇬","🇲🇭","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🏴󠁧󠁢󠁳󠁣󠁴󠁿","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸🇭","🇸🇮","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹🇭","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🏴󠁧󠁢󠁷󠁬󠁳󠁿","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼"]
            ],
            emojiType: 0
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
                return 'https://www.gravatar.com/avatar/' + md5(this.$parent.roomInfo.roomid) + '?s=64&d=identicon';
            }
            else
            {
                return "/api" + this.$parent.roomInfo.avatar;
            }
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
        joinRoom(roomid, callback) {
            if (this.$parent.roomInfo.roomid != "")
            {
                this.io.emit("leave_room");
            }
            this.io.emit("join_room", roomid, callback);
            this.io.emit("get_online", (r)=>{
                console.log(r.data);
            });
        },
        getHistory() {
            if (this.msgList.length == 0)
            {
                this.io.emit("msg_history", this.$parent.roomInfo.roomid, 1, -1, (r) => {
                    if (r.code == 0)
                    {
                        this.msgList = r.data;
                        this.$nextTick(()=>{
                            this.scrollToEnd();
                        });
                    }
                    else
                    {
                        this.$message.error(r.msg);
                    }
                });
            }
            else
            {
                this.io.emit("msg_history", this.$parent.roomInfo.roomid, 1, this.msgList[0].id, (r) => {
                    if (r.code == 0)
                    {
                        for (let msg of r.data)
                        {
                            this.msgList.splice(0, 0, msg);
                        }
                        this.$nextTick(()=>{
                            this.scrollToEnd();
                        });
                    }
                    else
                    {
                        this.$message.error(r.msg);
                    }
                });
            }
            this.scrollToEnd();
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

        }
    },
    mounted() {
        this.io.on("message", (r) => {
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
    },
    beforeRouteUpdate (to, from, next) {
        this.$parent.roomInfo.roomid = to.params["room"];
        if (to.params["room"].length != 0)
        {
            this.joinRoom(this.$parent.roomInfo.roomid, (r) => {
                if (r.code == 0)
                {
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
        this.getHistory();
        next();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$parent.roomInfo.roomid = vm.$route.params["room"];
            vm.joinRoom(vm.$parent.roomInfo.roomid, (r) => {
                if (r.code == 0)
                {
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