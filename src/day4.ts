import * as util from "./util";

class Card {
  winning: number[];
  you_have: number[];

  constructor(winning: number[], you_have: number[]) {
    this.winning = winning;
    this.you_have = you_have;
  }

  number_of_winners() {
    return this.winning.filter((win) => this.you_have.includes(win)).length;
  }

  worth(): number {
    const number_of_winners = this.number_of_winners();

    if (number_of_winners == 0) {
      return 0;
    } else {
      return 2 ** (number_of_winners - 1);
    }
  }
}

function parse_card(line: string): Card {
  const matrix = util
    .behind(line, ":")
    .split("|")
    .map(util.parse_number_sequence);

  return new Card(matrix[0], matrix[1]);
}

export function part1(lines: string[]): number {
  return lines.map(parse_card).reduce((sum, card) => sum + card.worth(), 0);
}

export function part2(lines: string[]): number {
  const cards = lines.map((line): [Card, number] => [parse_card(line), 1]);

  cards.forEach((card, index) => {
    const copies = card[1];
    const number_of_winners = card[0].number_of_winners();
    for (let i = index + 1; i < index + number_of_winners + 1; ++i) {
      cards[i][1] += copies;
    }
  });

  return cards.reduce((sum, card) => (sum += card[1]), 0);
}
