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

class PartRange {
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

  cut(is_below: boolean, t: number, prop: number): [PartRange, PartRange] {
    const [ruled_range, unruled_range] = this.ranges[prop].cut(t, is_below);

    let ruled;
    let unruled;

    if (ruled_range !== undefined) {
      ruled = new PartRange([...this.ranges]);
      ruled.ranges[prop] = ruled_range;
    }

    if (unruled_range !== undefined) {
      unruled = new PartRange([...this.ranges]);
      unruled.ranges[prop] = unruled_range;
    }

    return [ruled, unruled];
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

class Part {
  x: number;
  m: number;
  a: number;
  s: number;

  constructor(x: number, m: number, a: number, s: number) {
    this.x = x;
    this.m = m;
    this.a = a;
    this.s = s;
  }

  value() {
    return this.x + this.m + this.a + this.s;
  }

  property(p: number): number {
    switch (p) {
      case 0:
        return this.x;
      case 1:
        return this.m;
      case 2:
        return this.a;
      case 3:
        return this.s;
    }
  }

  apply_rule(rule: Rule): number {
    const val = this.property(rule.property);
    if (
      (rule.has_to_be_small && val < rule.limit) ||
      (!rule.has_to_be_small && rule.limit < val)
    ) {
      return rule.goto;
    }
  }

  apply_flow(flow: Workflow): number {
    for (let i = 0; i < flow.rules.length; ++i) {
      const res = this.apply_rule(flow.rules[i]);
      if (res !== undefined) {
        return res;
      }
    }
    return flow.fallback;
  }

  is_accepted(flows: Workflow[], current: number): boolean {
    while (0 <= current) {
      current = this.apply_flow(flows[current]);
    }

    return current == -1;
  }
}

function to_prop(p: string): number {
  switch (p) {
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

  count(part: PartRange, goto: number): number {
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

      const [ruled, unruled] = part.cut(
        rule.has_to_be_small,
        rule.limit,
        rule.property
      );

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

class Rule {
  property: number;
  has_to_be_small: boolean;
  limit: number;
  goto: number;

  constructor(
    property: number,
    has_to_be_small: boolean,
    limit: number,
    goto: number
  ) {
    this.property = property;
    this.has_to_be_small = has_to_be_small;
    this.limit = limit;
    this.goto = goto;
  }
}

class Workflow {
  rules: Rule[];
  fallback: number;

  constructor(rules: Rule[], fallback: number) {
    this.rules = rules;
    this.fallback = fallback;
  }
}

function parse(lines: string[]): [Workflow[], number, Part[]] {
  const empty_line = lines.indexOf("");

  const name_to_index = new Map<string, number>();

  const to_index = (input: string) => {
    switch (input) {
      case "R":
        return -2;
      case "A":
        return -1;
    }
    return name_to_index.get(input);
  };

  lines.slice(0, empty_line).map((line, index) => {
    const name = line.substring(0, line.indexOf("{"));
    name_to_index.set(name, index);
  });

  const start = to_index("in");

  const workflows = lines.slice(0, empty_line).map((line) => {
    const rule_strings = line.slice(line.indexOf("{") + 1, -1).split(",");
    const fallback = to_index(rule_strings.pop());
    const rules = rule_strings.map((rule_string) => {
      const [l, r] = rule_string.split(":");
      const property = to_prop(l[0]);
      const has_to_be_small = l[1] == "<";
      const limit = Number(l.slice(2));
      const goto = to_index(r);

      return new Rule(property, has_to_be_small, limit, goto);
    });
    return new Workflow(rules, fallback);
  });

  const parts = lines.slice(empty_line + 1).map((line) => {
    const [x, m, a, s] = line
      .slice(1, -1)
      .split(",")
      .map((aeqb) => Number(aeqb.split("=")[1]));
    return new Part(x, m, a, s);
  });

  return [workflows, start, parts];
}

export function part1(lines: string[]): number {
  const [flows, start, parts] = parse(lines);

  return parts.reduce((sum, part) => {
    if (part.is_accepted(flows, start)) {
      return sum + part.value();
    } else {
      return sum;
    }
  }, 0);
}

export function part2(lines: string[]): number {
  const flows = new Flows(lines.slice(0, lines.indexOf("")));

  const full_range = new Range(1, 4001);
  const all_possibilities = new PartRange([
    full_range,
    full_range,
    full_range,
    full_range,
  ]);

  return flows.count(all_possibilities, flows.start);
}
