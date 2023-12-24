import * as util from "./util";

class Graph {
  vertex_to_reachable: [number, number][][];
  start: number;
  end: number;

  replace(v: [number, number], old: number, neww: [number, number]) {
    const reachable = this.vertex_to_reachable[v[0]];
    const id = reachable.findIndex(([id]) => id == old);
    reachable[id] = [neww[0], v[1] + neww[1]];
  }

  simplify(v: number) {
    const reachable = this.vertex_to_reachable[v];
    if (reachable.length != 2) {
      return;
    }

    this.replace(reachable[0], v, reachable[1]);
    this.replace(reachable[1], v, reachable[0]);
    reachable.length = 0;
  }

  simplify_all() {
    for (let v = 0; v < this.vertex_to_reachable.length; ++v) {
      this.simplify(v);
    }
  }

  find_longest(): number {
    let res = -1;

    const path = [[this.start, 0]];
    while (path.length != 0) {
      const last = path.at(-1);
      const [cur_p, cur_id] = last;

      if (cur_p == this.end) {
        let length = 0;

        for (let i = 0; i < path.length - 1; ++i) {
          length += this.vertex_to_reachable[path[i][0]][path[i][1] - 1][1];
        }

        res = Math.max(res, length);
      }

      if (cur_id == this.vertex_to_reachable[cur_p].length) {
        path.pop();
        continue;
      }

      const n_p = this.vertex_to_reachable[cur_p][cur_id][0];
      ++last[1];

      if (path.findIndex(([p]) => p == n_p) != -1) {
        continue;
      }

      path.push([n_p, 0]);
    }

    return res;
  }

  constructor(lines: string[]) {
    this.vertex_to_reachable = [];
    const p_to_id = new util.SerializeMap<util.Point, number>();

    for (let l = 0; l < lines.length; ++l) {
      for (let c = 0; c < lines[l].length; ++c) {
        if (lines[l][c] != "#") {
          const p = new util.Point(l, c);
          const p_id = this.vertex_to_reachable.length;
          p_to_id.set(p, p_id);

          const reachable: [number, number][] = [];

          for (const dir of [
            util.Direction.Down,
            util.Direction.Up,
            util.Direction.Left,
            util.Direction.Right,
          ]) {
            const n = util.go_in_direction(p, dir);
            const n_id = p_to_id.get(n);
            if (n_id !== undefined) {
              reachable.push([n_id, 1]);
              this.vertex_to_reachable[n_id].push([p_id, 1]);
            }
          }

          this.vertex_to_reachable.push(reachable);

          if (l == 0) {
            this.start = p_id;
          }

          if (l == lines.length - 1) {
            this.end = p_id;
          }
        }
      }
    }
  }
}

export function part1(lines: string[]): number {
  const start_l = 0;
  const start_c = lines[start_l].indexOf(".");
  const start = new util.Point(start_l, start_c);

  const end_l = lines.length - 1;
  const end_c = lines[end_l].indexOf(".");
  const end = new util.Point(end_l, end_c);

  const path: [util.Point, number][] = [[start, 0]];
  const path_set = new util.SerializeSet<util.Point>();
  path_set.add(start);

  let longest = -1;

  while (path.length != 0) {
    const last = path.at(-1);

    const [p, direction] = last;

    if (direction == 4) {
      path.pop();
      path_set.delete(p);
      continue;
    }

    ++last[1];

    const cur = lines[p.line][p.char];
    if (
      (cur == ">" && direction != util.Direction.Right) ||
      (cur == "v" && direction != util.Direction.Down)
    ) {
      continue;
    }

    const next_p = util.go_in_direction(p, direction);
    if (!util.in_bounds(next_p, lines)) {
      continue;
    }

    const nex = lines[next_p.line][next_p.char];
    if (nex == "#") {
      continue;
    }

    if (path_set.has(next_p)) {
      continue;
    }

    if (next_p.serialize() == end.serialize()) {
      longest = Math.max(longest, path.length);
    }

    path.push([next_p, 0]);
    path_set.add(next_p);
  }

  return longest;
}

export function part2(lines: string[]): number {
  const graph = new Graph(lines);
  graph.simplify_all();

  return graph.find_longest();
}
