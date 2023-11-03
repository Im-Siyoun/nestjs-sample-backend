import { plainToInstance } from "class-transformer"
import { IsString, validateSync } from "class-validator";

export class EnviromentVariables {
  @IsString()
  AWS_ACCESS_KEY: string;

  @IsString()
  AWS_SECRET_KEY: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validateConfig = plainToInstance(
    EnviromentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validateConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validateConfig;
}