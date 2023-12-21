import * as util from "./util";

type Grid = util.SerializeSet<util.Point>;

function parse(lines: string[]): [Grid, util.Point] {
  const grid = new util.SerializeSet<util.Point>();
  let start: util.Point;
  lines.forEach((line, l_id) => {
    [...line].forEach((char, c_id) => {
      const point = new util.Point(l_id, c_id);
      if (char == "S") {
        start = point;
      }
      if (char != "#") {
        grid.add(point);
      }
    });
  });

  return [grid, start];
}

export function part1(lines: string[]): number {
  const [grid, start] = parse(lines);
  const distances = calculate_distances(grid, start);
  return reachable_in(distances, 64);
}

type Distances = util.SerializeMap<util.Point, number>;

function reachable_in(distances: Distances, steps: number): number {
  let sum = 0;
  distances.forEach((dist) => {
    if (dist <= steps && dist % 2 == steps % 2) {
      sum += 1;
    }
  });

  return sum;
}

function calculate_distances(grid: Grid, start: util.Point): Distances {
  const distances = new util.SerializeMap<util.Point, number>();

  let queue = [start];
  for (let distance = 0; queue.length != 0; ++distance) {
    const next_queue: util.Point[] = [];
    queue.forEach((p) => {
      if (!distances.has(p)) {
        distances.set(p, distance);
        p.neighbors().forEach((n) => {
          if (grid.has(n)) {
            next_queue.push(n);
          }
        });
      }
    });
    queue = next_queue;
  }

  return distances;
}

export function part2(lines: string[]): number {
  const [grid] = parse(lines);

  const distances = [
    new util.Point(0, 65),
    new util.Point(0, 130),
    new util.Point(65, 130),
    new util.Point(130, 130),
    new util.Point(130, 65),
    new util.Point(130, 0),
    new util.Point(65, 0),
    new util.Point(0, 0),
  ].map((start) => calculate_distances(grid, start));

  const full_even_layer = reachable_in(distances[0], 26501365 + 1);
  const full_odd_layer = reachable_in(distances[0], 26501365);

  const until_full = 202299;
  const nothing_more = 202302;

  let sum = full_even_layer;
  for (let layer = 1; layer <= until_full; ++layer) {
    const full_grids = 4 * layer;
    if (layer % 2 == 0) {
      sum += full_even_layer * full_grids;
    } else {
      sum += full_odd_layer * full_grids;
    }
  }

  for (let layer = until_full + 1; layer < nothing_more; ++layer) {
    const diagonal_length = layer - 1;
    const entry_edge = 131 * layer - 65;
    const entry_corner = 131 * layer - 65 * 2;

    const remaining_edge = 26501365 - entry_edge;
    const remaining_corner = 26501365 - entry_corner;

    sum += reachable_in(distances[0], remaining_edge);
    sum += reachable_in(distances[1], remaining_corner) * diagonal_length;
    sum += reachable_in(distances[2], remaining_edge);
    sum += reachable_in(distances[3], remaining_corner) * diagonal_length;
    sum += reachable_in(distances[4], remaining_edge);
    sum += reachable_in(distances[5], remaining_corner) * diagonal_length;
    sum += reachable_in(distances[6], remaining_edge);
    sum += reachable_in(distances[7], remaining_corner) * diagonal_length;
  }

  return sum;
}
