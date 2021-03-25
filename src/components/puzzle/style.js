export const bindClass = (type) => {
  if (type === "square_empty") {
    return {
      "square-empty-wrap": true
    };
  }
  if (type === "square_ice") {
    return {
      "square-ice-wrap": true
    };
  }
};

export const setGameBoxHeight = (w, h) => {
  return {
    width: `${w * 104}px`,
    height: `${h * 104}px`
  };
};

export const setItemStyle = (direction, { x, y }) => {
  let obj = {};
  if (direction) {
    direction.forEach((dir) => {
      obj[`border-${dir}-radius`] = "8px";
    });
  }
  obj.left = `${(x - 1) * 104}px`;
  obj.top = `${y * 104}px`;
  return obj;
};
