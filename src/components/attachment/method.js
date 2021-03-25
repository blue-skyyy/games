import config from "./config.js";

const correspondingsMap = new Map();
config.correspondings.forEach((d) => {
  correspondingsMap.set(`${d}`, true);
});

export default function method(activeIndex, lineArr) {
  let lineInfo = {};
  let SVG_BOX_HEIGHT = null,
    indexKey = {};
  const selectImg = (flag, event, index) => {
    if (flag === "start") {
      lineInfo.x1 =
        Math.floor(event.target.offsetWidth / 2) + event.target.offsetLeft;
      lineInfo.y1 = 0;
      indexKey.start = index;
      activeIndex.start = index;
    }

    if (flag === "end") {
      lineInfo.x2 =
        Math.floor(event.target.offsetWidth / 2) + event.target.offsetLeft;
      lineInfo.y2 = SVG_BOX_HEIGHT;
      indexKey.end = index;
      activeIndex.end = index;
    }

    if (lineInfo.x1 && lineInfo.x2) {
      juedeLine();
    }
  };

  const juedeLine = () => {
    if (!correspondingsMap.has(`${indexKey.start},${indexKey.end}`)) {
      // 错误
      lineInfo.strokeDasharray = "10 10";
      lineInfo.isErr = true;
      lineInfo.stroke = "#D5D5D5";
      lineInfo.strokeWidth = "4";
      lineArr.push(lineInfo);
      setTimeout(() => {
        // 删除
        lineArr.splice(lineArr.length - 1, 1);
        activeIndex.start = null;
        activeIndex.end = null;
      }, 1500);
    } else {
      lineInfo.stroke = "#FFC61A";
      lineInfo.strokeWidth = "2";
      lineArr.push(lineInfo);
      setTimeout(() => {
        isWin();
        activeIndex.start = null;
        activeIndex.end = null;
      }, 1500);
    }
    lineInfo = {};
    indexKey = {};
  };

  const svgBox = (el) => {
    if (el) {
      SVG_BOX_HEIGHT = el && el.offsetHeight;
    }
  };

  const isWin = () => {
    if (lineArr.length === 4) {
      console.log("%cYOU WIN", "color:red;font-size:15px;background:yellow;");
    }
  };

  return {
    selectImg,
    svgBox
  };
}
