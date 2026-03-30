import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Email некорректен" })
  email!: string;

  @IsString()
  @MinLength(6, { message: "Пароль должен быть не менее 6 символов" })
  @MaxLength(100, { message: "Пароль слишком длинный" })
  password!: string;

  @IsString()
  @MinLength(3, { message: "Юзернейм должен быть не менее 3 символов" })
  @MaxLength(30, { message: "Юзернейм слишком длинный" })
  username!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40, { message: "Имя слишком длинное" })
  name?: string;
}

export class LoginDto {
  @IsEmail({}, { message: "Email некорректен" })
  email!: string;

  @IsString()
  password!: string;
}

export class LogoutDto {
  @IsString()
  refreshToken!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
}
