import * as fs from "fs";

export function read_lines(path: string) {
  const file = fs.readFileSync(path, "utf-8");
  return file.trimEnd().split(/\r?\n/);
}

export function match_with_overlap(line: string, regex: RegExp) {
  const matches: string[] = [];
  let found: RegExpExecArray;
  while ((found = regex.exec(line))) {
    matches.push(found[0]);
    regex.lastIndex = found.index + 1;
  }

  return matches;
}

export function combine_digits(digits: number[]): number {
  return digits.reduce((so_far, digit) => 10 * so_far + digit, 0);
}
