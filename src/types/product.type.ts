import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty({ message: "가격은 필수로 입력하여야 합니다." })
  @IsNumber()
  price: number;

  @IsString()
  ImgUrl?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;