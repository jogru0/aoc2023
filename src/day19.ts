class Range {
  begin: number;
  end: number;

  constructor(begin: number, end: number) {
    this.begin = begin;
    this.end = end;
  }

  count(): number {
    return this.end - this.begin;
  }

  below(t: number): [Range, Range] {
    if (t <= this.begin) {
      return [undefined, this];
    }
    if (this.end <= t) {
      return [this, undefined];
    }

    return [new Range(this.begin, t), new Range(t, this.end)];
  }

  above(t: number): [Range, Range] {
    const swapped = this.below(t + 1);
    return [swapped[1], swapped[0]];
  }

  cut(t: number, is_below: boolean): [Range, Range] {
    if (is_below) {
      return this.below(t);
    } else {
      return this.above(t);
    }
  }
}

class Part {
  ranges: [Range, Range, Range, Range];

  count(): number {
    return (
      this.ranges[0].count() *
      this.ranges[1].count() *
      this.ranges[2].count() *
      this.ranges[3].count()
    );
  }

  constructor(ranges: [Range, Range, Range, Range]) {
    this.ranges = ranges;
  }

  cut(is_below: boolean, t: number, prop: number): [Part, Part] {
    const [ruled_range, unruled_range] = this.ranges[prop].cut(t, is_below);

    let ruled;
    let unruled;

    if (ruled_range !== undefined) {
      ruled = new Part([...this.ranges]);
      ruled.ranges[prop] = ruled_range;
    }

    if (unruled_range !== undefined) {
      unruled = new Part([...this.ranges]);
      unruled.ranges[prop] = unruled_range;
    }

    return [ruled, unruled];
  }
}

class Rule {
  prop: number;
  is_below: boolean;
  t: number;
  goto: number;

  constructor(prop: number, is_below: boolean, t: number, goto: number) {
    this.prop = prop;
    this.is_below = is_below;
    this.t = t;
    this.goto = goto;
  }
}

class Flow {
  rules: Rule[];
  fallback: number;

  constructor(rules: Rule[], fallback: number) {
    this.rules = rules;
    this.fallback = fallback;
  }
}

function to_prop(char: string): number {
  switch (char) {
    case "x":
      return 0;
    case "m":
      return 1;
    case "a":
      return 2;
    case "s":
      return 3;
  }
}

class Flows {
  flows: Flow[];
  start: number;

  constructor(lines: string[]) {
    const str_to_id = new Map<string, number>();

    str_to_id.set("A", -1);
    str_to_id.set("R", -2);

    lines.forEach((line, i) => {
      str_to_id.set(line.slice(0, line.indexOf("{")), i);
    });

    this.flows = lines.map((line) => {
      const rule_strings = line.slice(line.indexOf("{") + 1, -1).split(",");

      const fallback = str_to_id.get(rule_strings.pop());
      const rules = rule_strings.map((rule_string) => {
        const property = to_prop(rule_string[0]);
        const is_below = rule_string[1] == "<";
        const index_colon = rule_string.indexOf(":");
        const t = Number(rule_string.slice(2, index_colon));
        const goto = str_to_id.get(rule_string.slice(index_colon + 1));

        return new Rule(property, is_below, t, goto);
      });

      return new Flow(rules, fallback);
    });

    this.start = str_to_id.get("in");
  }

  count(part: Part, goto: number): number {
    if (goto == -1) {
      return part.count();
    }
    if (goto == -2) {
      return 0;
    }

    const flow = this.flows[goto];

    let sum = 0;

    for (let r = 0; r < flow.rules.length; ++r) {
      const rule = flow.rules[r];

      const [ruled, unruled] = part.cut(rule.is_below, rule.t, rule.prop);

      if (ruled !== undefined) {
        sum += this.count(ruled, rule.goto);
      }

      if (unruled === undefined) {
        return sum;
      }

      part = unruled;
    }

    sum += this.count(part, flow.fallback);
    return sum;
  }
}

export function part1(lines: string[]): number {
  return lines.length;
}

export function part2(lines: string[]): number {
  const flows = new Flows(lines.slice(0, lines.indexOf("")));

  const full_range = new Range(1, 4001);
  const all_possibilities = new Part([
    full_range,
    full_range,
    full_range,
    full_range,
  ]);

  return flows.count(all_possibilities, flows.start);
}
