import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "./module/config/config.module";
import { UserModule } from "./module/user/user.module";
import { User } from "./module/user/entity/user.entity";
import { AuthModule } from "./module/auth/auth.module";
import { ProductModule } from "./module/product/product.module";
import { Product } from "./module/product/entity/product.entity";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "database",
      username: "postgres",
      password: "1234qwer",
      database: "nestjsbackend",
      entities: [User, Product],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
