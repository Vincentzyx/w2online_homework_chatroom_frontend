<template>
    <div class="container">
        <div class="change-nick">
            <input type="text" placeholder="新昵称" v-model="$parent.account.name">
            <button @click="changeNick"><i class="el-icon-arrow-right"></i></button>
        </div>
        <div class="quote">
            // 感觉匿名聊天系统中好像不太需要别的身份信息<br>
            // 绝对不是因为高强度编码3天以后累了<br>
            // 救救孩子
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    .change-nick {
        margin-top: 20%;
        width: 80%;
        display: flex;

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
    .quote {
        color: rgb(20, 134, 20);
        margin-top: 10%;
        user-select: none;
    }
}
</style>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        changeNick() {
            localStorage.setItem("crAccount", JSON.stringify(this.$parent.account));
            this.io.emit("user_auth", this.$parent.account.uid, this.$parent.account.name, (r)=>{
                if (r.code == 0)
                {
                    this.$parent.account.uidMd5 = r.data;
                }
            });
            this.$message.success("修改成功！");
        }
    },
    watch: {

    }
}
</script>