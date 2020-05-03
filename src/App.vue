<template>
    <div id="app">
        <div class="left-side-bar">
            <img class="icon" src="http://106.53.7.10/chatroom/icon.png" @click="gotoIndex">
            <div class="left-btns">
                <div class="btn-chat" @click="gotoChat">
                    <i class="el-icon-chat-square"></i>
                    <div class="icon-new-message" :class="{active: newMsg}">·</div>
                </div>
                <div class="btn-profile" @click="gotoProfile">
                    <i class="el-icon-user"></i>
                </div>
            </div>
            <i @click="gotoSettings" class="el-icon-setting"></i>
        </div>
        <div class="router-content">
            <transition name="fade">
                <router-view class="router-view"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>


import { MessageBox } from "element-ui"
import md5 from "js-md5"
export default {
    name: 'App',
    components: {

    },
    data() {
        return {
            roomInfo: {
                roomid: "",
                name: "",
                description: "",
                avatar: "",
            },
            account: {
                uid: "",
                uidMd5: "",
                name: ""
            },
            newMsg: false
        }
    },
    created() {
        document.addEventListener('beforeunload', this.onClosing);
    },
    mounted() {
        this.io.on("give_id", (r) => {
            if (r.code == 0)
            {
                if ("crAccount" in localStorage)
                {
                    this.account = JSON.parse(localStorage.getItem("crAccount"));
                    this.io.emit("user_auth", this.account.uid, this.account.name, (r)=>{
                        if (r.code == 0)
                        {
                            this.account.uidMd5 = r.data;
                        }
                    });
                }
                else
                {
                    this.account = r.data;
                    localStorage.setItem("crAccount", JSON.stringify(this.account));
                }
            }
        });
    },
    provide: function() {
        return {
            roomInfo: this.roomInfo,
            account: this.account
        }
    },
    watch: {

    },
    methods: {
        gotoProfile() {
            if (this.$router.currentRoute.path != "/profile")
                this.$router.push("/profile");
        },
        gotoChat() {
            if (this.$router.currentRoute.path != ("/" + this.roomInfo.roomid))
                this.$router.push("/" + this.roomInfo.roomid);
        },
        gotoIndex() {
            if (this.$router.currentRoute.path != "/")
                this.$router.push("/");
        },
        gotoSettings() {
            if (this.$router.currentRoute.path != "settings")
                this.$router.push("/settings");
        },
        onClosing() {

        }
    }
}
</script>

<style lang="scss" scoped>
$hoverColor: rgb(37, 139, 255);

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}

@mixin setHoverColor {
    transition: color 0.3s;
    &:hover {
        color: $hoverColor;
        cursor: pointer;
    }
}

#app {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 100vh;
}


.router-content {
    flex: 1;
    position: relative;

    .router-view {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}

.left-side-bar {
    width: 80px;
    text-align: center;
    box-shadow: 0 0 5px rgb(211, 211, 211);
    user-select: none;

    .icon {
        margin-top: 4vh;
        height: 30px;
        width: 30px;
        cursor: pointer;
    }

    .left-btns {
        margin-top: 35vh;
        font-size: 1.2rem;
    }

    .btn-chat {
        @include setHoverColor;
    }

    .icon-new-message {
        font-size: 2rem;
        line-height: 5px;
        margin-bottom: 5vh;
        opacity: 0;
    }

    .active {
        color: #006deb;
        opacity: 1;
    }

    .btn-profile {
        @include setHoverColor;
    }

    .el-icon-setting {
        margin-top: 32vh;
        font-size: 1.2rem;
        @include setHoverColor;
    }
}
</style>
