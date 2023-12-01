import * as util from "../util.js";

const lines = util.read_lines("day1/in.txt");
const result = lines.reduce(
  (partial_sum, line) => partial_sum + line_to_code(line),
  0
);
console.log(result);

function line_to_code(line: string) {
  const matches = line.match(/[1-9]/g);

  return 10 * Number(matches.at(0)) + Number(matches.at(-1));
}
