import * as util from "./util";

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export class Segment {
  entered_point: util.Point;
  direction: Direction;

  constructor(entered_point: util.Point, direction: Direction) {
    this.entered_point = entered_point;
    this.direction = direction;
  }

  serialize() {
    return `${this.entered_point.serialize()}>${this.direction}`;
  }
}

function resulting_directions(
  direction: Direction,
  object: string
): Direction[] {
  switch (direction) {
    case Direction.Up:
      switch (object) {
        case ".":
          return [Direction.Up];
        case "/":
          return [Direction.Right];
        case "\\":
          return [Direction.Left];
        case "-":
          return [Direction.Left, Direction.Right];
        case "|":
          return [Direction.Up];
      }
      break;
    case Direction.Down:
      switch (object) {
        case ".":
          return [Direction.Down];
        case "/":
          return [Direction.Left];
        case "\\":
          return [Direction.Right];
        case "-":
          return [Direction.Left, Direction.Right];
        case "|":
          return [Direction.Down];
      }
      break;
    case Direction.Left:
      switch (object) {
        case ".":
          return [Direction.Left];
        case "/":
          return [Direction.Down];
        case "\\":
          return [Direction.Up];
        case "-":
          return [Direction.Left];
        case "|":
          return [Direction.Up, Direction.Down];
      }
      break;
    case Direction.Right:
      switch (object) {
        case ".":
          return [Direction.Right];
        case "/":
          return [Direction.Up];
        case "\\":
          return [Direction.Down];
        case "-":
          return [Direction.Right];
        case "|":
          return [Direction.Up, Direction.Down];
      }
  }
}

function go_in_direction(point: util.Point, direction: Direction): util.Point {
  switch (direction) {
    case Direction.Up:
      return new util.Point(point.line - 1, point.char);
    case Direction.Down:
      return new util.Point(point.line + 1, point.char);
    case Direction.Left:
      return new util.Point(point.line, point.char - 1);
    case Direction.Right:
      return new util.Point(point.line, point.char + 1);
  }
}

function in_bounds(p: util.Point, lines: string[]): boolean {
  return (
    0 <= p.line &&
    p.line < lines.length &&
    0 <= p.char &&
    p.char < lines[0].length
  );
}

function simulate(segment: Segment, lines: string[]): Segment[] {
  const result: Segment[] = [];
  for (const direction of resulting_directions(
    segment.direction,
    lines[segment.entered_point.line][segment.entered_point.char]
  )) {
    const new_entered_point = go_in_direction(segment.entered_point, direction);
    if (in_bounds(new_entered_point, lines)) {
      result.push(new Segment(new_entered_point, direction));
    }
  }

  return result;
}

function energized(lines: string[], initial: Segment): number {
  const established = new util.SerializeSet<Segment>();

  const todo = [initial];

  while (todo.length != 0) {
    const segment = todo.pop();
    if (established.has(segment)) {
      continue;
    }
    established.add(segment);
    todo.push(...simulate(segment, lines));
  }

  const energized_tiles = new util.SerializeSet<util.Point>();
  established.forEach((segment) => {
    energized_tiles.add(segment.entered_point);
  });

  return energized_tiles.size();
}

export function part1(lines: string[]): number {
  return energized(lines, new Segment(new util.Point(0, 0), Direction.Right));
}

export function part2(lines: string[]): number {
  const number_lines = lines.length;
  const number_chars = lines[0].length;

  const initials: Segment[] = [];
  for (let l = 0; l < number_lines; ++l) {
    initials.push(new Segment(new util.Point(l, 0), Direction.Right));
    initials.push(
      new Segment(new util.Point(l, number_chars - 1), Direction.Left)
    );
  }
  for (let c = 0; c < number_chars; ++c) {
    initials.push(new Segment(new util.Point(0, c), Direction.Down));
    initials.push(
      new Segment(new util.Point(number_lines - 1, c), Direction.Up)
    );
  }

  return Math.max(...initials.map((initial) => energized(lines, initial)));
}
