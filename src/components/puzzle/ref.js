export default function getRef() {
  let itemStartRefs = new Map();
  let itemEndRefs = [];
  let resetRefs = [];
  const setItemRefStart = (type) => {
    return function (el) {
      itemStartRefs.set(type, el);
    };
  };
  const setItemRefEnd = (el) => {
    itemEndRefs.push(el);
  };
  const setResetRef = (el) => {
    itemEndRefs.push(el);
  };

  return {
    setItemRefStart,
    itemStartRefs,
    setItemRefEnd,
    itemEndRefs,
    resetRefs,
    setResetRef
  };
}
