import { Rank } from '../../entities/rank.entity';

export class RankDto {
  constructor(rank: Rank) {
    this.token = rank.token;
    this.name = rank.name;
    this.number = rank.number;
    this.value = rank.value;
    this.targetValue = rank.targetValue;
  }

  readonly token: string;
  readonly name: string;
  readonly number: number;
  readonly value: number;
  readonly targetValue: number;
}
