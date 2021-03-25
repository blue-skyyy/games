import { nextTick } from "vue";
import config from "./config.js";
export default function methods(data, itemStartRefs, hackReset) {
  const selectStartPoint = (index, info, status) => {
    if (data.isBacking || data.isMoving) return;
    // 已移动不可以再选择
    if (status === "moved" || status === "reset") return;
    // 如果已有终点信息清除,保证当前所选起点信息是最新的
    if (data.endPointInfo) {
      clearSelectInfo();
    }
    data.startPointActiveIndex = index;
    data.startPointInfo = info;
  };

  // 终点信息
  const selectEndPoint = (index, info) => {
    if (data.isBacking || data.isMoving) return;
    // 必须先选中起点
    if (data.startPointInfo) {
      data.endPointActiveIndex = index;
      data.endPointInfo = info;
      judgeMove();
    } else {
      // 否则清空所有状态
      clearSelectInfo();
    }
  };

  // 判断冰块是否可以移动
  const judgeMove = () => {
    // 所选起点和终点方块不在x,y方向不可移动
    if (
      data.startPointInfo.x !== data.endPointInfo.x &&
      data.startPointInfo.y !== data.endPointInfo.y
    ) {
      clearSelectInfo();
      return;
    }
    let gap, max, min, direction, filterDir;
    if (data.startPointInfo.x === data.endPointInfo.x) {
      // Y方向可以移动
      direction = "y";
      filterDir = "x";
    }
    if (data.startPointInfo.y === data.endPointInfo.y) {
      // X方向可以移动
      direction = "x";
      filterDir = "y";
    }
    gap = data.endPointInfo[direction] - data.startPointInfo[direction];
    if (Math.abs(gap) === 1) {
      // 间隔为1可移动
      move(direction);
    } else if (Math.abs(gap) !== 1) {
      // 间隔大于1
      gap > 0
        ? ((max = data.endPointInfo[direction]),
          (min = data.startPointInfo[direction]))
        : ((max = data.startPointInfo[direction]),
          (min = data.endPointInfo[direction]));
      // crossArr为x或y方向 起点、终点间的数组
      const crossArr = data.list.filter(
        (d) =>
          d.position[filterDir] === data.endPointInfo[filterDir] &&
          d.position[direction] > min &&
          d.position[direction] < max
      );
      let isCross = true;
      // 如果数组有一个元素状态不为ice则不能滑动
      for (let i = 0; i < crossArr.length; i++) {
        if (crossArr[i].status !== "ice") {
          isCross = false;
          break;
        }
      }
      if (isCross) {
        move(direction);
      } else {
        console.error("不能滑动");
      }
    }
  };

  const getMoveDistance = (direction) => {
    let ref = `ice_start_${data.startPointActiveIndex}`;
    let gap = data.endPointInfo[direction] - data.startPointInfo[direction];
    let dis = itemStartRefs.get(ref)[
      direction === "x" ? "offsetLeft" : "offsetTop"
    ];
    return 104 * gap + dis;
  };
  // 移动冰块
  const move = (direction) => {
    let dom;
    let ref = `ice_start_${data.startPointActiveIndex}`;
    dom = itemStartRefs.get(ref);
    dom.style.zIndex = 66;
    dom.style[
      direction === "x" ? "left" : direction === "y" ? "top" : ""
    ] = `${getMoveDistance(direction)}px`;
    data.isMoving = true;
    // 改变LIST状态
    setTimeout(() => {
      // 冰块起变为返回
      setListStatus(data.startPointActiveIndex, "reset");
      // 空格子变为冰块
      setListStatus(data.endPointActiveIndex, "ice");
      // 历史记录里PUSH一条
      pushHistoryList({
        startIndex: data.startPointActiveIndex,
        direction,
        endIndex: data.endPointActiveIndex
      });
      dom.style.zIndex = 2;
      data.isMoving = false;
      clearSelectInfo();
      isWinGame();
    }, 1200);
  };

  // 返回按钮将冰块重置
  const backIceSquare = (domIndex) => {
    if (!data.iceHistory.getLength()) return;
    if (data.isBacking || data.isMoving) return;
    let lastHistory = data.iceHistory.getLast();
    // 只能逐步返回
    if (lastHistory.startIndex !== domIndex) return;
    if (lastHistory.startIndex === domIndex) {
      data.isBacking = true;
      backMove(domIndex, lastHistory);
      // 把最后一条记录删掉
      data.iceHistory.delLast();
      // DOM复位才能做其他事
      setTimeout(() => {
        // 将最近一条记录返回按钮复位
        if (data.iceHistory.getLength() > 0) {
          lastHistory = data.iceHistory.getLast();
          setListStatus(lastHistory.startIndex, "reset");
        }
        data.isBacking = false;
      }, 1200);
    }
  };
  // 冰块重置移动算法
  const backMove = (domIndex, lastHistory) => {
    const { direction, endIndex, startIndex } = lastHistory;
    let ref = `ice_start_${domIndex}`;
    let dom = itemStartRefs.get(ref);
    if (direction === "x") {
      dom.style.left = "50%";
    }
    if (direction === "y") {
      dom.style.top = "45%";
    }
    dom.style.zIndex = 100;
    // 冰块 moved状态取消
    setListStatus(startIndex, "");
    // 空格格子状态恢复
    setListStatus(endIndex, "");
    clearSelectInfo();
  };

  const setListStatus = (index, status) => {
    data.list[index] = Object.assign({}, data.list[index], {
      status: status
    });
  };

  const pushHistoryList = (history) => {
    if (data.iceHistory.getLength() > 0) {
      const lastHistory = data.iceHistory.getLast();
      setListStatus(lastHistory.startIndex, "moved");
    }
    data.iceHistory.push(history);
  };

  const isWinGame = () => {
    let isWin = data.list
      .filter((d) => d.type === "square_empty")
      .every((d) => d.status === "ice");
    if (isWin) {
      alert("游戏结束");
    } else {
      console.log(
        "%c=====游戏没结束=====",
        "color:green;font-size:15px;background:blue;"
      );
    }
  };
  // 清除信息
  const clearSelectInfo = () => {
    data.startPointActiveIndex = null;
    data.startPointInfo = null;
    data.endPointActiveIndex = null;
    data.endPointInfo = null;
  };

  const cloneDeep = (obj) => {
    if (obj === null) return null;
    let newObj = obj instanceof Array ? [] : {};
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        // 过滤继承属性
        newObj[i] = typeof obj[i] === "object" ? cloneDeep(obj[i]) : obj[i];
      }
    }
    return newObj;
  };

  const reStartGame = () => {
    hackReset.value = false; //销毁组件
    nextTick(() => {
      clearSelectInfo();
      data.iceHistory.empty();
      data.list = cloneDeep(config.list);
      data.isMoving = false; // 是否在移动
      data.isBacking = false; // 是否在回退
      hackReset.value = true; //重建组件
    });
  };

  return {
    reStartGame,
    selectStartPoint,
    selectEndPoint,
    backIceSquare
  };
}
