class PointST {
  x: number;
  y: number;
  z: number;
  t: number;

  constructor(x: number, y: number, z: number, t: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
  }

  sq_no_z(): number {
    return dot_no_z(this, this)
  }

  sq_xy(): number {
    return this.x * this.x + this.y * this.y;
  }

  neg(): PointST {
    return new PointST(-this.x, -this.y, -this.z, -this.t);
  }
}

class Path {
  eval(q: number): PointST {
    return new PointST(
      this.start.x + q * this.velocity.x,
      this.start.y + q * this.velocity.y,
      this.start.z + q * this.velocity.z,
      this.start.t + q * this.velocity.t);
  }

  start: PointST;
  velocity: PointST;

  constructor(start: PointST, velocity: PointST) {
    this.start = start;
    this.velocity = velocity;
  }
}

function diff(to: PointST, from: PointST): PointST {
  return new PointST(to.x - from.x, to.y - from.y, to.z - from.z, to.t - from.t);
}

function add(a: PointST, b: PointST): PointST {
  return new PointST(a.x + b.x, a.y + b.y, a.z + b.z, a.t + b.t);
}

function mul(t: number, p: PointST): PointST {
  return new PointST(t * p.x, t * p.y, t * p.z, t * p.t);
}

function dot_no_z(p: PointST, q: PointST): number {
  return p.x * q.x + p.y * q.y + p.t * q.t;
}

function distance_squared(l: Path, m: Path): number {
  const a = l.start;
  const b = l.velocity;
  const c = m.start;
  const d = m.velocity;

  const e = diff(a, c);

  const b2 = b.sq_no_z();
  const d2 = d.sq_no_z();
  const de = dot_no_z(d, e);
  const be = dot_no_z(b, e);
  const bd = dot_no_z(b, d);

  const det = bd * bd - b2 * d2;

  const s = (be * bd - b2 * de) / det;
  const t = (d2 * be - de * bd) / det;

  return add(e, diff(mul(t, b), mul(s, d))).sq_no_z()
}

function trajectory_score(trajectory: Path, comets: Path[]): number {
  return distance_squared(trajectory, comets[3]);
}

function parse_point3(line: string, t: number): PointST {
  const numbers = line
    .split(", ")
    .map(Number);

  return new PointST(numbers[0], numbers[1], numbers[2], t);
}

function parse_path(line: string): Path {
  const points = line
    .split(" @ ")


  return new Path(parse_point3(points[0], 0), parse_point3(points[1], 1));
}

function intersection(l1: Path, l2: Path): boolean {
  const c = diff(l1.start, l2.start);
  const a = l2.velocity;
  const b = l1.velocity.neg();

  const det = a.x * b.y - b.x * a.y;

  if (det == 0) {
    return false;
  }

  const t = (c.x * b.y - b.x * c.y) / det;
  const s = (a.x * c.y - c.x * a.y) / det;

  if (s < 0 || t < 0) {
    return false;
  }

  const p = l1.eval(s);
  const q = l2.eval(t);

  if (200000000000000 <= p.x && p.x <= 400000000000000 && 200000000000000 <= p.y && p.y <= 400000000000000) {
    return true;
  }
  return false;
}

export function part1(lines: string[]): number {
  const paths = lines.map(parse_path);

  let sum = 0;
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (intersection(paths[i], paths[j])) {
        sum += 1;
      }
    }
  }
  return sum;
}

function try_solve_with(start: PointST, goal: PointST, paths: Path[]): [boolean, number] {
  let velo = diff(goal, start);

  let dt = velo.t;
  velo.x /= dt;
  velo.y /= dt;
  velo.z /= dt;
  velo.t = 1;

  const offset = start.t;
  start.x -= offset * velo.x;
  start.y -= offset * velo.y;
  start.z -= offset * velo.z;
  start.t = 0;

  const trajectory = new Path(start, velo);

  const score = trajectory_score(trajectory, paths)
  if (score < 0.1) {
    return [true, trajectory.start.x + trajectory.start.y + trajectory.start.z]
  } else {
    return [false, score]
  }
}

function score_t(t: number, paths: Path[]): [boolean, number] {
  const l1 = paths[0];
  const l2 = paths[1];
  const l3 = paths[2];

  const p2 = l2.start;
  const p3 = l3.start;

  const v2 = l2.velocity;
  const v3 = l3.velocity;

  const start = l1.eval(t);

  const vd = add(mul(t, v2), diff(p2, start));
  const xd = vd.x;
  const yd = vd.y;

  const p13 = diff(diff(start, mul(t, v2)), p3);
  const xp = p13.x;
  const yp = p13.y;

  const v = diff(v3, v2);
  const xv = v.x;
  const yv = v.y;

  const t3_n = yp * xd - xp * yd;
  const t3_d = xd * yv - yd * xv;
  const t3 = t3_n / t3_d;

  const goal = l3.eval(t3);

  return try_solve_with(start, goal, paths);
}

function find_candidate(start_t: number, paths: Path[]): [boolean, number] {
  let best_t: number = undefined;
  let best_score: number = Infinity;

  for (let i = 0; i < 120; i += 1) {
    const res = i % 2;
    const exp = (i - res) / 2;

    let sign: number = undefined;
    if (res == 0) {
      sign = 1;
    } else {
      sign = -1;
    };

    const t = start_t + sign * Math.pow(2, exp);

    if (t < 0) {
      continue;
    }

    const [solved, score] = score_t(t, paths);
    if (solved) {
      return [true, score];
    }
    if (score < best_score) {
      best_score = score;
      best_t = t
    }
  }

  return [false, best_t]
}

export function part2(lines: string[]): number {
  const paths = lines.map(parse_path);

  let t = 0;
  for (; ;) {
    const [solved, new_t] = find_candidate(t, paths);
    if (solved) {
      return new_t;
    } else {
      t = new_t;
    }
  }
}
