<template>
    <div class="container">
        <div class="left-side-bar">
            <i class="el-icon-message"></i>
            <div class="left-btns">
                <div class="btn-chat">
                    <i class="el-icon-chat-square"></i>
                    <div class="icon-new-message">·</div>
                </div>
                <div class="btn-profile">
                    <i class="el-icon-user"></i>
                </div>
            </div>
            <i class="el-icon-setting"></i>
        </div>
        <div class="mid-content">
            <div class="message-area">
                a
            </div>
            <div class="input-area">
                b
            </div>
        </div>
        <div class="right-side-bar">
            c
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 100vh;
}

.left-side-bar {
    width: 80px;
    text-align: center;
    box-shadow: 0 0 5px rgb(211, 211, 211);
}

.el-icon-message {
    margin-top: 2vh;
    font-size: 2.5rem;
    color: rgba(37, 139, 255, 0.89);
}

.left-btns {
    margin-top: 35vh;
    font-size: 1.2rem;
}

.btn-chat {
    transition: all 0.3s;
    &:hover {
        color:rgba(37, 139, 255, 0.89);
        cursor: pointer;
    }
}

.icon-new-message {
    font-size: 2rem;
    line-height: 5px;
    margin-bottom: 5vh;
}

.btn-profile {
    transition: all 0.3s;
    &:hover {
        color:rgba(37, 139, 255, 0.89);
        cursor: pointer;
    }
}

.el-icon-setting {
    margin-top: 32vh;
    font-size: 1.2rem;
    transition: all 0.3s;
    &:hover {
        color:rgba(37, 139, 255, 0.89);
        cursor: pointer;
    }
}

.mid-content {
    width: 80%;

    .message-area {
        width: 100%;
        height: 80vh;
        background-color: pink;
    }

    .input-area {
        width: 100%;
        height: 20vh;
        background-color: lightskyblue;
    }
}

.right-side-bar {
    width: calc(20%);
    background-color: lightseagreen;
}

</style>

<script>
export default {
    
}
</script>