import * as util from "./util";

function connect_up(char: string): boolean {
  switch (char) {
    case "|":
      return true;
    case "-":
      return false;
    case "L":
      return true;
    case "J":
      return true;
    case "7":
      return false;
    case "F":
      return false;
    case ".":
      return false;
    case "S":
      return true;
  }
}

function connect_down(char: string): boolean {
  switch (char) {
    case "|":
      return true;
    case "-":
      return false;
    case "L":
      return false;
    case "J":
      return false;
    case "7":
      return true;
    case "F":
      return true;
    case ".":
      return false;
    case "S":
      return true;
  }
}

function connect_left(char: string): boolean {
  switch (char) {
    case "|":
      return false;
    case "-":
      return true;
    case "L":
      return false;
    case "J":
      return true;
    case "7":
      return true;
    case "F":
      return false;
    case ".":
      return false;
    case "S":
      return true;
  }
}

function connect_right(char: string): boolean {
  switch (char) {
    case "|":
      return false;
    case "-":
      return true;
    case "L":
      return true;
    case "J":
      return false;
    case "7":
      return false;
    case "F":
      return true;
    case ".":
      return false;
    case "S":
      return true;
  }
}

enum direction {
  up,
  down,
  left,
  right,
}

export function part1(lines: string[]): number {
  const grid = lines.map((line) => [...line]);
  const start_line = grid.findIndex((chars) => chars.includes("S"));
  const start_char = grid[start_line].indexOf("S");

  const n_lines = grid.length;
  const n_chars = grid[0].length;

  const start = new util.Point(start_line, start_char);

  const current = new util.Point(start_line, start_char);
  let last_direction: direction;
  let steps = 0;
  do {
    if (
      last_direction != direction.down &&
      current.line != 0 &&
      connect_up(grid[current.line][current.char]) &&
      connect_down(grid[current.line - 1][current.char])
    ) {
      last_direction = direction.up;
      current.line -= 1;
    } else if (
      last_direction != direction.up &&
      current.line != n_lines &&
      connect_down(grid[current.line][current.char]) &&
      connect_up(grid[current.line + 1][current.char])
    ) {
      last_direction = direction.down;
      current.line += 1;
    } else if (
      last_direction != direction.left &&
      current.char != n_chars &&
      connect_right(grid[current.line][current.char]) &&
      connect_left(grid[current.line][current.char + 1])
    ) {
      last_direction = direction.right;
      current.char += 1;
    } else if (
      last_direction != direction.right &&
      current.char != 0 &&
      connect_left(grid[current.line][current.char]) &&
      connect_right(grid[current.line][current.char - 1])
    ) {
      last_direction = direction.left;
      current.char -= 1;
    }
    steps += 1;
  } while (!(current.line == start.line && current.char == start.char));

  return steps / 2;
}

export function part2(lines: string[]): number {
  const up_grid = new util.SerializeSet<util.Point>();

  const grid = lines.map((line) => [...line]);
  const start_line = grid.findIndex((chars) => chars.includes("S"));
  const start_char = grid[start_line].indexOf("S");

  const n_lines = grid.length;
  const n_chars = grid[0].length;

  const start = new util.Point(start_line, start_char);

  const current = new util.Point(start_line, start_char);
  let last_direction: direction;
  let steps = 0;

  const filled_grid = new util.SerializeSet<util.Point>();
  filled_grid.add(start);

  do {
    if (
      last_direction != direction.down &&
      current.line != 0 &&
      connect_up(grid[current.line][current.char]) &&
      connect_down(grid[current.line - 1][current.char])
    ) {
      last_direction = direction.up;
      up_grid.add(new util.Point(current.line, current.char));
      current.line -= 1;
      up_grid.add(new util.Point(current.line, current.char));
    } else if (
      last_direction != direction.up &&
      current.line != n_lines &&
      connect_down(grid[current.line][current.char]) &&
      connect_up(grid[current.line + 1][current.char])
    ) {
      last_direction = direction.down;
      current.line += 1;
    } else if (
      last_direction != direction.left &&
      current.char != n_chars &&
      connect_right(grid[current.line][current.char]) &&
      connect_left(grid[current.line][current.char + 1])
    ) {
      last_direction = direction.right;
      current.char += 1;
    } else if (
      last_direction != direction.right &&
      current.char != 0 &&
      connect_left(grid[current.line][current.char]) &&
      connect_right(grid[current.line][current.char - 1])
    ) {
      last_direction = direction.left;
      current.char -= 1;
    }
    steps += 1;
    filled_grid.add(current);
  } while (!(current.line == start.line && current.char == start.char));

  up_grid.forEach((point) => {
    for (;;) {
      point.char += 1;
      if (filled_grid.has(point)) {
        break;
      } else {
        filled_grid.add(point);
      }
    }
  });

  return filled_grid.size() - steps;
}
