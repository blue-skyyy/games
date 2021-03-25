<template lang="pug">
.container
  .header
    .levelBox(
      v-for="(d, index) in levelList"
      :key="index"
      @click="selectLevelMode(d.level)"
    ) {{d.name}}
  .content
    .imgBox
      img(class="img" :src="imgUrl")
      .change(@click="changeImage") 切换图片
    .gamebox
</template>

<script lang="ts">
import { Game } from "./Game"
import { nextTick, ref} from "vue"
import ONE_PNG from "./image/1.jpeg";
import TWO_PNG from "./image/2.jpeg";
import THREE_PNG from "./image/3.jpg";
import FOUR_PNG from "./image/4.jpeg";

export default {
  setup() {
    let game, level =  2, imgIndex = 0;
    let imgList = [
      ONE_PNG,TWO_PNG,THREE_PNG,FOUR_PNG
    ];
    let imgUrl = ref(imgList[0])
    nextTick(() => {
      game = new Game(2, ONE_PNG)
      game.start()
    })
    let data =  {
      levelList: [
        {name: "简单", level: 2},
        {name: "普通", level: 3},
        {name: "困难", level: 5},
        {name: "地狱", level: 8}
      ]
    }
    const selectLevelMode = (l) => {
      game.destory();
      level = l
      game = null;
      game = new Game(level, ONE_PNG);
      game.start()
    }

    const changeImage = () => {
      game.destory();
      imgIndex = (imgIndex === imgList.length - 1) ? 0 : imgIndex + 1;
      imgUrl.value = imgList[imgIndex];
      game = null;
      game = new Game(level, imgList[imgIndex]);
      game.start()
    }
    return {
      levelList: data.levelList,
      selectLevelMode,
      changeImage,
      imgUrl
    }
  }
}
</script>

<style lang="less" scoped>

.container {
  margin: 0 auto;
  width: 1100px;
  height: 700px;
  .header {
    width: 30%;
    margin-left: 35%;
    display: flex;
    justify-content: space-between;
    .levelBox {
      width: 50px;
      height: 30px;
      line-height: 30px;
      font-size: 10px;
      color: #fff;
      background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898;
 background-blend-mode: multiply,multiply;
      border-radius: 3px;
      cursor: pointer;
    }
  }
  .content {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    .imgBox {
      .img {
        width: 400px;
        height: 400px;
        display: inline-block;
      }
      .change {
        margin: 0 auto;
        width: 70px;
        height: 30px;
        line-height: 30px;
        font-size: 10px;
        color: #fff;
        background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898;
 background-blend-mode: multiply,multiply;
        border-radius: 3px;
        cursor: pointer;
      }
    }
    .gamebox {
      box-sizing: border-box;
      width: 600px;
      height: 600px;
      margin-left: 100px;
      background-color: #fff;
      position: relative;
      z-index: 99;
      outline:#989898 ridge thick;
    }
  }
 
}
</style>