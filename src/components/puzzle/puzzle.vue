<template>
  <div class="container">
    <div class="puzzle-game-container" v-if="list && list.length && rowCol">
      <div class="puzzle-game-right">
        <div class="puzzle-game-right-reset" @click="reStartGame"></div>
      </div>
      <div class="puzzle-game-box">
        <div
          class="puzzle-game-box-content"
          v-if="hackReset"
          :style="setGameBoxHeight(rowCol.col, rowCol.row)"
        >
          <div
            class="puzzle-game-box-content-item"
            :style="[
              setItemStyle(
                list[index].radius === true ? list[index].direction : null,
                list[index].position
              )
            ]"
            v-for="(d, index) in Array(list.length)"
            :key="index"
          >
            <div
              v-if="list[index].type === 'square_empty'"
              :class="bindClass(list[index].type)"
            >
              <div
                class="square-empty-default"
                @click.stop="selectEndPoint(index, list[index].position)"
              ></div>
            </div>

            <div
              v-if="list[index].type === 'square_ice'"
              @click.stop="
                selectStartPoint(
                  index,
                  list[index].position,
                  list[index].status
                )
              "
              :class="bindClass(list[index].type)"
            >
              <div class="square-ice-wrap-default">
                <div
                  class="square-ice-wrap-default-ice"
                  :ref="setItemRefStart('ice_start_' + index)"
                ></div>
                <div class="square-ice-wrap-default-reset">
                  <div
                    v-if="list[index].status === 'reset'"
                    @click.stop="backIceSquare(index)"
                  >
                    <img
                      src="./back.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref, watch } from "vue";
import config from "./config.js";
import { bindClass, setGameBoxHeight, setItemStyle } from "./style.js";
import methods from "./method.js";
import getRef from "./ref.js";
import { ICEHistory } from "./History";

export default {
  setup(props, context) {
    let data = reactive({
      list: config.list,
      rowCol: config.rowCol,
      isBacking: false,
      isMoving: false,
      startPointActiveIndex: null,
      startPointInfo: null,
      endPointActiveIndex: null,
      endPointInfo: null,
      iceHistory: new ICEHistory()
    });
    const hackReset = ref(true);

    const { setItemRefStart, itemStartRefs } = getRef();
    const {
      selectStartPoint,
      selectEndPoint,
      backIceSquare,
      reStartGame
    } = methods(data, itemStartRefs, hackReset);

    onMounted(() => {});

    return {
      hackReset,
      reStartGame,
      setItemRefStart,
      itemStartRefs,
      bindClass,
      setItemStyle,
      setGameBoxHeight,
      selectStartPoint,
      selectEndPoint,
      list: data.list,
      rowCol: data.rowCol,
      backIceSquare
    };
  }
};
</script>

<style lang="less">
p,
div,
span {
  user-select: none;
}

.container {
  height: 750px;
  width: 1334px;
  margin: 0 auto;
  .puzzle-game-container {
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    //
    width: 100%;
    position: relative;
    .puzzle-game-header {
      overflow: hidden;
      display: flex;
      justify-content: center;
      text-align: center;
      .puzzle-game-header-title,
      .puzzle-game-header-timer {
        box-sizing: border-box;
        height: 68px;
        border-radius: 0 0 44px 44px;
        display: inline-block;
        font-size: 36px;
        color: #fff;
        height: 68px;
        background: #546be7;
        border-radius: 0px 0px 44px 44px;
        box-shadow: 0px -8px 0px 0px #354ed5 inset;
      }
      .puzzle-game-header-title {
        width: 257px;
      }
      .puzzle-game-header-timer {
        margin-left: 3px;
        width: 157px;
      }
    }
    .puzzle-game-right {
      .puzzle-game-right-reset {
        cursor: pointer;
        width: 72px;
        height: 72px;
        background-image: url("./reset.png");
        background-repeat: no-repeat;
        background-position: center center;
        border-radius: 50%;
        box-sizing: border-box;
        position: absolute;
        left: 80%;
        top: 50px;
      }
    }
    .puzzle-game-box {
      width: 580px;
      height: 580px;
      background: #00a5ff;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 16px solid #fff;
      position: relative;
      top: 25px;
      left: 50%;
      transform: translate(-50%, 0);
      &::after {
        content: "";
        width: 556px;
        height: 556px;
        position: absolute;
        background: #00bfff;
        border-radius: 30px;
      }
      .puzzle-game-box-content {
        z-index: 2;
        background: transparent;
        position: relative;
        .puzzle-game-box-content-item {
          width: 104px;
          height: 104px;
          position: absolute;
          background-color: #1467c5;
          border: 2px solid rgba(103, 201, 255, 0.16);
          box-sizing: border-box;
        }
        .square-empty-wrap {
          background-color: #1467c5;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .square-empty-default {
            cursor: pointer;
            width: 64px;
            height: 70px;
            background: #0f4889;
            border-radius: 8px;
            box-shadow: 0px 10px 0px 0px #183755 inset;
            // border: 2px solid green;
          }
          .endPointActive {
            border-top: 2px solid #0095ff;
            border-bottom: 2px solid #0095ff;
            border-left: 2px solid #0095ff;
            border-right: 2px solid #0095ff;
          }
        }
        .square-ice-wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .square-ice-wrap-default {
            width: 84px;
            height: 84px;
            background: #00bfff;
            border-radius: 8px;
            box-shadow: 0px -4px 0px 0px #00a9fe inset;
            position: relative;
            .square-ice-wrap-default-ice {
              box-sizing: border-box;
              cursor: pointer;
              width: 59px;
              height: 58px;
              // background: red;
              background: #c6f1ff;
              border-radius: 8px;
              box-shadow: 0px 8px 0px 0px #72d8ff;
              transform: translate(-50%, -50%);
              top: 45%;
              left: 50%;
              position: absolute;
              z-index: 22;
              transition: left 1s ease, top 1s ease;
              -moz-transition: left 1s ease, top 1s ease; /* Firefox 4 */
              -webkit-transition: left 1s ease, top 1s ease; /* Safari 和 Chrome */
              -o-transition: left 1s ease, top 1s ease; /* Opera */
            }
            .startPointActive {
              border-top: 4px solid #0095ff;
              border-bottom: 4px solid #0095ff;
              border-left: 2px solid #0095ff;
              border-right: 2px solid #0095ff;
            }

            .square-ice-wrap-default-reset {
              cursor: pointer;
              background: #00a7ff;
              border-radius: 8px;
              box-shadow: 0px 10px 0px 0px #0097ff inset;
              width: 60px;
              height: 65px;
              transform: translate(-50%, -50%);
              position: absolute;
              top: 50%;
              left: 50%;
            }
          }
        }
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 1334px;
    height: 750px;
    z-index: 999;
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
