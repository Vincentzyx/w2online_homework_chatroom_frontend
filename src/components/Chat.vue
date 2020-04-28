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
                
            </div>
            <div class="input-area">
                
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
                    <div class="label label-avatar">上传头像</div>
                    <div class="upload">
                        <el-upload
                        class="upload-avatar"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple>
                        <i class="el-icon-picture-outline"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </div>
                </div>


            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
$hoverColor: rgb(37, 139, 255);
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
        flex-grow: 1;

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
                        height: 60px;
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
                        }
                    }
                }
            }
        }
        
        .message-area {
            width: 100%;
            height: calc(80vh - 70px);
        }

        .input-area {
            width: 100%;
            height: 20vh;
            border-top: $mainBorder;
        }
    }

    .right-side-bar {
        display: flex;
        flex-direction: column;
        width: 20%;
        border-left: $mainBorder;
        overflow: hidden;
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
                margin-top: 100px;
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
            margin-top: 50px;
            height: 50%;
            border-radius: 5px;
            background-color: #f5f6fa;

            .upload {
                margin-top: 10px;
            }
            .label-avatar {
                margin-top: 50px;
                margin-left: 10%;
                font-size: 0.9rem;
                color:gray;
            }
        }
    }
}

</style>

<style lang="scss">

.el-upload {
    display: block;
    width: 80%;
    height: 140px;
    margin: 0 auto;

    .el-upload-dragger {
        width: 100%;
        height: 100%;
        background-color: #edeef6;

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
        }
    }
}
</style>

<script>
export default {
    data() {
        return {
            roomInfo: {
                roomid: "",
                name: "群聊",
                description: "这里什么都没有",
                avatar: "default_avatar.jpg",
                online: 0
            },
            showSidebar: true,
            msgList: {

            }
        }
    }
}
</script>