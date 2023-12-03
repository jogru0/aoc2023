import * as util from "../util.js";

const lines = util.read_lines("day2/in.txt");

interface Cubes {
  red: number;
  blue: number;
  green: number;
}

function power_of(cubes: Cubes) {
  return cubes.blue * cubes.red * cubes.green;
}

function to_cubes(set: string): Cubes {
  console.log(set);
  const result: Cubes = { red: 0, blue: 0, green: 0 };
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

const game_to_iteration_to_cubes = lines.map((line) =>
  line
    .substring(line.indexOf(": ") + 2)
    .split("; ")
    .map(to_cubes)
);

const sum = game_to_iteration_to_cubes.reduce((sum, iterations) => {
  return power_of(element_wise_max(iterations)) + sum;
}, 0);

console.log(sum);

function element_wise_max(iterations: Cubes[]): Cubes {
  return {
    red: Math.max(...iterations.map((cubes) => cubes.red)),
    blue: Math.max(...iterations.map((cubes) => cubes.blue)),
    green: Math.max(...iterations.map((cubes) => cubes.green)),
  };
}
