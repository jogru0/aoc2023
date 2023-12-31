import * as util from "./util";

function parse(lines: string[]): [string, number][] {
  return lines.map((line) => {
    const entries = line.split(" ");
    return [entries[0], Number(entries[1])];
  });
}

function parse_2(lines: string[]): [number, number][] {
  return lines.map((line) => {
    return [Number(line.at(-2)), parseInt(line.slice(-7, -2), 16)];
  });
}

function neighbor(point: util.Point, direction: string): util.Point {
  const result = new util.Point(point.line, point.char);
  switch (direction) {
    case "L":
      result.char -= 1;
      break;
    case "R":
      result.char += 1;
      break;
    case "U":
      result.line -= 1;
      break;
    case "D":
      result.line += 1;
      break;
  }

  return result;
}

export function part1(lines: string[]): number {
  const instructions = parse(lines);

  const grid = new util.SerializeSet<util.Point>();

  const up_grid = new util.SerializeSet<util.Point>();

  let current = new util.Point(0, 0);

  grid.add(current);
  instructions.forEach((instruction) => {
    if (instruction[0] == "U") {
      up_grid.add(current);
    }

    for (let i = 0; i < instruction[1]; ++i) {
      current = neighbor(current, instruction[0]);
      grid.add(current);
      if (instruction[0] == "U") {
        up_grid.add(current);
      }
    }
  });

  up_grid.forEach((point) => {
    for (;;) {
      point = neighbor(point, "R");
      if (grid.has(point)) {
        break;
      } else {
        grid.add(point);
      }
    }
  });

  return grid.size();
}

export function part2(lines: string[]): number {
  const instructions = parse_2(lines);

  const current = new util.Point(0, 0);

  let sum = 0;

  instructions.forEach(([dir, steps], i, inst) => {
    switch (dir) {
      case 0: {
        current.char += steps;
        break;
      }
      case 1: {
        current.line += steps;
        let mul = steps - 1;
        if (inst.at(i - 1)[0] == 0) {
          mul += 1;
        }
        if (inst.at((i + 1) % inst.length)[0] == 2) {
          mul += 1;
        }

        sum += (current.char + 1) * mul;
        break;
      }
      case 2: {
        current.char -= steps;
        break;
      }
      case 3: {
        current.line -= steps;
        let mul = steps - 1;
        if (inst.at(i - 1)[0] == 2) {
          mul += 1;
        }
        if (inst.at((i + 1) % inst.length)[0] == 0) {
          mul += 1;
        }
        sum -= current.char * mul;
      }
    }
  });

  return sum;
}
