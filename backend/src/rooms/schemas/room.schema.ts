import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  roomNumber!: string;

  @Prop({
    required: true,
    trim: true,
  })
  type!: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;

  @Prop({
    type: [String],
    default: [],
  })
  facilities!: string[];

  @Prop({
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available',
  })
  status!: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);