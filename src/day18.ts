import * as util from "./util";

function parse(lines: string[]): [string, number][] {
  return lines.map((line) => {
    const entries = line.split(" ");
    return [entries[0], Number(entries[1])];
  });
}

class Point {
  line: number;
  char: number;

  constructor(line: number, char: number) {
    this.line = line;
    this.char = char;
  }

  neighbor(direction: string): Point {
    const result = new Point(this.line, this.char);
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

  serialize() {
    return `${this.line}@${this.char}`;
  }
}

export function part1(lines: string[]): number {
  let instructions = parse(lines);
  console.log(instructions);

  const grid = new util.SerializeSet<Point>();

  const up_grid = new util.SerializeSet<Point>();

  let current = new Point(0, 0);

  grid.add(current);
  instructions.forEach((instruction) => {
    if (instruction[0] == "U") {
      up_grid.add(current);
    }

    for (let i = 0; i < instruction[1]; ++i) {
      current = current.neighbor(instruction[0]);
      grid.add(current);
      if (instruction[0] == "U") {
        up_grid.add(current);
      }
    }
  });

  up_grid.forEach((point) => {
    while (true) {
      point = point.neighbor("R");
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
  return lines.length;
}
