export class RegisterDto {
  email!: string;
  password!: string;
  username?: string;
}
export class LoginDto {
  email!: string;
  password!: string;
}
export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;
}
