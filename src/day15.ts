function hash(input: string): number {
  let res = 0;
  for (let i = 0; i < input.length; ++i) {
    res += input.charCodeAt(i);
    res *= 17;
    res %= 256;
  }

  return res;
}

export function part1(lines: string[]): number {
  return lines[0].split(",").reduce((sum, step) => sum + hash(step), 0);
}

export function part2(lines: string[]): number {
  const instructions: [string, number][] = lines[0].split(",").map((step) => {
    if (step.at(-1) == "-") {
      return [step.slice(0, -1), -1];
    } else {
      const [name, num] = step.split("=");
      return [name, Number(num)];
    }
  });

  const boxes: [string, number][][] = [];
  for (let b = 0; b < 256; ++b) {
    boxes.push([]);
  }

  for (const [name, num] of instructions) {
    const box = boxes[hash(name)];
    const index = box.findIndex(([n]) => n == name);
    if (index == -1) {
      if (num != -1) {
        box.push([name, num]);
      }
    } else if (num == -1) {
      box.splice(index, 1);
    } else {
      box[index][1] = num;
    }
  }

  let result = 0;
  for (let b = 0; b < 256; ++b) {
    const box = boxes[b];
    for (let s = 0; s < box.length; ++s) {
      result += (b + 1) * (s + 1) * box[s][1];
    }
  }

  return result;
}
