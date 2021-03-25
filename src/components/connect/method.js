import Point from "./Point.js";
import Connect from "./Connect.js";
import config from "./config.js";
// 图片配对关系
const ANSWER = config.lineArr.map((d) =>
  JSON.stringify(d.connect.sort((a, b) => a - b))
);

let CONNECT_INFO_DATA = [];
export default function method({ rowCol, isDrawLine }) {
  let RESULT = [];
  let C_BOX;
  let ITEM_WH;
  let context;
  let pointIns;
  let connectIns;
  let C_Id;
  const mouseDown = (ev, rIndex, cIndex, startIndex) => {
    if (isDrawLine) return;
    pointIns = null;
    connectIns = null;
    C_BOX = C_BOX || document.querySelector(".canvasBox");
    let target = document.elementFromPoint(ev.clientX, ev.clientY);
    ITEM_WH = target.offsetWidth;
    let c = setCanvas();
    context = c.getContext("2d");
    context.strokeStyle = "#D5D5D5";
    // 线宽设置，必须放在绘制之前
    context.lineWidth = 6;
    context.lineCap = "round";
    context.lineJoin = "round"; //转折的时候不出现尖角
    context.beginPath();
    pointIns = new Point();
    connectIns = new Connect();
    const { x, y } = getCenterPointer(rIndex, cIndex);
    if (!pointIns.invalidPoint(x, y)) {
      context.moveTo(x, y);
      connectIns.push(startIndex);
    }
    isDrawLine = true;
  };

  const mouseMove = (rIndex, cIndex, moveIndex) => {
    if (!isDrawLine) return;
    const { x, y } = getCenterPointer(rIndex, cIndex);
    if (!pointIns.invalidPoint(x, y)) {
      context.lineTo(x, y);
      connectIns.push(moveIndex);
    }
    context.stroke();
  };

  const mouseUp = () => {
    if (!connectIns) return;
    if (!connectIns.invalidConnect() && !pointIns.invalidDir) {
      // 合法的连接
      context.strokeStyle = "#FFC61A";
      context.stroke();
      let first = connectIns.getFirst();
      let end = connectIns.getLast();
      // 保证每个图片只能有一条连线
      if (!isRepeatConnect(first, end)) {
        RESULT.push(JSON.stringify([first, end].sort((a, b) => a - b)));
      }
      isDrawLine = false;
      pointIns = null;
      connectIns = null;
      if (RESULT.length === ANSWER.length) {
        setTimeout(() => {
          isGameOver() ? alert("YOU WIN") : alert("YOU LOSE");
          delCanvas();
          RESULT = [];
          CONNECT_INFO_DATA = [];
        }, 200);
      }
    } else {
      // 删除canvas
      setTimeout(() => {
        let c = document.getElementById(C_Id);
        c && c.parentNode.removeChild(c);
        isDrawLine = false;
        pointIns = null;
        connectIns = null;
        // RESULT = [];
      }, 200);
    }
  };

  const mouseLeave = () => {
    if (!pointIns || !connectIns) return;
    mouseUp();
  };

  const isRepeatConnect = (first, end) => {
    if (CONNECT_INFO_DATA.length === 0) {
      CONNECT_INFO_DATA.push({
        id: C_Id,
        img: [first, end]
      });
      return false;
    } else {
      let delIndex = [];
      for (let i = 0; i < CONNECT_INFO_DATA.length; i++) {
        let d = CONNECT_INFO_DATA[i];
        if (
          d.img[0] === first ||
          d.img[1] === first ||
          d.img[1] === end ||
          d.img[0] === end
        ) {
          delIndex.push({ ...d, delIndex: i });
        }
      }
      if (delIndex && delIndex.length) {
        delIndex.forEach((connect) => {
          CONNECT_INFO_DATA.splice(connect.delIndex, 1);
          let c = document.getElementById(`${connect.id}`);
          c && c.parentNode.removeChild(c);
        });
        CONNECT_INFO_DATA.push({ id: C_Id, img: [first, end] });
        return true;
      } else {
        CONNECT_INFO_DATA.push({ id: C_Id, img: [first, end] });
        return false;
      }
    }
  };

  const isGameOver = () => {
    let flag = true;
    try {
      ANSWER.forEach((d) => {
        if (RESULT.indexOf(d) === -1) {
          flag = false;
          throw new Error("游戏回答错误");
        }
      });
    } catch (e) {
      console.log(
        "%c游戏回答错误",
        "color:red;font-size:15px;background:yellow;"
      );
    }
    return flag;
  };

  const setCanvas = () => {
    let c = document.createElement("canvas");
    C_Id = "c_" + Date.now();
    // 4 是间距
    let h = ITEM_WH * rowCol.row + (rowCol.row - 1) * 4;
    let w = ITEM_WH * rowCol.col + (rowCol.col - 1) * 4;
    c.style.width = w + "px";
    c.style.height = h + "px";
    c.id = C_Id;
    // 内部像素
    c.width = w;
    c.height = h;
    c.style.position = "absolute";
    c.style.top = "50%";
    c.style.left = "50%";
    c.style.transform = "translate(-50%, -50%)";
    c.style.zIndex = 9;
    C_BOX.appendChild(c);
    return c;
  };

  const getCenterPointer = (rIndex, cIndex) => {
    let itemCenter = parseInt(ITEM_WH / 2);
    let x = (cIndex - 1) * (4 + ITEM_WH) + itemCenter;
    let y = (rIndex - 1) * (4 + ITEM_WH) + itemCenter;
    return { x, y };
  };

  const delCanvas = () => {
    const canvasList = C_BOX.childNodes;
    // 一定要倒序删除，正序删不干净
    for (let i = canvasList.length - 1; i >= 0; i--) {
      C_BOX.removeChild(canvasList[i]);
    }
  };

  return {
    mouseDown,
    mouseUp,
    mouseMove,
    mouseLeave
  };
}
