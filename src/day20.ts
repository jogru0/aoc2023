import * as util from "./util";

interface Module {
  receive(is_high: boolean, input_id: number): boolean;
  register_input(): number;
}

class FlipFlop {
  is_on = false;
  receive(is_high: boolean): boolean {
    if (!is_high) {
      this.is_on = !this.is_on;
      return this.is_on;
    }
  }
  register_input(): number {
    return undefined;
  }
}

class Broadcaster {
  receive(is_high: boolean): boolean {
    return is_high;
  }

  register_input(): number {
    return undefined;
  }
}

class Conjunction {
  remembered: boolean[] = [];
  was_all_high = true;
  receive(is_high: boolean, input_id: number): boolean {
    this.remembered[input_id] = is_high;
    const is_all_high = this.remembered.every((is_high) => is_high);
    this.was_all_high ||= is_all_high;
    return !is_all_high;
  }

  register_input(): number {
    this.was_all_high = false;
    this.remembered.push(false);
    return this.remembered.length - 1;
  }
}

class Modules {
  modules: [Module, [number, number][]][];
  start_id: number;
  clocks: Conjunction[] = [];

  press_button(): [number, number] {
    let todo: [number, number, boolean][] = [[this.start_id, undefined, false]];

    let lows = 0;
    let highs = 0;

    while (todo.length != 0) {
      const new_todo: [number, number, boolean][] = [];

      todo.forEach(([module_id, input_id, is_high]) => {
        if (is_high) {
          ++highs;
        } else {
          ++lows;
        }

        if (module_id !== undefined) {
          const [module, destinations] = this.modules[module_id];
          const new_pulse = module.receive(is_high, input_id);
          if (new_pulse !== undefined) {
            destinations.forEach(([m_id, i_id]) => {
              new_todo.push([m_id, i_id, new_pulse]);
            });
          }
        }
      });

      todo = new_todo;
    }

    return [lows, highs];
  }

  constructor(lines: string[]) {
    const name_to_index = new Map<string, number>();
    lines.forEach((line, i) => {
      let start_index = 0;
      if (line[0] == "%" || line[0] == "&") {
        start_index = 1;
      }
      const name = line.slice(start_index, line.indexOf(" "));
      if (name == "broadcaster") {
        this.start_id = i;
      }
      name_to_index.set(name, i);
    });

    const just_modules: Module[] = lines.map((line) => {
      if (line[0] == "%") {
        return new FlipFlop();
      } else if (line[0] == "&") {
        return new Conjunction();
      } else {
        return new Broadcaster();
      }
    });

    this.modules = lines.map((line, i) => {
      const module: Module = just_modules[i];
      const receiver: [number, number][] = line
        .slice(line.indexOf(">") + 2)
        .split(", ")
        .map((rec) => {
          const rec_id = name_to_index.get(rec);
          let in_id;
          if (rec_id !== undefined) {
            in_id = just_modules[rec_id].register_input();
          }
          return [rec_id, in_id];
        });
      return [module, receiver];
    });

    const out_id = this.modules.findIndex(([, outputs]) =>
      outputs.some(([id]) => id === undefined)
    );

    const pre_clock_ids = this.modules
      .map((val, i): [[Module, [number, number][]], number] => [val, i])
      .filter(([[, outputs]]) => outputs.some(([id]) => id == out_id))
      .map(([, id]) => id);

    this.clocks = pre_clock_ids.map(
      (pre_clock_id) =>
        this.modules.find(([, outputs]) =>
          outputs.some(([id]) => id === pre_clock_id)
        )[0] as Conjunction
    );
  }
}

export function part1(lines: string[]): number {
  const modules = new Modules(lines);
  let all_lows = 0;
  let all_highs = 0;
  for (let i = 0; i < 1000; ++i) {
    const [lows, highs] = modules.press_button();
    all_lows += lows;
    all_highs += highs;
  }
  return all_lows * all_highs;
}

export function part2(lines: string[]): number {
  const modules = new Modules(lines);

  const periods = modules.clocks.map(() => undefined);

  for (let i = 1; periods.some((period) => period === undefined); ++i) {
    modules.press_button();
    modules.clocks.map((clock, clock_id) => {
      if (periods[clock_id] === undefined && clock.was_all_high) {
        periods[clock_id] = i;
      }
    });
  }

  return util.lcmAll(periods);
}
