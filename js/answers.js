import { permuteString } from "./combinations.js";

$.ajax({
  dataType: "json",
  url: "assets/data/word_frequencies.json",
  success: parseFrequencies,
});

let counts;
function parseFrequencies(data) {
  counts = data;
}

export async function solveLetters(letters) {
  const filteredWords = permuteString(letters.toLowerCase()).filter(
    (word) => word in counts
  );
  const filteredCounts = filteredWords.map((word) => [word, counts[word]]);
  filteredCounts.sort((a, b) => a[1] - b[1]);
  const stringLengths = {};

  filteredCounts
    .map((pair) => pair[0])
    .forEach(function (value, _) {
      // words less than five are generally ignored on the show
      if (!stringLengths[value.length]) {
        stringLengths[value.length] = [];
      }
      stringLengths[value.length].push(value);
    });

  return stringLengths;
}

const operationComplexity = {
  "+": 2,
  "-": 3,
  "*": 4,
  "/": 5,
};

export async function solveNumbers(numbers, target) {
  const space = {};
  const operators = ["+", "-", "/", "*"];
  let targetFound = false;

  const answers = [];
  let closestAnswer = 0;
  let closestExpression = "";
  let distance = Infinity;

  numbers.forEach(function (value, i) {
    const subList = numbers
      .slice(0, i)
      .concat(numbers.slice(i + 1, numbers.length));
    search(value, "", subList, 0, 0);
  });

  if (!targetFound) {
    answers.push({
      answer: closestAnswer,
      expression: closestExpression,
      distance: 0,
    });
  }

  answers.sort(function (a, b) {
    return a.complexity - b.complexity;
  });
  return [answers, targetFound];

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

  function search(result, expression, remaining, complexity, depth) {
    space[result] = expression;

    if (Math.abs(result - target) < distance) {
      closestAnswer = result;
      closestExpression = expression;
      distance = Math.abs(result - target);
    }

    if (result - target === 0) {
      targetFound = true;
      answers.push({
        answer: result,
        expression: expression,
        complexity: complexity,
      });
    }

    if (remaining) {
      remaining.forEach(function (value, i) {
        const subList = remaining
          .slice(0, i)
          .concat(remaining.slice(i + 1, remaining.length));

        operators.forEach(function (op, _) {
          let newResult;
          switch (op) {
            case "+":
              newResult = result + value;
              break;
            case "-":
              newResult = result - value;
              break;
            case "*":
              newResult = result * value;
              break;
            case "/":
              newResult = result / value;
              break;
          }

          const newExpression = expressionToString(
            result,
            value,
            op,
            newResult
          );
          search(
            newResult,
            expression + newExpression,
            subList,
            operationComplexity[op] * depth,
            depth + 1
          );
        });
      });
    }
  }
}
