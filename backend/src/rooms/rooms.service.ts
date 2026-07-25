import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  async findAll(): Promise<Room[]> {
    return this.roomModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Room> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid room ID');
    }

    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid room ID');
    }

    const existingRoom = await this.roomModel.findById(id).exec();

    if (!existingRoom) {
        throw new NotFoundException('Room not found');
    }

    if (
        existingRoom.status === 'occupied' &&
        updateRoomDto.status &&
        updateRoomDto.status !== 'occupied'
    ) {
        throw new ConflictException(
        'Occupied room status cannot be changed manually',
        );
    }

    const room = await this.roomModel
        .findByIdAndUpdate(id, updateRoomDto, {
        new: true,
        runValidators: true,
        })
        .exec();

    if (!room) {
        throw new NotFoundException('Room not found');
    }

    return room;
    }

  async remove(id: string): Promise<Room> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid room ID');
    }

    const room = await this.roomModel.findById(id).exec();

    if (!room) {
        throw new NotFoundException('Room not found');
    }

    if (room.status === 'occupied') {
        throw new ConflictException(
        'Occupied room cannot be deleted',
        );
    }

    await room.deleteOne();

    return room;
    }
}