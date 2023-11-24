const players = [
  {
    name: "luffy",
    scale: 1.1,
    moves: [4, 6, 7, 5, 7, 4, 4, 3, 9],
    offset: [
      { x: 0, y: -20 },
      { x: 0, y: -30 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -20 },
      { x: 0, y: -45 },
    ],
    attack: { scale: 1.1, framesMax: 1 },
    spl: { scale: 1.1, framesMax: 1, long: false },
  },
  {
    name: "zoro",
    scale: 1,
    moves: [4, 6, 8, 4, 7, 4, 7, 3, 6],
    attack: { scale: 1, framesMax: 1 },
    spl: { scale: 2.4, framesMax: 4, long: true },
    offset: [
      { x: 0, y: -40 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -60 },
      { x: 0, y: -40 },
      { x: 0, y: -30 },
      { x: 0, y: -20 },
      { x: 0, y: -40 },
      { x: 0, y: -40 },
    ],
  },
  {
    name: "sanji",
    scale: 1,
    moves: [4, 6, 8, 4, 9, 4, 7, 3, 5],
    attack: { scale: 1, framesMax: 1 },
    spl: { scale: 1, framesMax: 3, long: false },
    offset: [
      { x: 0, y: -40 },
      { x: 0, y: -20 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -50 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -30 },
      { x: 0, y: -60 },
    ],
  },
  {
    name: "goku",
    scale: 1.1,
    moves: [4, 2, 8, 4, 6, 4, 7, 3, 10],
    attack: { scale: 1.2, framesMax: 1 },
    spl: { scale: 1.2, framesMax: 3, long: false },

    offset: [
      { x: 0, y: -15 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -50 },
      { x: 0, y: -30 },
      { x: 0, y: 0 },
      { x: 0, y: -20 },
      { x: 0, y: -40 },
    ],
  },
  {
    name: "vegeta",
    scale: 1.1,
    moves: [4, 1, 7, 6, 10, 4, 8, 3, 10],
    attack: { scale: 1.2, framesMax: 1 },
    spl: { scale: 1.2, framesMax: 3, long: false },
    offset: [
      { x: 0, y: -15 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -50 },
      { x: 0, y: -10 },
      { x: 0, y: -10 },
      { x: 0, y: -20 },
      { x: 0, y: -40 },
    ],
  },
  {
    name: "naruto",
    scale: 1.8,
    moves: [4, 6, 4, 5, 5, 3, 6, 2, 14],
    attack: { scale: 1.5, framesMax: 4 },
    spl: { scale: 1.2, framesMax: 3, long: false },
    offset: [
      { x: 0, y: 0 },
      { x: 0, y: -10 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
      { x: 0, y: -0 },
      { x: 0, y: -30 },
      { x: 0, y: -10 },
      { x: 0, y: -20 },
      { x: 0, y: -40 },
    ],
  },
  {
    name: "ichigo",
    scale: 1,
    moves: [4, 6, 5, 6, 10, 4, 7, 1, 10],
    attack: { scale: 1, framesMax: 1 },
    spl: { scale: 1, framesMax: 1, long: true },
    offset: [
      { x: 0, y: -65 },
      { x: 0, y: -40 },
      { x: 0, y: 10 },
      { x: 0, y: -50 },
      { x: 0, y: -20 },
      { x: 0, y: -60 },
      { x: 0, y: -50 },
      { x: 0, y: -30 },
      { x: 0, y: -30 },
    ],
  },
];
