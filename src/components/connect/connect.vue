<template>
  <div style="position: relative">
    <div class="connect-game-wrap-box">
      <div class="connect-game-wrap-box-content" ref="boxContent">
        <div
          v-for="(row, rIndex) in new Array(rowCol.row)"
          :key="rIndex"
          class="connect-game-wrap-box-content-row"
        >
          <div
            v-for="(col, cIndex) in new Array(rowCol.col)"
            :key="cIndex"
            class="connect-game-wrap-box-content-row-col"
          >
            <div
              class="connect-game-wrap-box-content-row-col-item"
              @mousedown.prevent="
                mouseDown(
                  $event,
                  rIndex + 1,
                  cIndex + 1,
                  rIndex * rowCol.col + cIndex + 1
                )
              "
              @mousemove.prevent="
                mouseMove(
                  rIndex + 1,
                  cIndex + 1,
                  rIndex * rowCol.col + cIndex + 1
                )
              "
              @mouseup.prevent="mouseUp"
            >
              <div
                v-for="(img, index) in lineArr"
                :key="index"
                class="connect-game-wrap-box-content-row-col-item-img-wrap"
              >
                <img
                  :src="img.icon"
                  draggable="false"
                  v-if="
                    img.connect[0] == rIndex * rowCol.col + cIndex + 1 ||
                    rIndex * rowCol.col + cIndex + 1 == img.connect[1]
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref="canvasBox" class="canvasBox"></div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, nextTick } from "vue";
import config from "./config.js";
import { setItemWH } from "./style.js";
import method from "./method.js";
export default {
  setup() {
    let data = reactive({
      lineArr: config.lineArr,
      rowCol: {
        col: config.colunm,
        row: config.row
      },
      isDrawLine: false,
      canvasObj: {}
    });

    onMounted(() => {
      nextTick(() => {
        let max = Math.max(data.rowCol.col, data.rowCol.row);
        let doms = document.querySelectorAll(
          ".connect-game-wrap-box-content-row-col-item"
        );
        setItemWH(doms, max);

        let boxContent = document.querySelector(
          ".connect-game-wrap-box-content "
        );
        boxContent.addEventListener("mouseleave", (ev) => {
          // 鼠标移动canvas区域默认线条绘画完成
          // 不直接在canvas添加事件，是因为  pointer-events: none;
          // 无法再检测该事件
          let event = ev || window.event;
          event.stopImmediatePropagation();
          mouseLeave();
        });
      });
    });
    const { mouseDown, mouseMove, mouseUp, mouseLeave } = method({
      rowCol: data.rowCol,
      isDrawLine: data.isDrawLine
    });
    return {
      mouseMove,
      mouseUp,
      mouseDown,
      lineArr: data.lineArr,
      rowCol: data.rowCol
    };
  }
};
</script>

<style lang="less" scoped>
.connect-game-wrap-box {
  box-sizing: border-box;
  width: 578px;
  height: 578px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 40px;
  z-index: 99;
  background: #d27126;
  border: 12px solid #ffc61a;
  .connect-game-wrap-box-content {
    width: calc(100% - 26px);
    box-sizing: border-box;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .connect-game-wrap-box-content-row {
      display: flex;
      box-sizing: content-box;
      justify-content: center;
      &:first-child {
        .connect-game-wrap-box-content-row-col {
          margin-top: 0px;
        }
      }
      .connect-game-wrap-box-content-row-col {
        display: flex;
        margin-top: 4px;
        &:not(:first-child) {
          margin-left: 4px;
        }
        .connect-game-wrap-box-content-row-col-item {
          background: #fff;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          font-family: FZY4JW;
          color: #ff962e;
          .connect-game-wrap-box-content-row-col-item-img-wrap {
            // 阻止point、鼠标等事件，正确获取当前item元素
            pointer-events: none;
            img {
              margin-top: 10px;
              width: 80%;
              height: 80%;
              pointer-events: none;
            }
          }
        }
      }
    }
  }
}

.canvasBox {
  // 阻止point、鼠标等事件，正确获取当前item元素
  pointer-events: none;
  top: -12px;
  left: 50%;
  transform: translate(-50%, 0);
  position: absolute;
  border-radius: 40px;
  width: 578px;
  height: 578px;
  box-sizing: border-box;
  z-index: 9999;
}
</style>
