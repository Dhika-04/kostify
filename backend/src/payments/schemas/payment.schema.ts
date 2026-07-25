import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tenant } from '../../tenants/schemas/tenant.schema';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
  timestamps: true,
})
export class Payment {
  @Prop({
    type: Types.ObjectId,
    ref: Tenant.name,
    required: true,
  })
  tenantId!: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
    max: 12,
  })
  month!: number;

  @Prop({
    required: true,
    min: 2000,
  })
  year!: number;

  @Prop({
    required: true,
    min: 0,
  })
  amount!: number;

  @Prop({
    enum: ['cash', 'transfer'],
    required: true,
  })
  paymentMethod!: string;

  @Prop({
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  })
  status!: string;

  @Prop({
    default: null,
  })
  paymentDate?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);