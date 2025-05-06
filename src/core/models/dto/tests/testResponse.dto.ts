import { RceEngineResponse } from '../../payloads/rceEngine.response.interface';

export class TestResponseDto implements RceEngineResponse {
  readonly stdout: string;
  readonly stderr: string;
  readonly error: string;
}
