import { formatFloat } from './numbers';

/**
 *
 * @param {*} a
 * @param {*} b
 * @param {*} op
 * @param {*} time
 * @returns the result in the form {time, value} or {time} if a or b are undefined
 */
const operationValue = (a, b, op, time) =>
  a && b ? { time, value: formatFloat(op(a, b)) } : { time };

/**
 *
 * @param {*} l
 * @param {*} r
 * @param {*} opp - operation function between 2 numbers of form (a, b) => result
 * @returns
 */
const operation = (l, r, op) =>
  l.type === 'number'
    ? r.type === 'number'
      ? { type: 'number', value: formatFloat(op(l.value, r.value)) }
      : {
          type: 'array',
          values: r.values.map(({ time, value }) =>
            operationValue(value, l.value, op, time)
          ),
        }
    : r.type === 'number'
    ? {
        type: 'array',
        values: l.values.map(({ time, value }) =>
          operationValue(value, r.value, op, time)
        ),
      }
    : {
        type: 'array',
        values: l.values.map(({ time, value }, i) =>
          operationValue(value, r.values[i].value, op, time)
        ),
      };

/**
 * @param {*} graph - the formula to be solved in the form of a graph
 * @param {*} specialCase - special case used for a specific type (in our case that would be the tag)
 * @returns the solution to the formula in form of array
 */
export function solve(graph, specialCase) {
  function solveLoop(g) {
    switch (g.type) {
      case specialCase.type:
        return specialCase.func(g);
      case '+':
        return operation(
          solveLoop(g.left),
          solveLoop(g.right),
          (a, b) => a + b
        );
      case '-':
        return operation(
          solveLoop(g.left),
          solveLoop(g.right),
          (a, b) => a - b
        );
      case '*':
        return operation(
          solveLoop(g.left),
          solveLoop(g.right),
          (a, b) => a * b
        );
      case '/':
        return operation(
          solveLoop(g.left),
          solveLoop(g.right),
          (a, b) => a / b
        );
      default:
        return g;
    }
  }

  return solveLoop(graph);
}
