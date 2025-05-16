import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { RanksService } from '../../../business-logic/services/ranks/ranks.service';
import { LanguagesService } from '../../../business-logic/services/languages/languages.service';

@Controller('meta')
export class MetaController {
  constructor(
    private readonly ranksService: RanksService,
    private readonly languagesService: LanguagesService
  ) {}

  @Get('ranks')
  async getRanks() {
    const ranks = await this.ranksService.getRanks();
    if (!ranks || !ranks.length) {
      throw new InternalServerErrorException();
    }

    return ranks;
  }

  @Get('languages')
  async getLanguages() {
    const languages = await this.languagesService.getLanguages();
    if (!languages || !languages.length) {
      throw new InternalServerErrorException();
    }

    return languages;
  }
}