import { Language } from '../../entities/language.entity';

export class LanguageDto {
  constructor(language: Language) {
    this.token = language.token;
    this.name = language.name;
    this.shortName = language.shortName;
  }

  readonly token: string;
  readonly name: string;
  readonly shortName: string;
}
