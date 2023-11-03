import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from 'src/types/product.type';
import { ResponseType } from 'src/types/general.type';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productservice: ProductService) {}

  @Post()
  async create(@Body() body): Promise<ResponseType> {
    const result = await this.productservice.createProduct(body);
    return {
      message: '사용자가 성공적으로 생성되었습니다.',
      content: result,
    };
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file): Promise<ResponseType> {
    const ImgUrl = await this.productservice.uploadImage(file);
    return {
      message: '이미지 등록이 완료되었습니다.',
      content: ImgUrl,
    }
  }

  @Get('/:id')
  async getOneProduct(@Param('id') id: string): Promise<ResponseType> {
    const result = await this.productservice.findProduct(id);
    return {
      message: '사용자 조회 결과입니다',
      content: result,
    };
  }

  @Get()
  async getProduct(): Promise<ResponseType> {
    const result = await this.productservice.findAllProduct();
    return {
      message: '사용자 조회 결과입니다',
      content: result,
    };
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ): Promise<ResponseType> {
    const result = await this.productservice.updateProduct(id, data);
    return {
      message: '사용자 정보 수정 결과입니다.',
      content: result,
    };
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<ResponseType> {
    const result = await this.productservice.deleteProduct(id);
    return {
      message: '사용자 삭제 결과입니다.',
      content: result,
    };
  }
}
