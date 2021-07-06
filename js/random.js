import * as util from "./util.js";

export const vowelDistribution = {
  A: 15,
  E: 21,
  I: 13,
  O: 13,
  U: 5,
};

export const consonantDistribution = {
  B: 2,
  C: 3,
  D: 6,
  F: 2,
  G: 3,
  H: 2,
  J: 1,
  K: 1,
  L: 5,
  M: 4,
  N: 8,
  P: 4,
  Q: 1,
  R: 9,
  S: 9,
  T: 9,
  V: 1,
  W: 1,
  X: 1,
  Y: 1,
  Z: 1,
};

function distributeArray(distribution) {
  let array = [];
  for (const [key, value] of Object.entries(distribution)) {
    array = array.concat(Array(value).fill(key));
  }
  return array;
}

// Takes a distribution which keeps track of which letters have already been chosen
// Resets when game resets
export async function randomLetter(distribution) {
  const array = distributeArray(distribution);
  return array[util.getRandomInt(array.length)];
}

export async function randomNumber(numberType) {
  if (numberType === "large") {
    return [25, 50, 75, 100][util.getRandomInt(4)];
  }
  if (numberType === "small") {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9][util.getRandomInt(9)];
  }
}
