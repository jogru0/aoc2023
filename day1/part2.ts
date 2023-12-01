import * as util from "../util.js";

const lines = util.read_lines("day1/in.txt");
const result = lines.reduce(
  (partial_sum, line) => partial_sum + line_to_code(line),
  0
);
console.log(result);

function line_to_code(line: string) {
  const matches = util.match_with_overlap(
    line,
    /([1-9]|one|two|three|four|five|six|seven|eight|nine)/g
  );

  return 10 * parse_number(matches.at(0)) + parse_number(matches.at(-1));
}

function parse_number(number: string) {
  switch (number) {
    case "1":
    case "one":
      return 1;
    case "2":
    case "two":
      return 2;
    case "3":
    case "three":
      return 3;
    case "4":
    case "four":
      return 4;
    case "5":
    case "five":
      return 5;
    case "6":
    case "six":
      return 6;
    case "7":
    case "seven":
      return 7;
    case "8":
    case "eight":
      return 8;
    case "9":
    case "nine":
      return 9;
  }
}
