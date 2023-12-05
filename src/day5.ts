import * as util from "./util";

class Interval {
  from: number;
  length: number;
  to: number;

  constructor(from, length: number) {
    this.from = from;
    this.length = length;
    this.to = from + length;
  }

  try_overlap(other: Interval): Interval {
    const from = Math.max(this.from, other.from);
    const to = Math.min(this.to, other.to);
    if (from < to) {
      return Interval.Range(from, to);
    }
  }

  static Range(from: number, to: number) {
    return new Interval(from, to - from);
  }
}

class MapperEntry {
  private source: Interval;
  private shift: number;

  try_map(n: number) {
    if (this.source.from <= n && n < this.source.to) {
      return n + this.shift;
    }
  }

  try_map_interval(interval: Interval): [Interval, Interval[]] {
    const overlap = interval.try_overlap(this.source);

    if (overlap === undefined) {
      return [undefined, [interval]];
    }

    const shifted = Interval.Range(
      overlap.from + this.shift,
      overlap.to + this.shift
    );

    const unmapped: Interval[] = [];
    if (interval.from < overlap.from) {
      unmapped.push(Interval.Range(interval.from, overlap.from));
    }
    if (overlap.to < interval.to) {
      unmapped.push(Interval.Range(overlap.to, interval.to));
    }

    return [shifted, unmapped];
  }

  constructor(source_start: number, target_start: number, length: number) {
    this.source = new Interval(source_start, length);
    this.shift = target_start - this.source.from;
  }
}

class Mapper {
  private entry: MapperEntry[] = [];

  add_entry(entry: MapperEntry) {
    this.entry.push(entry);
  }

  map_interval(interval: Interval): Interval[] {
    const done: Interval[] = [];

    let unmapped = [interval];
    for (let i = 0; i < this.entry.length; ++i) {
      const tmp_unmapped = [];
      unmapped.forEach((inter) => {
        const [new_mapped, new_unmapped] =
          this.entry[i].try_map_interval(inter);
        if (new_mapped !== undefined) {
          done.push(new_mapped);
        }

        tmp_unmapped.push(...new_unmapped);
      });

      unmapped = tmp_unmapped;
    }

    done.push(...unmapped);

    return done;
  }

  map(n: number) {
    for (let i = 0; i < this.entry.length; ++i) {
      const try_mapped = this.entry[i].try_map(n);
      if (try_mapped != undefined) {
        return try_mapped;
      }
    }
    return n;
  }
}

function parse_input(lines: string[]): [number[], Mapper[]] {
  const seeds = util.parse_number_sequence(util.behind(lines[0], ":"));
  const maps: Mapper[] = [];

  for (let l = 1; l < lines.length; ++l) {
    const line = lines[l];
    if (line.length == 0) {
      maps.push(new Mapper());
      ++l;
    } else {
      const mapper_entry_input = util.parse_number_sequence(line);
      maps
        .at(-1)
        .add_entry(
          new MapperEntry(
            mapper_entry_input[1],
            mapper_entry_input[0],
            mapper_entry_input[2]
          )
        );
    }
  }

  return [seeds, maps];
}

function to_intervals(seeds: number[]): Interval[] {
  const result: Interval[] = [];

  for (let i = 0; i < seeds.length; i += 2) {
    result.push(new Interval(seeds[i], seeds[i + 1]));
  }

  return result;
}

export function part1(lines: string[]): number {
  const [seeds, mappers] = parse_input(lines);

  const mapped = seeds.map((seed) => {
    mappers.forEach((mapper) => (seed = mapper.map(seed)));
    return seed;
  });

  return Math.min(...mapped);
}

export function part2(lines: string[]): number {
  const [seeds, mappers] = parse_input(lines);

  let seed_intervals: Interval[] = to_intervals(seeds);

  mappers.forEach((mapper) => {
    seed_intervals = seed_intervals.flatMap((interval) =>
      mapper.map_interval(interval)
    );
  });

  return Math.min(...seed_intervals.map((interval) => interval.from));
}
