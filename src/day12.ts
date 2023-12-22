const memo = new Map<string, number>();

function valid(springs: number[], sequence: number[]): number {
  const stringified = JSON.stringify([springs, sequence]);
  const memoized = memo.get(stringified);
  if (memoized !== undefined) {
    return memoized;
  }

  if (sequence.length == 0) {
    if (springs.includes(0)) {
      memo.set(stringified, 0);
      return 0;
    } else {
      memo.set(stringified, 1);
      return 1;
    }
  }
  const length = sequence.at(-1);
  let result = 0;
  for (
    let start_index = 0;
    start_index <= springs.length - length;
    ++start_index
  ) {
    if (start_index != 0 && springs[start_index - 1] == 0) {
      continue;
    }
    if (springs.slice(start_index, start_index + length).includes(1)) {
      continue;
    }
    if (springs.slice(start_index + length).includes(0)) {
      continue;
    }

    if (start_index == 0) {
      result += valid([], sequence.slice(0, -1));
    } else {
      result += valid(springs.slice(0, start_index - 1), sequence.slice(0, -1));
    }
  }

  memo.set(stringified, result);
  return result;
}

export function part1(lines: string[]): number {
  const springs_sequence_array: [number[], number[]][] = lines.map((line) => {
    const [l, r] = line.split(" ");
    return [
      [...l].map((char) => {
        switch (char) {
          case ".":
            return 1;
          case "#":
            return 0;
          case "?":
            return -1;
        }
      }),
      r.split(",").map((n) => Number(n)),
    ];
  });

  return springs_sequence_array.reduce(
    (sum, [springs, sequence]) => sum + valid(springs, sequence),
    0
  );
}

export function part2(lines: string[]): number {
  const springs_sequence_array: [number[], number[]][] = lines.map((line) => {
    const [l, r] = line.split(" ");

    const springs = [...l].map((char) => {
      switch (char) {
        case ".":
          return 1;
        case "#":
          return 0;
        case "?":
          return -1;
      }
    });
    const sequence = r.split(",").map((n) => Number(n));

    const expanded_strings = [...springs];
    expanded_strings.push(-1);
    expanded_strings.push(...springs);
    expanded_strings.push(-1);
    expanded_strings.push(...springs);
    expanded_strings.push(-1);
    expanded_strings.push(...springs);
    expanded_strings.push(-1);
    expanded_strings.push(...springs);

    const expanded_sequence = [...sequence];
    expanded_sequence.push(...sequence);
    expanded_sequence.push(...sequence);
    expanded_sequence.push(...sequence);
    expanded_sequence.push(...sequence);

    return [expanded_strings, expanded_sequence];
  });

  return springs_sequence_array.reduce((sum, [springs, sequence]) => {
    return sum + valid(springs, sequence);
  }, 0);
}
