import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { RanksService } from '../../../business-logic/services/ranks/ranks.service';

@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  @Get()
  async getRanks() {
    const ranks = await this.ranksService.getRanks();
    if (!ranks || !ranks.length) {
      throw new InternalServerErrorException();
    }

    return ranks;
  }
}
