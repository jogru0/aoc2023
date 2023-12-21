import * as util from "./util";

function diff_sequence(sequence: number[]): number[] {
  const result: number[] = [];
  for (let i = 1; i < sequence.length; ++i) {
    result.push(sequence[i] - sequence[i - 1]);
  }
  return result;
}

function next_in(sequence: number[]): number {
  if (sequence.every((x) => x == 0)) {
    return 0;
  }

  return sequence.at(-1) + next_in(diff_sequence(sequence));
}

function prev_in(sequence: number[]): number {
  if (sequence.every((x) => x == 0)) {
    return 0;
  }

  return sequence.at(0) - prev_in(diff_sequence(sequence));
}

export function part1(lines: string[]): number {
  const sequences = lines.map(util.parse_number_sequence);
  return sequences.reduce((sum, sequence) => sum + next_in(sequence), 0);
}

export function part2(lines: string[]): number {
  const sequences = lines.map(util.parse_number_sequence);
  return sequences.reduce((sum, sequence) => sum + prev_in(sequence), 0);
}
