function parse_card_part_1(char: string): number {
  switch (char) {
    case "T":
      return 10;
    case "J":
      return 11;
    case "Q":
      return 12;
    case "K":
      return 13;
    case "A":
      return 14;
    default: {
      return Number(char);
    }
  }
}

function parse_card_part_2(char: string): number {
  switch (char) {
    case "T":
      return 10;
    case "J":
      return 1;
    case "Q":
      return 12;
    case "K":
      return 13;
    case "A":
      return 14;
    default: {
      return Number(char);
    }
  }
}

function evaluate_part_1(hand: number[]): number[] {
  const multiplicities = [0, 0, 0, 0];

  const sorted = [...hand].sort();
  sorted.push(0);

  let last = 0;
  let mul = 0;
  sorted.forEach((card) => {
    if (card != last) {
      if (2 <= mul) {
        ++multiplicities[5 - mul];
      }
      last = card;
      mul = 1;
    } else {
      ++mul;
    }
  });

  return multiplicities.concat(hand);
}

function evaluate_part_2(hand: number[]): number[] {
  const multiplicities = [0, 0, 0, 0, 0];

  const sorted = [...hand.filter((card) => card != 1)].sort();
  const number_of_jokers = 5 - sorted.length;
  sorted.push(0);

  let last = sorted[0];
  let mul = 0;
  let highest_mul = 0;
  sorted.forEach((card) => {
    if (card != last) {
      ++multiplicities[5 - mul];
      last = card;
      highest_mul = Math.max(mul, highest_mul);
      mul = 1;
    } else {
      ++mul;
    }
  });

  if (highest_mul != 0) {
    --multiplicities[5 - highest_mul];
  }
  ++multiplicities[5 - highest_mul - number_of_jokers];

  return multiplicities.concat(hand);
}

function eval_sort(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; ++i) {
    const aa = a[i];
    const bb = b[i];
    const cmp = aa - bb;
    if (cmp != 0) {
      return cmp;
    }
  }

  return 0;
}

function parse_hand_bet_part_1(line: string): [number[], number] {
  const [hand_string, bet_string] = line.split(" ");
  const hand = [...hand_string].map(parse_card_part_1);
  const bet = Number(bet_string);
  return [hand, bet];
}

function parse_hand_bet_part_2(line: string): [number[], number] {
  const [hand_string, bet_string] = line.split(" ");
  const hand = [...hand_string].map(parse_card_part_2);
  const bet = Number(bet_string);
  return [hand, bet];
}

export function part1(lines: string[]): number {
  const evals_to_bet: [number[], number][] = lines.map((line) => {
    const [hand, bet] = parse_hand_bet_part_1(line);

    const ev = evaluate_part_1(hand);
    return [ev, bet];
  });

  evals_to_bet.sort((l, r) => eval_sort(l[0], r[0]));

  return evals_to_bet.reduce(
    (sum, eval_to_bet, i) => sum + eval_to_bet[1] * (i + 1),
    0
  );
}

export function part2(lines: string[]): number {
  const evals_to_bet: [number[], number][] = lines.map((line) => {
    const [hand, bet] = parse_hand_bet_part_2(line);

    const ev = evaluate_part_2(hand);
    return [ev, bet];
  });

  evals_to_bet.sort((l, r) => eval_sort(l[0], r[0]));

  return evals_to_bet.reduce(
    (sum, eval_to_bet, i) => sum + eval_to_bet[1] * (i + 1),
    0
  );
}
