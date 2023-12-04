class Cubes {
  red: number;
  green: number;
  blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.blue = blue;
    this.green = green;
  }

  static empty(): Cubes {
    return new Cubes(0, 0, 0);
  }

  is_subset_of(set: Cubes): boolean {
    return (
      this.red <= set.red && this.blue <= set.blue && this.green <= set.green
    );
  }

  power() {
    return this.blue * this.red * this.green;
  }
}

function to_cubes(set: string): Cubes {
  const result = Cubes.empty();
  set.split(", ").map((element) => {
    const parts = element.split(" ");
    const number = Number(parts[0]);
    switch (parts[1]) {
      case "red":
        result.red += number;
        break;
      case "blue":
        result.blue += number;
        break;
      case "green":
        result.green += number;
        break;
    }
  });

  return result;
}

function element_wise_max(iterations: Cubes[]): Cubes {
  return new Cubes(
    Math.max(...iterations.map((cubes) => cubes.red)),
    Math.max(...iterations.map((cubes) => cubes.green)),
    Math.max(...iterations.map((cubes) => cubes.blue))
  );
}

function lines_to_game_to_iteration_to_cubes(lines: string[]) {
  return lines.map((line) =>
    line
      .substring(line.indexOf(": ") + 2)
      .split("; ")
      .map(to_cubes)
  );
}

export function part1(lines: string[]) {
  const game_to_iteration_to_cubes = lines_to_game_to_iteration_to_cubes(lines);

  const max: Cubes = new Cubes(12, 13, 14);

  let sum = 0;
  game_to_iteration_to_cubes.map((iterations, index) => {
    if (iterations.every((cubes) => cubes.is_subset_of(max))) {
      sum += index + 1;
    }
  });
  return sum;
}

export function part2(lines: string[]) {
  const game_to_iteration_to_cubes = lines_to_game_to_iteration_to_cubes(lines);

  return game_to_iteration_to_cubes.reduce((sum, iterations) => {
    return element_wise_max(iterations).power() + sum;
  }, 0);
}
