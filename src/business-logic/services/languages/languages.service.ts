import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LANGUAGES_REPOSITORY } from '../../../core/constants';
import { Language } from '../../../core/models/entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @Inject(LANGUAGES_REPOSITORY)
    private readonly languagesRepository: typeof Language,
  ) {}

  async getLanguages(): Promise<Language[] | null> {
    let languages = await this.languagesRepository.findAll<Language>();
    if (languages.length === 0) {
      throw new NotFoundException('No languages found');
    }
    return languages;
  }

  async getLanguageByToken(token: string): Promise<Language> {
    const language = await this.languagesRepository.findOne({
      where: {
        token: token,
      },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  async getLanguageById(language_id: string) {
    const language = await this.languagesRepository.findOne({
      where: {
        id: language_id,
      },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }
}
