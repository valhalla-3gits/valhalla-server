import { Request as HttpRequest } from 'express';
import { UserPayloadDto } from '../dto/users/userPayload.dto';

// Define as interface instead of type alias to ensure it's properly preserved in compiled JS
export interface AuthRequest extends HttpRequest {
  user: UserPayloadDto;
}
