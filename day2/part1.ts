import * as util from "../util.js";

const lines = util.read_lines("day2/in.txt");

interface Cubes {
  red: number;
  blue: number;
  green: number;
}

function is_subset_of(sub: Cubes, set: Cubes): boolean {
  return sub.red <= set.red && sub.blue <= set.blue && sub.green <= set.green;
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

const max: Cubes = { red: 12, green: 13, blue: 14 };
let sum = 0;

game_to_iteration_to_cubes.map((iterations, index) => {
  if (iterations.every((cubes) => is_subset_of(cubes, max))) {
    sum += index + 1;
  }
});

console.log(sum);
