function to_sequence(springs: number[]): [number[], number, number] {
  const result: number[] = [];
  let last_broken;
  springs.push(1);

  let s_id = 0;
  for (; s_id < springs.length; ++s_id) {
    const n = springs[s_id];
    if (n == 0 && last_broken === undefined) {
      last_broken = s_id;
    } else if (n == 1 && last_broken !== undefined) {
      result.push(s_id - last_broken);
      last_broken = undefined;
    }
    if (n == -1) {
      break;
    }
  }
  springs.pop();

  let start_index_count: number;
  if (last_broken === undefined) {
    start_index_count = s_id;
  } else {
    start_index_count = last_broken;
  }

  let min = 0;
  let max = 0;
  for (let s = start_index_count; s < springs.length; ++s) {
    if (springs[s] == 0) {
      ++min;
    }
    if (springs[s] != 1) {
      ++max;
    }
  }

  return [result, min, max];
}

const memo = new Map<string, number>();

function valid2(springs: number[], sequence: number[]): number {
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
      result += valid2([], sequence.slice(0, -1));
    } else {
      result += valid2(
        springs.slice(0, start_index - 1),
        sequence.slice(0, -1)
      );
    }
  }

  memo.set(stringified, result);
  return result;
}

function valid(springs: number[], sequence: number[]): number {
  const next_unknown_id = springs.indexOf(-1);

  const [actual_sequence, remaining_min, remaining_max] = to_sequence(springs);
  if (next_unknown_id == -1) {
    if (
      actual_sequence.length == sequence.length &&
      actual_sequence.every((elem, i) => elem == sequence[i])
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  if (
    sequence.length < actual_sequence.length ||
    actual_sequence.some((elem, i) => elem != sequence[i])
  ) {
    return 0;
  }

  let rem = 0;
  for (let i = actual_sequence.length; i < sequence.length; ++i) {
    rem += sequence[i];
  }

  if (rem < remaining_min) {
    return 0;
  }

  if (rem > remaining_max) {
    return 0;
  }

  springs[next_unknown_id] = 0;
  let result = valid(springs, sequence);
  springs[next_unknown_id] = 1;
  result += valid(springs, sequence);
  springs[next_unknown_id] = -1;
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
    (sum, [springs, sequence]) => sum + valid2(springs, sequence),
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

    const expamded_sequence = [...sequence];
    expamded_sequence.push(...sequence);
    expamded_sequence.push(...sequence);
    expamded_sequence.push(...sequence);
    expamded_sequence.push(...sequence);

    return [expanded_strings, expamded_sequence];
  });

  return springs_sequence_array.reduce((sum, [springs, sequence], i) => {
    return sum + valid2(springs, sequence);
  }, 0);
}
