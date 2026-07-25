import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Room } from '../../rooms/schemas/room.schema';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({
  timestamps: true,
})
export class Tenant {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    trim: true,
  })
  phone!: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  email!: string;

  @Prop({
    type: Types.ObjectId,
    ref: Room.name,
    required: true,
  })
  roomId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  checkInDate!: Date;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status!: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);