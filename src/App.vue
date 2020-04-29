<template>
    <div id="app">
        <div class="left-side-bar">
            <i class="el-icon-message"></i>
            <div class="left-btns">
                <div class="btn-chat" @click="gotoChat">
                    <i class="el-icon-chat-square"></i>
                    <div class="icon-new-message">·</div>
                </div>
                <div class="btn-profile" @click="gotoProfile">
                    <i class="el-icon-user"></i>
                </div>
            </div>
            <i class="el-icon-setting"></i>
        </div>
        <div class="router-content">
            <transition name="fade">
                <router-view></router-view>
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
                name: "群聊",
                description: "这里什么都没有",
                avatar: "default_avatar.jpg",
                online: 0
            },
            account: {
                uid: "",
                uidMd5: "",
                name: ""
            }
        }
    },
    mounted() {
        this.io.on("give_id", (r) => {
            if (r.code == 0)
            {
                if ("crAccount" in localStorage)
                {
                    this.account = JSON.parse(localStorage.getItem("crAccount"));
                    console.warn(this.account.uid.length);
                    this.io.emit("user_auth", this.account.uid, this.account.name, (r)=>{
                        console.warn(r);
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
    watch: {
        roomInfo(val) {
            this.$emit("roomInfoChange");
        }
    },
    methods: {
        gotoProfile() {
            if (this.$router.currentRoute.path != "/profile")
                this.$router.push("/profile");
        },
        gotoChat() {
            if (this.$router.currentRoute.path != "/")
                this.$router.push("/");
        }
    }
}
</script>

<style lang="scss">
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
    width: 100%;
}

.left-side-bar {
    width: 80px;
    text-align: center;
    box-shadow: 0 0 5px rgb(211, 211, 211);
    
    .el-icon-message {
        margin-top: 2vh;
        font-size: 2.5rem;
        color: $hoverColor;
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
