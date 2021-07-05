import { permuteString } from "./combinations.js";

$.ajax({
  type: "GET",
  url: "assets/data/words_alpha.txt",
  contentType: "text/plain",
  success: parseWords,
});

let words;
function parseWords(data) {
  console.log(typeof data);
  words = new Set(data.split("\r\n"));
}

export async function solveLetters(letters) {
  const results = permuteString(letters.toLowerCase()).filter((word) =>
    words.has(word)
  );
  const stringLengths = {};

  results.forEach(function (value, _) {
    if (!stringLengths[value.length]) {
      stringLengths[value.length] = [];
    }
    stringLengths[value.length].push(value);
  });

  return stringLengths;
}

export async function solveNumbers(numbers, target) {
  const space = {};
  const operators = ["+", "-", "/", "*"];

  let closestAnswer = 0;
  let closestExpression = "";
  let distance = Infinity;

  numbers.forEach(function (value, i) {
    const subList = numbers
      .slice(0, i)
      .concat(numbers.slice(i + 1, numbers.length));
    search(value, "", subList);
  });

  return [closestAnswer, closestExpression];

  function expressionToString(r, v, op, res) {
    return (
      r.toString() +
      " " +
      op +
      " " +
      v.toString() +
      " = " +
      res.toString() +
      "\n"
    );
  }

  function search(result, expression, remaining) {
    space[result] = expression;
    if (Math.abs(result - target) < distance) {
      closestAnswer = result;
      closestExpression = expression;
      distance = Math.abs(result - target);
    }

    if (remaining) {
      remaining.forEach(function (value, i) {
        const subList = remaining
          .slice(0, i)
          .concat(remaining.slice(i + 1, remaining.length));
        operators.forEach(function (op, _) {
          if (op === "+") {
            search(
              result + value,
              expression +
                expressionToString(result, value, "+", result + value),
              subList
            );
          }
          if (op === "-") {
            search(
              result - value,
              expression +
                expressionToString(result, value, "-", result - value),
              subList
            );
          }
          if (op === "*") {
            search(
              result * value,
              expression +
                expressionToString(result, value, "*", result * value),
              subList
            );
          }
          if (op === "/") {
            search(
              result / value,
              expression +
                expressionToString(result, value, "/", result / value),
              subList
            );
          }
        });
      });
    }
  }
}
