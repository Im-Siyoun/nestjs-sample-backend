import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Product } from "./entity/product.entity";
import { CreateProductDto, UpdateProductDto } from "../../types/product.type";
import "dotenv";
import * as AWS from "aws-sdk";
import { EnviromentVariables } from "../config/config.validation";
import { ConfigService } from "@nestjs/config";

export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configservice: ConfigService<EnviromentVariables>
  ) {}

  async uploadImage(file): Promise<any> {
    AWS.config.update({
      region: "ap-northeast-2",
      credentials: {
        accessKeyId: this.configservice.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configservice.get('AWS_SECRET_KEY'),
      },
    });
    try {
      const params = {
        Key: `${Date.now() + file.originalname}`,
        Bucket: "imageuploadserver",
      };
      await new AWS.S3()
        .putObject({
          ...params,
          Body: file.buffer,
        })
        .promise();
      const url = await new AWS.S3().getSignedUrl("getObject", params);
      return url.split("?")[0];
    } catch (e) {
      console.log(e);
    }
  }

  createProduct(data): Promise<any> {
    return this.productRepository.save(data);
  }

  findProduct(data: string): Promise<Product> {
    return this.productRepository.findOneBy({ id: data });
  }

  findAllProduct(): Promise<Product[]> {
    return this.productRepository.find();
  }

  deleteProduct(data: string): Promise<DeleteResult> {
    return this.productRepository.delete({ id: data });
  }

  updateProduct(id: string, data: UpdateProductDto): Promise<UpdateResult> {
    return this.productRepository.update({ id: id }, data);
  }
}
