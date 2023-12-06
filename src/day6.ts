import * as util from "./util";

function parse_times_distances(lines: string[]): number[][] {
  return lines.map((line) =>
    util.parse_number_sequence(util.behind(line, ":"))
  );
}

function parse_time_distance(lines: string[]): number[] {
  return lines.map((line) => Number(util.behind(line, ":").replace(/ /g, "")));
}

function extend(time: number, distance: number): number {
  const shift = time / 2;
  const root = Math.sqrt(time ** 2 / 4 - distance);
  const t_min = Math.ceil(shift - root);
  const t_max = Math.floor(shift + root);
  return t_max - t_min + 1;
}

export function part1(lines: string[]): number {
  const [times, distances] = parse_times_distances(lines);
  return times.reduce((prod, time, i) => prod * extend(time, distances[i]), 1);
}

export function part2(lines: string[]): number {
  const [time, distance] = parse_time_distance(lines);
  return extend(time, distance);
}
