import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { AdminModule } from './admin/admin.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'poiuy',
      database: process.env.DB_NAME || 'online_marketplace',
      autoLoadEntities: true,
      synchronize: true, // dev only — generates tables automatically via TypeORM
    }),
    CustomerModule, // Member 1
    AdminModule, // Member 2
    SellerModule, // Member 3
  ],
})
export class AppModule {}
