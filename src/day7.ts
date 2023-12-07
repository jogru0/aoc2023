function parse_card(char: string): number {
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

function evaluate(hand: number[], joker: number): number[] {
  const sorted_hand_without_jokers = [
    ...hand.filter((card) => card != joker),
  ].sort();
  const number_of_jokers = 5 - sorted_hand_without_jokers.length;

  const multiplicities = [0, 0, 0, 0, 0];
  sorted_hand_without_jokers.push(0);
  let last = sorted_hand_without_jokers[0];
  let mul = 0;
  let highest_mul = 0;
  sorted_hand_without_jokers.forEach((card) => {
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

  const tie_breaker = hand.map((card) => {
    if (card == joker) {
      return 1;
    } else {
      return card;
    }
  });

  return multiplicities.concat(tie_breaker);
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

function parse_hand_bet(line: string): [number[], number] {
  const [hand_string, bet_string] = line.split(" ");
  const hand = [...hand_string].map(parse_card);
  const bet = Number(bet_string);
  return [hand, bet];
}

function total_winnings(lines: string[], joker?: string): number {
  const evals_to_bet: [number[], number][] = lines.map((line) => {
    const [hand, bet] = parse_hand_bet(line);
    const ev = evaluate(hand, parse_card(joker));
    return [ev, bet];
  });

  evals_to_bet.sort((l, r) => eval_sort(l[0], r[0]));

  return evals_to_bet.reduce(
    (sum, eval_to_bet, i) => sum + eval_to_bet[1] * (i + 1),
    0
  );
}

export function part1(lines: string[]): number {
  return total_winnings(lines);
}

export function part2(lines: string[]): number {
  return total_winnings(lines, "J");
}
