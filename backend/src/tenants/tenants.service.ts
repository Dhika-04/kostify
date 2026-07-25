import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { Room, RoomDocument } from '../rooms/schemas/room.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import {
  Payment,
  PaymentDocument,
} from '../payments/schemas/payment.schema';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>,

    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const room = await this.roomModel.findById(createTenantDto.roomId);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.status !== 'available') {
      throw new ConflictException('Room is not available');
    }

    const tenant = new this.tenantModel(createTenantDto);
    const savedTenant = await tenant.save();

    room.status = 'occupied';
    await room.save();

    return savedTenant;
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel
      .find()
      .populate('roomId', 'roomNumber type price status facilities')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Tenant> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid tenant ID');
    }

    const tenant = await this.tenantModel
      .findById(id)
      .populate('roomId', 'roomNumber type price status')
      .exec();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

 async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
    ): Promise<Tenant> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid tenant ID');
    }

    const existingTenant = await this.tenantModel.findById(id);

    if (!existingTenant) {
        throw new NotFoundException('Tenant not found');
    }

    const oldRoomId = existingTenant.roomId.toString();

    const roomChanged =
        updateTenantDto.roomId &&
        updateTenantDto.roomId !== oldRoomId;

    const becomingInactive =
        existingTenant.status === 'active' &&
        updateTenantDto.status === 'inactive';

    const becomingActive =
        existingTenant.status === 'inactive' &&
        updateTenantDto.status === 'active';

    // Jika tenant pindah kamar
    if (roomChanged) {
        const newRoom = await this.roomModel.findById(
        updateTenantDto.roomId,
        );

        if (!newRoom) {
        throw new NotFoundException('New room not found');
        }

        if (newRoom.status !== 'available') {
        throw new ConflictException(
            'New room is not available',
        );
        }

        await this.roomModel.findByIdAndUpdate(oldRoomId, {
        status: 'available',
        });

        // Kamar baru hanya occupied jika tenant aktif
        if (updateTenantDto.status !== 'inactive') {
        newRoom.status = 'occupied';
        await newRoom.save();
        }
    }

    // Tenant keluar / tidak aktif
    if (becomingInactive && !roomChanged) {
        await this.roomModel.findByIdAndUpdate(oldRoomId, {
        status: 'available',
        });
    }

    // Tenant aktif kembali
    if (becomingActive && !roomChanged) {
        const room = await this.roomModel.findById(oldRoomId);

        if (!room) {
        throw new NotFoundException('Room not found');
        }

        if (room.status !== 'available') {
        throw new ConflictException(
            'Room is not available for reactivation',
        );
        }

        room.status = 'occupied';
        await room.save();
    }

    const tenant = await this.tenantModel
        .findByIdAndUpdate(id, updateTenantDto, {
        new: true,
        runValidators: true,
        })
        .populate(
        'roomId',
        'roomNumber type price status facilities',
        )
        .exec();

    if (!tenant) {
        throw new NotFoundException('Tenant not found');
    }

    return tenant;
    }

  async remove(id: string): Promise<Tenant> {
    if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid tenant ID');
    }

    const tenant = await this.tenantModel.findById(id);

    if (!tenant) {
        throw new NotFoundException('Tenant not found');
    }

    const payments = await this.paymentModel.find().lean();

    const hasPaymentHistory = payments.some(
        (payment) =>
        payment.tenantId?.toString() === tenant._id.toString(),
    );

    if (hasPaymentHistory) {
        throw new ConflictException(
        'Tenant with payment history cannot be deleted. Set tenant status to inactive instead.',
        );
    }

    await this.roomModel.findByIdAndUpdate(tenant.roomId, {
        status: 'available',
    });

    await tenant.deleteOne();

    return tenant;
    }
}