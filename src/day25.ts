import * as util from "./util";

class Graph {
  vertex_to_reachable: Map<string, [string[], number]>;

  constructor(lines: string[]) {
    this.vertex_to_reachable = new Map();

    const todo: string[] = [];

    for (const line of lines) {
      const [from, to] = line.split(": ");
      const tos: string[] = to.split(" ");
      todo.push(...tos);
      this.vertex_to_reachable.set(from, [tos, 1]);
    };

    for (const to of todo) {
      if (!this.vertex_to_reachable.has(to)) {
        this.vertex_to_reachable.set(to, [[], 1]);
      }
    }
  }

  collapse(v: string, w: string) {
    const old_out = this.vertex_to_reachable.get(v);
    const new_out = this.vertex_to_reachable.get(w);
    new_out[0].push(...old_out[0]);
    new_out[1] += old_out[1];
    this.vertex_to_reachable.delete(v);

    for (const val of this.vertex_to_reachable.values()) {
      for (let i = 0; i < val[0].length; i += 1) {
        if (val[0][i] == v) {
          val[0][i] = w;
        }
      }
    }

    for (const key of this.vertex_to_reachable.keys()) {
      let val = this.vertex_to_reachable.get(key);
      val[0] = val[0].filter(item => item != key);
    }
  }
}

function get_random(max: number): number {
  return Math.floor(Math.random() * max);
}

function randomized_cut(graph: Graph): [number, number] {

  for (; ;) {
    if (graph.vertex_to_reachable.size == 2) {
      let res1 = 0;
      let res2 = 1;
      for (const key of graph.vertex_to_reachable.keys()) {
        res1 += graph.vertex_to_reachable.get(key)[0].length
        res2 *= graph.vertex_to_reachable.get(key)[1]
      }
      return [res1, res2];
    }

    let n_edges = 0;
    for (const value of graph.vertex_to_reachable.values()) {
      n_edges += value[0].length;
    }
    let e_id = get_random(n_edges);

    let v: string = undefined;
    let w: string = undefined;
    for (const key of graph.vertex_to_reachable.keys()) {
      const value = graph.vertex_to_reachable.get(key);
      if (e_id < value[0].length) {
        v = key;
        w = value[0][e_id];
        break;
      }

      e_id -= value[0].length;
    }

    graph.collapse(v, w)
  }
}

export function part1(lines: string[]): number {
  for (; ;) {
    const graph = new Graph(lines);
    const [edges, prod] = randomized_cut(graph);
    if (edges <= 3) {
      return prod;
    }
  }
}

export function part2(lines: string[]): number {
  return lines.length;
}
