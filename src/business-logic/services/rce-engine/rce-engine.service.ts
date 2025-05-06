import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LanguagesService } from '../languages/languages.service';
import axios from 'axios';
import * as process from 'node:process';
import { RceEngineResponse } from '../../../core/models/payloads/rceEngine.response.interface';

@Injectable()
export class RceEngineService {
  private readonly rce_host: string;
  private readonly rce_token: string;

  constructor(private readonly languagesService: LanguagesService) {
    const rce_host_try = process.env.RCE_ENGINE_HOST;
    if (!rce_host_try) {
      throw new InternalServerErrorException('RCE is not initialized.');
    }
    this.rce_host = rce_host_try;

    const rce_token_try = process.env.RCE_TOKEN;
    if (!rce_token_try) {
      throw new InternalServerErrorException('RCE token is not initialized.');
    }
    this.rce_token = rce_token_try;
  }

  async run(language_token: string, code: string): Promise<RceEngineResponse> {
    const language =
      await this.languagesService.getLanguageByToken(language_token);

    if (!language) {
      throw new BadRequestException('Language not found by token');
    }

    const response = await axios.post<RceEngineResponse>(
      `${this.rce_host}/run`,
      {
        image: `toolkithub/${language.image}:edge`,
        payload: {
          language: language.name.toLowerCase(),
          files: [
            {
              name: language.mainFile,
              content: code,
            },
          ],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': this.rce_token,
        },
      },
    );

    if (!response || response.status !== 200) {
      throw new InternalServerErrorException(
        'Error occured while running rce engine.',
      );
    }

    const rce_response = response.data;

    return rce_response;
  }
}
