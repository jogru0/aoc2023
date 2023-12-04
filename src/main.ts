import * as util from "./util";
import * as fs from "fs";

import * as day1 from "./day1";
import * as day2 from "./day2";
import * as day3 from "./day3";
import * as day4 from "./day4";
import * as day5 from "./day5";
import * as day6 from "./day6";
import * as day7 from "./day7";
import * as day8 from "./day8";
import * as day9 from "./day9";
import * as day10 from "./day10";
import * as day11 from "./day11";
import * as day12 from "./day12";
import * as day13 from "./day13";
import * as day14 from "./day14";
import * as day15 from "./day15";
import * as day16 from "./day16";
import * as day17 from "./day17";
import * as day18 from "./day18";
import * as day19 from "./day19";
import * as day20 from "./day20";
import * as day21 from "./day21";
import * as day22 from "./day22";
import * as day23 from "./day23";
import * as day24 from "./day24";
import * as day25 from "./day25";

function run(day: number, part: number, lines: string[]): number {
  let dyn;
  if (day == 1) {
    dyn = day1;
  } else if (day == 2) {
    dyn = day2;
  } else if (day == 3) {
    dyn = day3;
  } else if (day == 4) {
    dyn = day4;
  } else if (day == 5) {
    dyn = day5;
  } else if (day == 6) {
    dyn = day6;
  } else if (day == 7) {
    dyn = day7;
  } else if (day == 8) {
    dyn = day8;
  } else if (day == 9) {
    dyn = day9;
  } else if (day == 10) {
    dyn = day10;
  } else if (day == 11) {
    dyn = day11;
  } else if (day == 12) {
    dyn = day12;
  } else if (day == 13) {
    dyn = day13;
  } else if (day == 14) {
    dyn = day14;
  } else if (day == 15) {
    dyn = day15;
  } else if (day == 16) {
    dyn = day16;
  } else if (day == 17) {
    dyn = day17;
  } else if (day == 18) {
    dyn = day18;
  } else if (day == 19) {
    dyn = day19;
  } else if (day == 20) {
    dyn = day20;
  } else if (day == 21) {
    dyn = day21;
  } else if (day == 22) {
    dyn = day22;
  } else if (day == 23) {
    dyn = day23;
  } else if (day == 24) {
    dyn = day24;
  } else if (day == 25) {
    dyn = day25;
  } else {
    throw Error;
  }

  if (part == 1) {
    return dyn.part1(lines);
  } else if (part == 2) {
    return dyn.part2(lines);
  } else {
    throw Error;
  }
}

function read_input(day: number): string[] {
  try {
    return util.read_lines(`res/day${day}.txt`);
  } catch (err) {
    return [];
  }
}

const get_expected = (() => {
  const file = fs.readFileSync("res/expected.json", "utf-8");
  const expected: number[][] = JSON.parse(file);
  return (day: number, part: number) => expected[day - 1][part - 1];
})();

if (process.argv.length == 4) {
  const day = Number(process.argv.at(2));
  const part = Number(process.argv.at(3));
  const lines = read_input(day);
  const result = run(day, part, lines);
  console.log(result);
} else {
  let all_right = true;
  for (let day = 1; day < 26; ++day) {
    const lines = read_input(day);
    for (let part = 1; part < 3; ++part) {
      const actual = run(day, part, lines);
      const expected = get_expected(day, part);
      if (actual != expected) {
        all_right = false;
        console.log(`day ${day}, part ${part}:`);
        console.log(`actual:   ${actual}`);
        console.log(`expected: ${expected}`);
        console.log();
      }
    }
  }
  if (all_right) {
    console.log("All right.");
  }
}
