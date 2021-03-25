const config = {
  list: [
    {
      type: "square_ice",
      position: { x: 2, y: 0 },
      radius: true,
      direction: ["top-left"]
    },
    {
      type: "square_ice",
      position: { x: 3, y: 0 },
      radius: true,
      direction: ["top-right"]
    },
    {
      type: "square_ice",
      position: { x: 1, y: 1 },
      radius: true,
      direction: ["top-left"]
    },
    { type: "square_empty", position: { x: 2, y: 1 } },
    { type: "square_empty", position: { x: 3, y: 1 } },
    { type: "square_ice", position: { x: 1, y: 2 } },
    { type: "square_empty", position: { x: 2, y: 2 } },
    { type: "square_empty", position: { x: 3, y: 2 } },
    {
      type: "square_empty",
      position: { x: 4, y: 2 },
      radius: true,
      direction: ["top-right", "bottom-right"]
    },
    {
      type: "square_ice",
      position: { x: 1, y: 3 },
      radius: true,
      direction: ["bottom-left"]
    },
    { type: "square_empty", position: { x: 2, y: 3 } },
    { type: "square_empty", position: { x: 3, y: 3 } },
    {
      type: "square_ice",
      position: { x: 2, y: 4 },
      radius: true,
      direction: ["bottom-left"]
    },
    {
      type: "square_ice",
      position: { x: 3, y: 4 },
      radius: true,
      direction: ["bottom-right"]
    }
  ],
  rowCol: {
    row: 5,
    col: 4
  }
};

export default config;
