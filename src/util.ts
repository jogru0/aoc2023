import * as fs from "fs";

export function parse_number_sequence(sequence: string) {
  return sequence.trim().split(/\s+/).map(Number);
}

export function behind(line: string, marker: string) {
  return line.substring(line.indexOf(marker) + marker.length);
}

export function read_lines(path: string) {
  const file = fs.readFileSync(path, "utf-8");
  return file.trimEnd().split(/\r?\n/);
}

export function match_with_overlap(line: string, regex: RegExp) {
  const matches: string[] = [];
  let found: RegExpExecArray;
  while ((found = regex.exec(line))) {
    matches.push(found[0]);
    regex.lastIndex = found.index + 1;
  }

  return matches;
}

export function combine_digits(digits: number[]): number {
  return digits.reduce((so_far, digit) => 10 * so_far + digit, 0);
}

interface Serializable {
  serialize(): string;
}

export class SerializeMap<K extends Serializable, V> {
  private map: Map<string, V> = new Map();

  has(key: K): boolean {
    return this.map.has(key.serialize());
  }

  set(key: K, value: V) {
    this.map.set(key.serialize(), value);
  }

  get(key: K) {
    return this.map.get(key.serialize());
  }

  forEach(callbackfn: (value: V) => void) {
    this.map.forEach(callbackfn);
  }

  size() {
    return this.map.size;
  }
}

export class SerializeSet<K extends Serializable> {
  private map: Map<string, K> = new Map();

  has(key: K): boolean {
    return this.map.has(key.serialize());
  }

  add(key: K) {
    this.map.set(key.serialize(), key);
  }

  size() {
    return this.map.size;
  }

  forEach(callbackfn: (value: K) => void) {
    this.map.forEach(callbackfn);
  }
}

export const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const lcmAll = (ns) => ns.reduce(lcm, 1);

export class Point {
  line: number;
  char: number;

  constructor(line: number, char: number) {
    this.line = line;
    this.char = char;
  }

  neighbors(): [Point, Point, Point, Point] {
    return [
      new Point(this.line - 1, this.char),
      new Point(this.line + 1, this.char),
      new Point(this.line, this.char - 1),
      new Point(this.line, this.char + 1),
    ];
  }

  serialize() {
    return `${this.line}@${this.char}`;
  }
}

export function pos_mod(n, m) {
  return ((n % m) + m) % m;
}
