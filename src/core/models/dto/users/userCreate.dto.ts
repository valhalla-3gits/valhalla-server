import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @MinLength(3)
  readonly username: string;

  @IsNotEmpty()
  @MinLength(4)
  readonly password: string;

  @IsOptional()
  readonly firstname?: string;

  @IsOptional()
  readonly lastname?: string;
}
