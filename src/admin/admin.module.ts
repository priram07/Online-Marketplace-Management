import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Tag } from './entities/tag.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AdminAuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, Tag]),
    AdminAuthModule, // dedicated auth sub-module (register/login/JWT strategy/guard)
    MailModule,
  ],
  controllers: [CategoryController, ProductController],
  providers: [CategoryService, ProductService],
})
export class AdminModule {}
