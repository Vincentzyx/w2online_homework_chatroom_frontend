<template>
    <div class="container">
        <div class="text">
            随机图片加载中，请稍后   
        </div>
        <div class="cute-girls" :style="'background-image: url(' + imgUrl + random + ')'"></div>
        <div class="btns">
            <button @click="refresh"><i class="el-icon-refresh"></i></button>
            <a :href="imgUrl + random + '&download=true'"><button class="btn-download"><i class="el-icon-download"></i></button></a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    position: relative;
    height: 100%;
    width: 100%;

    .text {
        text-align: center;
        margin-top: 30vh;
        font-size: 2rem;
        color: gray;

        .el-icon-loading {
            display: block;
            margin-top: 2.5vh;
        }
    }

    .cute-girls {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        height: 100%;
        width: 100%;
    }

    @keyframes spin{
        0%{transform:rotate(180deg);}
        100%{transform:rotate(0deg);}
    }
    @keyframes spin2{
        0%{transform:rotate(180deg);}
        100%{transform:rotate(0deg);}
    }

    .btns {
        position: absolute;
        top: 5vmin;
        left: 5vmin;

        button {
            display: block;
            color: white;
            background-color: #1397db;
            border: none;
            outline: none;
            width: 45px;
            height: 45px;
            margin-bottom: 2vh;
            font-size: 1.2rem;
            line-height: 1.2rem;
            text-align: center;
            border-radius: 50%;
            box-shadow: 0 0 5px gray;
            transition: background-color .3s;
            &:hover {
                background-color: #127fb6;
                cursor: pointer;
                .el-icon-refresh {
                    animation: spin 0.5s ease;
                    animation-fill-mode: forwards;
                }
            }
            &:active {
                background-color: #13709e;
                .el-icon-refresh {
                    animation: spin2 0.5s ease 3s;
                    animation-iteration-count: 3;
                    animation-fill-mode: backwards;
                }
            }
        }
        i {
            color: white;
        }
    }
}
</style>

<script>
import md5 from "js-md5"

export default {
    created() {
        this.random = md5(Math.random().toString());
    },
    data() {
        return {
            imgUrl: "http://chat.vi.tn/cute-girls/?r=",
            random: ""
        }
    },
    methods: {
        refresh() {
            this.random = md5(Math.random().toString());
        },
        download() {
            
        }
    },
    computed: {

    }
}
</script>