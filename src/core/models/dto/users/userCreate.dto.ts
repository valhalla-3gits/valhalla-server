import { IsNotEmpty, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @MinLength(4)
  readonly password: string;
}
