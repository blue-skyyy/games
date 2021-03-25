export default class Point {
  constructor() {
    this.pointArr = [];
    this.map = new Map();
    this.invalidDir = false;
    this.dirInfo = {};
  }

  push(x, y) {
    this.pointArr.push([x, y]);
    this.getDirInfo();
  }

  judgeDirInfo(dirInfo) {
    if (!this.dirInfo) {
      this.dirInfo = dirInfo;
    } else {
      let { currDir } = dirInfo;
      if (currDir === this.dirInfo.invalidDir) {
        console.log(
          "%c错误的连接方向",
          "color:red;font-size:15px;background:blue;"
        );
        this.invalidDir = true;
      } else {
        this.dirInfo = dirInfo;
      }
    }
  }

  getDirInfo() {
    if (this.pointArr.length > 1) {
      let dirInfo;
      const backArr = this.pointArr.slice(-2);
      let [x, y] = backArr[1];
      let [preX, preY] = backArr[0];
      if (x === preX && y < preY) {
        dirInfo = {
          currDir: "top",
          invalidDir: "bottom"
        };
      }
      if (x === preX && y > preY) {
        dirInfo = {
          currDir: "bottom",
          invalidDir: "top"
        };
      }
      if (y === preY && x > preX) {
        dirInfo = {
          currDir: "right",
          invalidDir: "left"
        };
      }
      if (y === preY && x < preX) {
        dirInfo = {
          currDir: "left",
          invalidDir: "right"
        };
      }
      this.judgeDirInfo(dirInfo);
    }
  }

  invalidPoint(x, y) {
    let lastPoint = this.getLastPoint();
    if (lastPoint) {
      // 出现折角情况
      if (x !== lastPoint[0] && y !== lastPoint[1]) {
        console.log(
          `%c当前点非法,当前点:${x},${y}`,
          "color:red;font-size:15px;background:blue;"
        );
        console.log("pointArr:", this.pointArr);
        return true;
      } else if (x === lastPoint[0] && y === lastPoint[1]) {
        // 与前一个点的x,y相等不计入
        return true;
      } else {
        // 确保每个点不会重复
        if (!this.map.has(`${x},${y}`)) {
          this.map.set(`${x},${y}`, [x, y]);
          this.push(x, y);
          return false;
        } else {
          // 重复不再push
          return true;
        }
      }
    } else {
      // 起始点
      this.map.set(`${x},${y}`, [x, y]);
      this.push(x, y);
      return false;
    }
  }

  getLastPoint() {
    if (this.pointArr.length === 0) return false;
    return this.pointArr[this.pointArr.length - 1];
  }

  getPointArr() {
    return this.pointArr;
  }
}
