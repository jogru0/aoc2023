import * as util from "./util";

function parse(lines: string[]): string[][] {
  lines.push("");
  let index = 0;
  const result: string[][] = [];
  do {
    const next = lines.indexOf("", index);
    result.push(lines.slice(index, next));
    index = next + 1;
  } while (index != lines.length);

  lines.pop();
  return result;
}

function horizontal(map: string[]): number {
  let score = 0;
  for (let i = 0; i < map.length - 1; ++i) {
    let symmetric = true;
    const to_check = Math.min(i + 1, map.length - i - 1);
    for (let j = 0; j < to_check; ++j) {
      if (map[i - j] != map[i + j + 1]) {
        symmetric = false;
        break;
      }
    }

    if (symmetric) {
      score += i + 1;
    }
  }

  return score;
}

function same_up_to_smudge(l: string, r: string): [boolean, boolean] {
  let smudges = false;
  for (let i = 0; i - l.length; ++i) {
    if (l[i] != r[i]) {
      if (smudges) {
        return [false, undefined];
      } else {
        smudges = true;
      }
    }
  }
  return [true, smudges];
}

function horizontal_smudge(map: string[]): number {
  for (let i = 0; i < map.length - 1; ++i) {
    let used_smudge = false;
    let symmetric = true;
    const to_check = Math.min(i + 1, map.length - i - 1);
    for (let j = 0; j < to_check; ++j) {
      const [same, smudged] = same_up_to_smudge(map[i - j], map[i + j + 1]);

      if (!same || (used_smudge && smudged)) {
        symmetric = false;
        break;
      }

      used_smudge ||= smudged;
    }

    if (symmetric && used_smudge) {
      return i + 1;
    }
  }

  return 0;
}

function get_value(map: string[]): number {
  return 100 * horizontal(map) + horizontal(util.transpose(map));
}

function get_value_2(map: string[]): number {
  return 100 * horizontal_smudge(map) + horizontal_smudge(util.transpose(map));
}

export function part1(lines: string[]): number {
  const maps = parse(lines);
  return maps.reduce((sum, map) => sum + get_value(map), 0);
}

export function part2(lines: string[]): number {
  const maps = parse(lines);
  return maps.reduce((sum, map) => sum + get_value_2(map), 0);
}
