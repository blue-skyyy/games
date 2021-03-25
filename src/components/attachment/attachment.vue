<template>
  <div class="attachment-wrap">
    <div class="attachment-wrap-box">
      <div v-for="(d, index) in config.list.slice(0, middleIndex)" :key="index">
        <img
          :src="d.url"
          @click="selectImg('start', $event, index + 1)"
          :class="{ activeImg: activeIndex.start === index + 1 }"
        />
      </div>
      <div class="svgBox" ref="svgRef">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          id="mySvg"
        >
          <line
            v-for="(d, index) in lineArr"
            :key="index"
            :x1="d.x1"
            :x2="d.x2"
            :y1="d.y1"
            :y2="d.y2"
            :style="{
              stroke: d.stroke,
              'stroke-width': d.strokeWidth,
              'stroke-dasharray': d.strokeDasharray
            }"
            :class="{ errLine: d.isErr }"
          />
        </svg>
      </div>
      <div v-for="(d, index) in config.list.slice(middleIndex)" :key="index">
        <img
          :src="d.url"
          @click="selectImg('end', $event, index + 5)"
          :class="{ activeImg: activeIndex.end === index + 5 }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import config from "./config.js";
import method from "./method.js";
import { ref, onMounted, reactive, watch } from "vue";
export default {
  setup() {
    let svgRef = ref(null);
    let lineArr = reactive([]);
    let activeIndex = reactive({
      start: null,
      end: null
    });
    let middleIndex = config.list.length / 2;
    const { selectImg, svgBox } = method(activeIndex, lineArr);
    onMounted(() => {
      svgBox(svgRef.value);
    });

    watch(lineArr, (val) => {
      console.log("===lineArr====", val);
    });

    return {
      lineArr,
      svgRef,
      config,
      selectImg,
      activeIndex,
      middleIndex
    };
  }
};
</script>
<style lang="less" scoped>
@keyframes blink {
  0% {
    opacity: 0;
  }
  35% {
    opacity: 0.35;
  }
  55% {
    opacity: 0.55;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 0;
  }
}

.errLine {
  animation: blink 0.5s infinite ease-in;
  -webkit-animation: blink 0.5s infinite ease-in;
}
.attachment-wrap {
  width: 800px;
  height: 600px;
  margin: 0 auto;
  position: relative;
  border: 2px solid #000;
  img {
    width: 150px;
    height: 120px;
    border: 2px solid red;
    border-radius: 10px;
    box-sizing: border-box;
  }
  .activeImg {
    border: 2px solid green;
  }
  .svgBox {
    grid-area: svgBox;
    width: 100%;
    height: 100%;
  }
  .attachment-wrap-box {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      ". . . ."
      "svgBox svgBox svgBox svgBox"
      ". . . .";
    grid-template-rows: auto 45% auto;
    justify-items: center;
    align-items: center;
  }
}
</style>
