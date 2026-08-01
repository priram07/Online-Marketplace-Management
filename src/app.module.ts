import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CustomerModule } from './customer/customer.module';

@Module({
  
  imports: [ConfigModule.forRoot({ isGlobal: true }),CustomerModule, TypeOrmModule.forRoot(
{ type: 'postgres',

host: 'localhost',
port: 5432,
username: 'postgres',
password: 'poiuy',
database: 'online_marketplace',
autoLoadEntities: true,
synchronize: true,
} ),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
