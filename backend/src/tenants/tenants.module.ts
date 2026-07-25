import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { Room, RoomSchema } from '../rooms/schemas/room.schema';
import {
  Payment,
  PaymentSchema,
} from '../payments/schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
      {
        name: Room.name,
        schema: RoomSchema,
      },
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}