import * as util from "./util";

export class Segment {
  entered_point: util.Point;
  direction: util.Direction;

  constructor(entered_point: util.Point, direction: util.Direction) {
    this.entered_point = entered_point;
    this.direction = direction;
  }

  serialize() {
    return `${this.entered_point.serialize()}>${this.direction}`;
  }
}

function resulting_directions(
  direction: util.Direction,
  object: string
): util.Direction[] {
  switch (direction) {
    case util.Direction.Up:
      switch (object) {
        case ".":
          return [util.Direction.Up];
        case "/":
          return [util.Direction.Right];
        case "\\":
          return [util.Direction.Left];
        case "-":
          return [util.Direction.Left, util.Direction.Right];
        case "|":
          return [util.Direction.Up];
      }
      break;
    case util.Direction.Down:
      switch (object) {
        case ".":
          return [util.Direction.Down];
        case "/":
          return [util.Direction.Left];
        case "\\":
          return [util.Direction.Right];
        case "-":
          return [util.Direction.Left, util.Direction.Right];
        case "|":
          return [util.Direction.Down];
      }
      break;
    case util.Direction.Left:
      switch (object) {
        case ".":
          return [util.Direction.Left];
        case "/":
          return [util.Direction.Down];
        case "\\":
          return [util.Direction.Up];
        case "-":
          return [util.Direction.Left];
        case "|":
          return [util.Direction.Up, util.Direction.Down];
      }
      break;
    case util.Direction.Right:
      switch (object) {
        case ".":
          return [util.Direction.Right];
        case "/":
          return [util.Direction.Up];
        case "\\":
          return [util.Direction.Down];
        case "-":
          return [util.Direction.Right];
        case "|":
          return [util.Direction.Up, util.Direction.Down];
      }
  }
}

function simulate(segment: Segment, lines: string[]): Segment[] {
  const result: Segment[] = [];
  for (const direction of resulting_directions(
    segment.direction,
    lines[segment.entered_point.line][segment.entered_point.char]
  )) {
    const new_entered_point = util.go_in_direction(
      segment.entered_point,
      direction
    );
    if (util.in_bounds(new_entered_point, lines)) {
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
  return energized(
    lines,
    new Segment(new util.Point(0, 0), util.Direction.Right)
  );
}

export function part2(lines: string[]): number {
  const number_lines = lines.length;
  const number_chars = lines[0].length;

  const initials: Segment[] = [];
  for (let l = 0; l < number_lines; ++l) {
    initials.push(new Segment(new util.Point(l, 0), util.Direction.Right));
    initials.push(
      new Segment(new util.Point(l, number_chars - 1), util.Direction.Left)
    );
  }
  for (let c = 0; c < number_chars; ++c) {
    initials.push(new Segment(new util.Point(0, c), util.Direction.Down));
    initials.push(
      new Segment(new util.Point(number_lines - 1, c), util.Direction.Up)
    );
  }

  return Math.max(...initials.map((initial) => energized(lines, initial)));
}
