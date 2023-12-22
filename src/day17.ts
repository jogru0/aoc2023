const up = 0;
const down = 1;
const left = 2;
const right = 3;

function opposite(dir): number {
  switch (dir) {
    case up:
      return down;
    case down:
      return up;
    case left:
      return right;
    case right:
      return left;
  }
}

function move(l, c, dir): [number, number] {
  switch (dir) {
    case up:
      --l;
      break;
    case down:
      ++l;
      break;
    case left:
      --c;
      break;
    case right:
      ++c;
      break;
  }
  return [l, c];
}

class Grid {
  heat: number[][];
  lines: number;
  chars: number;
  min_steps: number;
  max_steps: number;

  to_id(l: number, c: number, dir: number, steps: number) {
    return steps - 1 + this.max_steps * (dir + 4 * (c + this.chars * l));
  }

  from_id(id: number): [number, number, number, number] {
    const steps = (id % this.max_steps) + 1;
    id -= steps - 1;
    id /= this.max_steps;
    const dir = id % 4;
    id -= dir;
    id /= 4;
    const c = id % this.chars;
    id -= c;
    id /= this.chars;
    const l = id;
    return [l, c, dir, steps];
  }

  constructor(lines: string[], min: number, max: number) {
    this.heat = lines.map((line) => [...line].map((char) => Number(char)));
    this.lines = this.heat.length;
    this.chars = this.heat[0].length;
    this.min_steps = min;
    this.max_steps = max;
  }

  dist_to_goal(): number {
    const done = new Set<number>();

    const queue: [
      number[],
      number[],
      number[],
      number[],
      number[],
      number[],
      number[],
      number[],
      number[]
    ] = [[], [], [], [], [], [], [], [], []];

    queue[this.heat[0][1] % 9].push(this.to_id(0, 1, right, 1));
    queue[this.heat[1][0] % 9].push(this.to_id(1, 0, down, 1));

    for (let current_dist = 1; ; ++current_dist) {
      const q = queue[current_dist % 9];
      queue[current_dist % 9] = [];
      for (let i = 0; i < q.length; ++i) {
        const qi = q[i];
        if (done.has(qi)) {
          continue;
        }
        done.add(qi);

        const [l, c, dir, steps] = this.from_id(qi);
        if (
          l == this.lines - 1 &&
          c == this.chars - 1 &&
          this.min_steps <= steps
        ) {
          return current_dist;
        }

        for (let new_dir = 0; new_dir < 4; ++new_dir) {
          if (new_dir == opposite(dir)) {
            continue;
          }

          if (new_dir != dir && steps < this.min_steps) {
            continue;
          }

          let new_steps = 1;
          if (new_dir == dir) {
            new_steps = steps + 1;
          }

          if (this.max_steps < new_steps) {
            continue;
          }

          const [new_l, new_c] = move(l, c, new_dir);

          if (
            new_l < 0 ||
            this.lines <= new_l ||
            new_c < 0 ||
            this.chars <= new_c
          ) {
            continue;
          }

          const new_dist = current_dist + this.heat[new_l][new_c];
          queue[new_dist % 9].push(
            this.to_id(new_l, new_c, new_dir, new_steps)
          );
        }
      }
    }
  }
}

export function part1(lines: string[]): number {
  const grid = new Grid(lines, 1, 3);
  return grid.dist_to_goal();
}

export function part2(lines: string[]): number {
  const grid = new Grid(lines, 4, 10);
  return grid.dist_to_goal();
}
