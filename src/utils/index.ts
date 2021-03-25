// 图片在指定大小的等比缩放
export const scaleWH = (
  imageW: number,
  imageH: number,
  maxWidth: number,
  maxHeight: number
): object | undefined => {
  let tempWidth;
  let tempHeight;

  if (imageW > 0 && imageH > 0) {
    //原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
    if (imageW / imageH >= maxWidth / maxHeight) {
      if (imageW > maxWidth) {
        tempWidth = maxWidth;
        // 按原图片的比例进行缩放
        tempHeight = (imageH * maxWidth) / imageW;
      } else {
        // 按原图片的大小进行缩放
        tempWidth = imageW;
        tempHeight = imageH;
      }
    } else {
      // 原图片的高度必然 > 宽度
      if (imageH > maxHeight) {
        tempHeight = maxHeight;
        // 按原图片的比例进行缩放
        tempWidth = (imageW * maxHeight) / imageH;
      } else {
        // 按原图片的大小进行缩放
        tempWidth = imageW;
        tempHeight = imageH;
      }
    }
    return {
      width: tempWidth,
      height: tempHeight
    };
  }
};

// 逆序数
export const inversionNum = (num: number | string | Array<number>) => {
  let arr;
  if (typeof num === "number") {
    let strs = String(num);
    arr = Array.from(strs, (str) => Number(str) || 0); // 安全处理，转换错误给0
  } else arr = num;
  let length = arr.length;
  let reverse = 0;
  for (let i = 0; i < length - 1; i++) {
    let n = arr[i];
    for (let j = i + 1; j < length; j++) {
      let m = arr[j];
      if (n > m) reverse += 1;
    }
  }
  return reverse;
};

export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// 洗牌
export const shuffle = (arr: Array<number>): any => {
  const newArr = arr.slice();
  for (let i = 0; i < newArr.length; i++) {
    let r = randomInt(0, i);
    let t = newArr[i];
    newArr[i] = newArr[r];
    newArr[r] = t;
  }
  if (JSON.stringify(arr) === JSON.stringify(newArr)) {
    return shuffle(arr);
  } else {
    return newArr;
  }
};

// 数组单调性

export const getArrMonotonicity = (arr: Array<number>) => {
  // if (x)
};
