<template>
    <dir class="container">
        <div class="mid">
            <input v-model="roomInfo.roomid" @keydown.enter="joinRoom()" placeholder="请输入房间号" type="text">
            <button @click="joinRoom()"><i class="el-icon-arrow-right"></i></button>
        </div>
    </dir>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .mid {
        display: flex;
        margin-top: 20%;
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
}
</style>

<script>
export default {
    data() {
        return {
            roomInfo: this.$parent.roomInfo
        }
    },
    methods: {
        joinRoom() {
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

        }
    }
}
</script>