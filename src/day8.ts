import * as util from "./util";

function parse_input(
  lines: string[]
): [number[], [number, number][], number, number] {
  const path: number[] = [...lines[0]].map((char) => {
    switch (char) {
      case "L":
        return 0;
      case "R":
        return 1;
    }
  });

  const graph_lines = lines.slice(2);

  const key_to_id: Map<string, number> = new Map();

  graph_lines.forEach((line, i) => {
    key_to_id.set(line.slice(0, 3), i);
  });

  const graph = graph_lines.map((line): [number, number] => [
    key_to_id.get(line.slice(7, 10)),
    key_to_id.get(line.slice(12, 15)),
  ]);

  const start = key_to_id.get("AAA");
  const end = key_to_id.get("ZZZ");

  return [path, graph, start, end];
}

function parse_input_2(
  lines: string[]
): [number[], [number, number][], number[], Set<number>] {
  const path = [...lines[0]].map((char) => {
    switch (char) {
      case "L":
        return 0;
      case "R":
        return 1;
    }
  });

  const graph_lines = lines.slice(2);

  const key_to_id: Map<string, number> = new Map();
  const starts: number[] = [];
  const ends: Set<number> = new Set();

  graph_lines.forEach((line, i) => {
    const name = line.slice(0, 3);
    key_to_id.set(name, i);
    switch (name[2]) {
      case "A":
        starts.push(i);
        break;
      case "Z":
        ends.add(i);
        break;
    }
  });

  const graph = graph_lines.map((line): [number, number] => [
    key_to_id.get(line.slice(7, 10)),
    key_to_id.get(line.slice(12, 15)),
  ]);

  return [path, graph, starts, ends];
}

export function part1(lines: string[]): number {
  const [path, graph, start, end] = parse_input(lines);

  let step = 0;
  let current = start;
  let code_pointer = 0;

  while (current != end) {
    ++step;
    current = graph[current][path[code_pointer]];
    ++code_pointer;
    code_pointer %= path.length;
  }

  return step;
}

function get_periods(
  path: number[],
  graph: [number, number][],
  start: number,
  ends: number[]
): [number, DelayedPeriod[]] {
  let step = 0;
  let current = start;
  let code_pointer = 0;

  const visited = new Map<number, number>();
  const goals: boolean[] = [];

  while (!visited.has(code_pointer * graph.length + current)) {
    visited.set(code_pointer * graph.length + current, step);
    goals.push(ends.includes(current));
    ++step;
    current = graph[current][path[code_pointer]];
    ++code_pointer;
    code_pointer %= path.length;
  }

  const delay: number = visited.get(code_pointer * graph.length + current);
  const period = step - delay;

  const results: DelayedPeriod[] = [];

  for (let d = delay; d < step; ++d) {
    if (goals[d]) {
      results.push(new DelayedPeriod(d, period));
    }
  }

  return [delay, results];
}

class DelayedPeriod {
  d: number;
  p: number;

  constructor(d: number, p: number) {
    this.d = d;
    this.p = p;
  }
}

function combine(dp1: DelayedPeriod, dp2: DelayedPeriod) {
  if (dp1.p < dp2.p) {
    [dp1, dp2] = [dp2, dp1];
  }

  let possible_d = dp1.d;
  if (possible_d < dp2.d) {
    const missing_periods = (dp2.d - possible_d + dp1.p - 1) % dp1.d;
    possible_d += missing_periods * dp1.p;
  }

  while ((possible_d - dp2.d) % dp2.p != 0) {
    possible_d += dp1.p;
  }

  const p = util.lcm(dp1.p, dp2.p);

  return new DelayedPeriod(possible_d, p);
}

function combine_all(periods: DelayedPeriod[][]): DelayedPeriod[] {
  const uncombined = periods.at(-1);

  if (periods.length == 1) {
    return uncombined;
  }

  const combined = combine_all(periods.slice(0, -1));

  const result: DelayedPeriod[] = [];
  uncombined.forEach((p1) =>
    combined.forEach((p2) => result.push(combine(p1, p2)))
  );

  return result;
}

export function part2(lines: string[]): number {
  const [path, graph, starts, ends] = parse_input_2(lines);

  const ends_array = [...ends.values()];

  const periods = starts.map((start) =>
    get_periods(path, graph, start, ends_array)
  );

  const combined = combine_all(periods.map((v_p) => v_p[1]));
  const max_delay = Math.max(...periods.map((v_p) => v_p[0]));

  let currents = starts;
  let code_pointer = 0;
  for (let step = 0; step < max_delay; ++step) {
    if (currents.every((current) => ends_array.includes(current))) {
      return step;
    }

    currents = currents.map((current) => graph[current][path[code_pointer]]);
    ++code_pointer;
    code_pointer %= path.length;
  }

  return Math.max(...combined.map((dp) => dp.d));
}
