const players = [
  {
    name: "luffy",
    scale: 1.1,
    moves: [4, 8, 7, 5, 7, 4, 4, 3],
    offset: [
      { x: 0, y: -20 },
      { x: 0, y: -30 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
    ],
    attack: { scale: 1.1, framesMax: 1 },
  },
  {
    name: "zoro",
    scale: 1,
    moves: [4, 8, 8, 4, 6, 4, 7, 3],
    attack: { scale: 2.4, framesMax: 4 },
    offset: [
      { x: 0, y: -40 },
      { x: 0, y: -40 },
      { x: 0, y: -30 },
      { x: 0, y: -60 },
      { x: 0, y: -40 },
      { x: 0, y: -30 },
      { x: 0, y: -20 },
      { x: 0, y: -40 },
    ],
  },
  {
    name: "sanji",
    scale: 1,
    moves: [4, 8, 8, 4, 9, 4, 7, 3],
    attack: { scale: 1, framesMax: 1 },
    offset: [
      { x: 0, y: -40 },
      { x: 0, y: -40 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -50 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -30 },
    ],
  },
  {
    name: "goku",
    scale: 1.1,
    moves: [4, 2, 8, 4, 6, 4, 7, 3],
    attack: { scale: 1.2, framesMax: 1 },
    offset: [
      { x: 0, y: -15 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -50 },
      { x: 0, y: -30 },
      { x: 0, y: 0 },
      { x: 0, y: -20 },
    ],
  },
  {
    name: "vegeta",
    scale: 1.1,
    moves: [4, 1, 7, 6, 10, 4, 8, 3],
    attack: { scale: 1.2, framesMax: 1 },
    offset: [
      { x: 0, y: -15 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -80 },
      { x: 0, y: -10 },
      { x: 0, y: -10 },
      { x: 0, y: -20 },
    ],
  },
  {
    name: "naruto",
    scale: 1.8,
    moves: [4, 6, 4, 5, 5, 3, 6, 2],
    attack: { scale: 1.2, framesMax: 4 },
    offset: [
      { x: 0, y: 0 },
      { x: 0, y: -10 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -0 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -20 },
    ],
  },
  {
    name: "ichigo",
    scale: 1,
    moves: [4, 8, 5, 6, 10, 4, 7, 1],
    attack: { scale: 1, framesMax: 1 },
    offset: [
      { x: 0, y: -65 },
      { x: 0, y: -60 },
      { x: 0, y: 10 },
      { x: 0, y: -50 },
      { x: 0, y: -20 },
      { x: 0, y: -60 },
      { x: 0, y: -50 },
      { x: 0, y: -30 },
    ],
  },
  {
    name: "sage",
    scale: 1.8,
    moves: [6, 6, 5, 7, 6, 2, 6, 1],
    attack: { scale: 1.2, framesMax: 4 },
    offset: [
      { x: 0, y: 0 },
      { x: 0, y: -10 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -20 },
    ],
  },
];
