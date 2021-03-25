export const setItemWH = (doms, max) => {
  let step = 21;
  doms.forEach((d) => {
    d.style.height = 83 + (6 - max) * step + "px";
    d.style.width = 83 + (6 - max) * step + "px";
  });
};
