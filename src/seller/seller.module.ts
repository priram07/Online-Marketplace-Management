import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Store } from './entities/store.entity';
import { Listing } from './entities/listing.entity';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { SellerAuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller, Store, Listing]),
    SellerAuthModule, // dedicated auth sub-module (register/login/JWT strategy/guard)
    MailModule,
  ],
  controllers: [SellerController, ListingController],
  providers: [SellerService, ListingService],
  exports: [SellerService],
})
export class SellerModule {}
