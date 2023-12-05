import * as util from "./util";

class GridNumber {
  line: number;
  start_char: number;
  end_char: number;
  value: number;

  constructor(line: number, end_char: number, digits: number[]) {
    this.line = line;
    this.start_char = end_char - digits.length + 1;
    this.end_char = end_char;
    this.value = util.combine_digits(digits);
  }

  neighbors(): Point[] {
    const result = [];

    for (let c = this.start_char - 1; c < this.end_char + 2; ++c) {
      result.push(new Point(this.line - 1, c));
      result.push(new Point(this.line + 1, c));
    }
    result.push(new Point(this.line, this.start_char - 1));
    result.push(new Point(this.line, this.end_char + 1));

    return result;
  }
}

class Point {
  line: number;
  char: number;

  constructor(line: number, char: number) {
    this.line = line;
    this.char = char;
  }

  serialize() {
    return `${this.line}@${this.char}`;
  }
}

type SymbolGrid = util.SerializeMap<Point, string>;

function parse_grid(lines: string[]): [GridNumber[], SymbolGrid] {
  const numbers: GridNumber[] = [];
  const symbols = new util.SerializeMap<Point, string>();

  lines.map((line, line_id) => {
    line = line.concat(".");
    let digits: number[] = [];
    for (let char_id = 0; char_id < line.length; ++char_id) {
      const char = line[char_id];
      const digit = Number(char);
      if (isNaN(digit)) {
        if (digits.length != 0) {
          numbers.push(new GridNumber(line_id, char_id - 1, digits));
          digits = [];
        }

        if (char != ".") {
          symbols.set(new Point(line_id, char_id), char);
        }
      } else {
        digits.push(digit);
      }
    }
  });

  return [numbers, symbols];
}

export function part1(lines: string[]): number {
  const [numbers, symbols] = parse_grid(lines);

  return numbers.reduce((sum, grid_number) => {
    if (grid_number.neighbors().some((neighbor) => symbols.has(neighbor))) {
      return sum + grid_number.value;
    } else {
      return sum;
    }
  }, 0);
}

type GearGrid = util.SerializeMap<Point, number[]>;

function calculate_gear_grid(
  numbers: GridNumber[],
  symbols: SymbolGrid
): GearGrid {
  const gear_grid = new util.SerializeMap<Point, number[]>();

  numbers.map((grid_number) => {
    grid_number.neighbors().map((neighbor) => {
      if (symbols.get(neighbor) == "*") {
        if (gear_grid.has(neighbor)) {
          gear_grid.get(neighbor).push(grid_number.value);
        } else {
          gear_grid.set(neighbor, [grid_number.value]);
        }
      }
    });
  });

  return gear_grid;
}

export function part2(lines: string[]): number {
  const [numbers, symbols] = parse_grid(lines);

  const gear_grid = calculate_gear_grid(numbers, symbols);

  let result = 0;
  gear_grid.forEach((n: number[]) => {
    if (n.length == 2) {
      result += n[0] * n[1];
    }
  });
  return result;
}
