import * as util from "./util";

function parse(lines: string[], expansion: number): util.Point[] {
  let line_offset = 0;
  const line_map = lines.map((line, l) => {
    if (line.indexOf("#") == -1) {
      line_offset += expansion;
    }
    return l + line_offset;
  });

  let char_offset = 0;
  const char_map: number[] = [];
  for (let c = 0; c < lines[0].length; ++c) {
    if (lines.map((line) => line[c]).indexOf("#") == -1) {
      char_offset += expansion;
    }
    char_map.push(c + char_offset);
  }

  const result: util.Point[] = [];
  lines.forEach((line, l) => {
    [...line].forEach((char, c) => {
      if (char == "#") {
        result.push(new util.Point(line_map[l], char_map[c]));
      }
    });
  });
  return result;
}

function distance(p: util.Point, q: util.Point): number {
  return Math.abs(p.line - q.line) + Math.abs(p.char - q.char);
}

export function part1(lines: string[]): number {
  const stars = parse(lines, 1);

  let sum = 0;
  for (let i = 1; i < stars.length; ++i) {
    for (let j = 0; j < i; ++j) {
      sum += distance(stars[i], stars[j]);
    }
  }

  return sum;
}

export function part2(lines: string[]): number {
  const stars = parse(lines, 1_000_000 - 1);

  let sum = 0;
  for (let i = 1; i < stars.length; ++i) {
    for (let j = 0; j < i; ++j) {
      sum += distance(stars[i], stars[j]);
    }
  }

  return sum;
}
