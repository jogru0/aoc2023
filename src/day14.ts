import * as util from "./util";

enum Rock {
  None,
  Move,
  Stay,
}

class Grid {
  rocks: Rock[][];
  rows: number;
  columns: number;

  end_x(use_columns: boolean) {
    if (use_columns) {
      return this.columns;
    } else {
      return this.rows;
    }
  }

  end_y(use_columns: boolean) {
    if (use_columns) {
      return this.rows;
    } else {
      return this.columns;
    }
  }

  private coord_trafo(x, y, use_columns, invert): [number, number] {
    if (invert) {
      if (use_columns) {
        return [this.rows - y - 1, x];
      } else {
        return [x, this.columns - y - 1];
      }
    } else {
      if (use_columns) {
        return [y, x];
      } else {
        return [x, y];
      }
    }
  }

  get(x: number, y: number, use_columns: boolean, invert: boolean) {
    const [xx, yy] = this.coord_trafo(x, y, use_columns, invert);
    return this.rocks[xx][yy];
  }

  set(x: number, y: number, use_columns: boolean, invert: boolean, rock: Rock) {
    const [xx, yy] = this.coord_trafo(x, y, use_columns, invert);
    this.rocks[xx][yy] = rock;
  }

  constructor(lines: string[]) {
    this.rocks = lines.map((line) =>
      [...line].map((c) => {
        switch (c) {
          case ".":
            return Rock.None;
          case "#":
            return Rock.Stay;
          case "O":
            return Rock.Move;
        }
      })
    );
    this.rows = this.rocks.length;
    this.columns = this.rocks[0].length;
  }

  apply_gravity(use_columns: boolean, invert: boolean) {
    const end_x = this.end_x(use_columns);
    const end_y = this.end_y(use_columns);

    for (let x = 0; x < end_x; ++x) {
      let free_y: number[] = [];
      for (let y = 0; y < end_y; ++y) {
        switch (this.get(x, y, use_columns, invert)) {
          case Rock.Stay: {
            free_y = [];
            continue;
          }
          case Rock.None: {
            free_y.push(y);
            continue;
          }
          case Rock.Move: {
            if (free_y.length == 0) {
              continue;
            }

            const new_y = free_y.shift();
            free_y.push(y);
            this.set(x, new_y, use_columns, invert, Rock.Move);
            this.set(x, y, use_columns, invert, Rock.None);
          }
        }
      }
    }
  }

  apply_cylce() {
    this.apply_gravity(true, false);
    this.apply_gravity(false, false);
    this.apply_gravity(true, true);
    this.apply_gravity(false, true);
  }

  weight() {
    let sum = 0;
    for (let row = 0; row < this.rows; ++row) {
      const mul = this.rows - row;
      for (let column = 0; column < this.columns; ++column) {
        if (this.rocks[row][column] == Rock.Move) {
          sum += mul;
        }
      }
    }
    return sum;
  }
}

export function part1(lines: string[]): number {
  const grid = new Grid(lines);
  grid.apply_gravity(true, false);
  return grid.weight();
}

export function part2(lines: string[]): number {
  const grid = new Grid(lines);
  for (let i = 0; i < 118; ++i) {
    grid.apply_cylce();
  }

  return grid.weight();
}
