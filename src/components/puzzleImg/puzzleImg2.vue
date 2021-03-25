<template lang="pug">
.container
  .left
    .imgBox
      img(class="img" src="./image/1.jpeg")
      div {{level}}
  .gamebox
    .row(v-for="(row, rIndex) in new Array(2)" :key="rIndex")
      .item(
        v-for="(d, cIndex) in new Array(2)"
        @click.stop="moveBlock($event)"
        :key="cIndex" :style="setItemBg(rIndex, cIndex)"
        :data-originposition="[cIndex, rIndex]" 
        :class="{'blank': (rIndex * 2 + cIndex) + 1 === 4}"
        :data-index="(rIndex * 2 + cIndex) + 1")
</template>

<script lang="ts">
import { reactive, onMounted, nextTick, computed, watch, ref } from "vue";
import ONE_PNG from "./image/1.jpeg";
import { inversionNum, shuffle } from "../../utils/index";
// import { isSameOddEven } from "./method";
import method from "./method";
export default {
  setup() {
    let data = reactive({
      modeList: {
        easy: 2,
        middle: 16,
        hard: 25,
        hell: 64
      },
      mode: "easy",
      originInvNum: 0 // 原始逆序数
    });

    // https://blog.csdn.net/u013282507/article/details/52123266?utm_source=blogxgwz6
    // 可复原的图片条件：
    // 打乱后的数组的 逆序数 + 空白的行数 + 空白的列数 = 原逆序数 + 空白的行数 + 空白的列数
    let items;
    let level = ref(data.modeList[data.mode]);
    let ITEM_WH = 600 / data.modeList[data.mode];
    watch(
      () => data.mode,
      () => {
        level = data.modeList[data.mode];
      }
    );

    const { isSameOddEven, initGame } = method(data, level);
    // initGame();

    let originArr = Array.from(
      { length: Math.pow(level.value, 2) },
      (d, i: number) => i + 1
    );
    data.originInvNum = inversionNum(originArr) + (level.value - 1) * 2;
    // console.log("data.originInvNum", data.originInvNum);
    let randomArr, currInvNum;
    let isOK: boolean = false;
    do {
      // 前n-1位乱序
      randomArr = shuffle(originArr.slice(0, originArr.length - 1));
      // 添加最后一位
      randomArr.push(originArr[originArr.length - 1]);
      // 乱序后数组 逆序数
      currInvNum = inversionNum(randomArr) + (level.value - 1) * 2;
      isOK = isSameOddEven(data.originInvNum, currInvNum);
    } while (!isOK);

    const setItemBg = (rI: number, cI: number) => {
      if ((rI + 1) * (cI + 1) !== 4) {
        return {
          "background-image": `url(${ONE_PNG})`,
          "background-position": `-${ITEM_WH * cI}px -${ITEM_WH * rI}px`
        };
      }
    };

    // 动态设置item宽高
    const setWH = () => {
      items = document.querySelectorAll(".item") as NodeList;
      items.forEach((d: HTMLElement) => {
        d.style.width = ITEM_WH + "px";
        d.style.height = ITEM_WH + "px";
      });
    };

    // 设置打乱后的位置
    const setItemPos = () => {
      console.log("randomArr", randomArr);
      // console.log(
      //   "items",
      //   Array.from(items).map((d) =>
      //     (d as HTMLDivElement).getAttribute("data-index")
      //   )
      // );
      // 【2，3,4，1】 打乱
      // 【1，2，3,4】 原始
      randomArr.forEach((d, i) => {
        let el = items[d - 1];
        let originElPos = items[i].dataset.originposition.split(",");
        // 改变位置
        el.style.left = Number(originElPos[0]) * ITEM_WH + "px";
        el.style.top = Number(originElPos[1]) * ITEM_WH + "px";
        el.setAttribute("data-position", items[i].dataset.originposition);
      });
    };

    // 获取当前空白块信息
    const getBlankBlockInfo = () => {
      let blankBlock = document.querySelector(".blank") as HTMLDivElement;
      let blankBlockPosArr = blankBlock.dataset.position.split(",");
      const {
        style: { left, top }
      } = blankBlock;
      return {
        blankBlock,
        blankBlockPosArr,
        blankBlockTop: top,
        blankBlockLeft: left
      };
    };

    // 判定是否可以交换
    const isCanChange = (blankBlockPosArr, currBlockPosArr) => {
      let absLeft = Math.abs(blankBlockPosArr[0] - currBlockPosArr[0]);
      let absTop = Math.abs(blankBlockPosArr[1] - currBlockPosArr[1]);
      console.log("absLeft", absLeft, "absTop", absTop);
      if (absLeft >= 1 && absTop >= 1) {
        console.log("%cXY位置不相近不能交换", "color:red;");
        return false;
      }

      if (blankBlockPosArr[0] === currBlockPosArr[0] && absTop !== 1) {
        console.log("%cX位置相同，Y位置不相近不能交换", "color:red;");
        return false;
      }
      if (blankBlockPosArr[1] === currBlockPosArr[1] && absLeft !== 1) {
        console.log("%cY位置相同，X位置不相近不能交换", "color:red;");
        return false;
      }
      return true;
    };

    // 移动item
    const moveBlock = (event: Event) => {
      let currBlock = event.target as HTMLDivElement;
      if (currBlock.classList.contains("blank")) {
        return;
      }
      const currBlockPosArr = currBlock.dataset.position.split(",");
      const {
        blankBlockTop,
        blankBlockLeft,
        blankBlock,
        blankBlockPosArr
      } = getBlankBlockInfo();
      let flag = isCanChange(blankBlockPosArr, currBlockPosArr);
      if (flag) {
        const currBlockLeft = currBlock.style.left;
        const currBlockTop = currBlock.style.top;
        // 交换
        blankBlock.style.left = currBlockLeft;
        blankBlock.style.top = currBlockTop;
        blankBlock.setAttribute(
          "data-position",
          `${currBlockPosArr[0]},${currBlockPosArr[1]}`
        );
        currBlock.style.left = blankBlockLeft;
        currBlock.style.top = blankBlockTop;
        currBlock.setAttribute(
          "data-position",
          `${blankBlockPosArr[0]},${blankBlockPosArr[1]}`
        );
      }
    };

    // 判定成功失败
    const isWin = () => {};

    onMounted(() => {
      nextTick(() => {
        setWH();
        setItemPos();
      });
    });

    return {
      modeList: data.modeList,
      mode: data.mode,
      setWH,
      setItemBg,
      moveBlock,
      level
    };
  }
};
</script>
<style lang="less" scoped>
.container {
  margin: 0 auto;
  border: 1px solid red;
  width: 1100px;
  height: 700px;
  display: flex;
  .img {
    width: 300px;
    display: block;
  }
  .gamebox {
    width: 600px;
    height: 600px;
    margin-left: 100px;
    background-color: #fff;
    position: relative;
    .row {
      overflow: hidden;
      .item {
        width: 200px;
        height: 200px;
        box-sizing: content-box;
        border: 3px solid #EEE;
        background-repeat: no-repeat;
        position: absolute;
        cursor: pointer;
        transition: all .5s ease-in-out;
        background-color: #000;
      }
    }
  }
}
</style>
