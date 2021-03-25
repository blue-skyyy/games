
import { inversionNum, shuffle } from "../../utils/index";
const C_WH = 600; // 容器宽高
let ITEM_WH: number;
let ORIGIN_ARR: Array<number>;
let RANDOM_ARR: Array<number>;
let IS_MOVING: boolean = false;
let NODES: NodeListOf<Element>;
export class Game {
  private level: number;
  public originInvNum: any = null;
  public BgImage: any;
  public constructor(level: number, bg: any) {
    this.level = level;
    this.BgImage = bg;
  }

  public start() {
    if (this.init()) {
      ITEM_WH = C_WH / this.level;
      let fragment = document.createDocumentFragment();
      let nodes:any = [];
      let item;
      for (let y = 0;y < this.level; y++) {
        for (let x = 0;x < this.level; x++) {
          item = this.createElement(y, x, 
            (x + 1 === this.level && y + 1 === this.level));
          nodes.push(item);
          fragment.appendChild(item);
        }
      }
      RANDOM_ARR.forEach((d, i) => {
        let el = nodes[d - 1];
        let originElPos = nodes[i].dataset.originpos.split(",");
        // 改变位置
        el.style.left = Number(originElPos[0]) * ITEM_WH + "px";
        el.style.top = Number(originElPos[1]) * ITEM_WH + "px";
        el.setAttribute("data-position", nodes[i].dataset.originpos);
      });
      (document.querySelector(".gamebox") as HTMLDivElement).appendChild(fragment);
      NODES = document.querySelectorAll(".item");
    }
  }

  public init() {
    ORIGIN_ARR = Array.from(
      { length: Math.pow(this.level, 2) },
      (d, i: number) => i + 1
    );
    // https://blog.csdn.net/u013282507/article/details/52123266?utm_source=blogxgwz6
    // 可复原的图片条件：
    // 打乱后的数组的 原来的数 + 空白的行数 + 空白的列数 = 逆序数 + 空白的行数 + 空白的列数
    // 获取原始的逆序数.....貌似有问题???
    this.originInvNum = inversionNum(ORIGIN_ARR) + (this.level - 1) * 2;
    let currInvNum;
    let isOK: boolean = false;
    do {
      // 前n-1位乱序
      RANDOM_ARR = shuffle(ORIGIN_ARR.slice(0, ORIGIN_ARR.length - 1));
      // 添加最后一位
      RANDOM_ARR.push(ORIGIN_ARR[ORIGIN_ARR.length - 1]);
      // 乱序后数组 逆序数
      currInvNum = inversionNum(RANDOM_ARR) + (this.level - 1) * 2;
      isOK = this.isSameOddEven(this.originInvNum, currInvNum);
    } while (!isOK);
    return true;
  }

  public createElement(y:number, x:number, flag:boolean) {
    let div = document.createElement("div");
    div.classList.add("item");
    div.style.position = "absolute";
    div.style.width = ITEM_WH + "px";
    div.style.height = ITEM_WH + "px";
    div.style.border = "1px solid #CCC";
    div.style.boxSizing = "border-box";
    div.style.transition = "all .7s ease-in-out"
    div.style.cursor = "pointer";
    div.style.backgroundRepeat = "no-repeat";
    div.setAttribute("data-originpos", `${[x, y]}`);
    div.addEventListener("click", (e) => {this.moveBlock(e)}, false)
    if (!flag) {
      div.style.backgroundImage = `url(${this.BgImage})`;
      div.style.backgroundPosition = `-${ITEM_WH * x}px -${ITEM_WH * y}px`;
    } else {
      div.classList.add("blank");
      // 最后一个元素
      div.style.backgroundColor = "#596164";
    }
    return div;
  }

  moveBlock(event:Event) {
    event.preventDefault();
    if (IS_MOVING)return;
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
    } = this.getBlankBlockInfo();
    let flag = this.isCanChange(blankBlockPosArr, currBlockPosArr);
    if (flag) {
      IS_MOVING = true;
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
    setTimeout(() => {
      if (this.isWin()) {
        alert("YOU WIN")
      }
      IS_MOVING = false;
    }, 1000)
   
  }

  getBlankBlockInfo(): any {
    let blankBlock = (document.querySelector(".blank")) as HTMLElement;
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
  }

    // 判定是否可以交换
  isCanChange (blankBlockPosArr: Array<string>, currBlockPosArr: Array<string>): boolean {
    let absLeft = Math.abs(Number(blankBlockPosArr[0]) - Number(currBlockPosArr[0]));
    let absTop = Math.abs(Number(blankBlockPosArr[1]) - Number(currBlockPosArr[1]));
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
  }

  destory() {
    let gamebox = document.querySelector(".gamebox") as HTMLDivElement;
    for (let i = NODES.length - 1; i >= 0; i--) {
      gamebox.removeChild(NODES[i]);
    }
  }

  isWin() {
    let flag = false;
    try {
      NODES.forEach(d => {
        let originPos = d.getAttribute("data-originpos");
        let pos = d.getAttribute("data-position");
        if (originPos !== pos) {
          throw new Error();
        }
      })
      flag = true;
    } catch(e) {
      console.log("%c游戏未完成", "color:green;")
    }
    return flag;
  }

 isSameOddEven(n: number, m: number) {
    return n % 2 === m % 2;
  };
}