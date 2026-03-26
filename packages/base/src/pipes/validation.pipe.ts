import { ValidationPipe, ValidationPipeOptions } from "@nestjs/common";

export const defaultValidationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
};

export function createValidationPipe(
  overrides: ValidationPipeOptions = {},
): ValidationPipe {
  return new ValidationPipe({ ...defaultValidationPipeOptions, ...overrides });
}
