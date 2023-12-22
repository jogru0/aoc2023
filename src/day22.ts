import * as util from "./util";

class Brick {
  x_min: number;
  x_max: number;
  y_min: number;
  y_max: number;
  z_min: number;
  z_max: number;

  coords(): util.Point[] {
    const result: util.Point[] = [];
    for (let x = this.x_min; x <= this.x_max; ++x) {
      for (let y = this.y_min; y <= this.y_max; ++y) {
        result.push(new util.Point(x, y));
      }
    }
    return result;
  }

  constructor(line: string) {
    const [[xl, yl, zl], [xr, yr, zr]] = line
      .split("~")
      .map((coords) => coords.split(",").map((c) => Number(c)));

    this.x_min = Math.min(xl, xr);
    this.x_max = Math.max(xl, xr);

    this.y_min = Math.min(yl, yr);
    this.y_max = Math.max(yl, yr);

    this.z_min = Math.min(zl, zr);
    this.z_max = Math.max(zl, zr);
  }
}

export function part1(lines: string[]): number {
  const bricks = lines.map((line) => new Brick(line));

  const ground = new util.SerializeMap<util.Point, [number, number]>();
  bricks.forEach((brick) => {
    brick.coords().forEach((coord) => {
      ground.set(coord, [0, undefined]);
    });
  });

  bricks.sort((l, r) => l.z_min - r.z_min);

  const can_be_removed = new Set<number>();

  bricks.forEach((brick, id) => {
    can_be_removed.add(id);
    const coords = brick.coords();

    let highest_ground = 0;
    let in_danger: number = undefined;
    coords.forEach((coord) => {
      const [z, i] = ground.get(coord);
      if (highest_ground < z) {
        highest_ground = z;
        in_danger = i;
      } else if (highest_ground == z && in_danger != i) {
        in_danger = undefined;
      }
    });

    if (in_danger !== undefined) {
      can_be_removed.delete(in_danger);
    }

    const new_height = highest_ground + brick.z_max - brick.z_min + 1;
    coords.forEach((coord) => {
      ground.set(coord, [new_height, id]);
    });
  });

  return can_be_removed.size;
}

export function part2(lines: string[]): number {
  const bricks = lines.map((line) => new Brick(line));

  const ground = new util.SerializeMap<util.Point, [number, number]>();
  bricks.forEach((brick) => {
    brick.coords().forEach((coord) => {
      ground.set(coord, [0, -1]);
    });
  });

  bricks.sort((l, r) => l.z_min - r.z_min);

  const stack: [number, number, number[]][] = [];

  bricks.forEach((brick, id) => {
    const coords = brick.coords();

    let highest_ground = 0;
    let rests_on: number[] = [];
    coords.forEach((coord) => {
      const [z, i] = ground.get(coord);
      if (highest_ground < z) {
        highest_ground = z;
        rests_on = [];
      }
      if (highest_ground == z) {
        rests_on.push(i);
      }
    });

    const new_height = highest_ground + brick.z_max - brick.z_min + 1;
    coords.forEach((coord) => {
      ground.set(coord, [new_height, id]);
    });
    stack.push([id, new_height, rests_on]);
  });

  stack.sort((l, r) => l[1] - r[1]);

  let sum = 0;
  for (let disintegrated = 0; disintegrated < bricks.length; ++disintegrated) {
    const no_support = new Set<number>();
    no_support.add(disintegrated);

    stack.forEach(([id, , rests_on]) => {
      if (rests_on.every((i) => no_support.has(i))) {
        no_support.add(id);
      }
    });

    sum += no_support.size - 1;
  }

  return sum;
}
