import config from "./config.js";

export default class Connect {
  constructor() {
    this.connectArr = config.lineArr.map((d) => d.connect).flat(Infinity);
    this.indexArr = [];
  }

  push(index) {
    this.indexArr.push(index);
  }

  getFirst() {
    return this.indexArr[0];
  }

  getLast() {
    return this.indexArr[this.indexArr.length - 1];
  }

  getMid() {
    return this.indexArr.slice(1, this.indexArr.length - 1);
  }

  invalidConnect() {
    // 首尾必须是图片,indexArr里存在该索引
    // 中间不能在有图片点
    if (this.indexArr.length === 0) return;
    let start = this.getFirst();
    let end = this.getLast();
    if (
      // 首尾是图片
      this.connectArr.indexOf(start) !== -1 &&
      this.connectArr.indexOf(end) !== -1
    ) {
      // 中间不能是图片
      let flag = false;
      let mid = this.getMid();
      try {
        mid.forEach((d) => {
          if (this.connectArr.indexOf(d) !== -1) {
            flag = true;
            throw new Error("存在图片索引");
          }
        });
      } catch (e) {}
      return flag;
    } else {
      return true;
    }
  }
}
