import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Tenant, TenantDocument } from '../tenants/schemas/tenant.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    @InjectModel(Tenant.name)
    private readonly tenantModel: Model<TenantDocument>,
    ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const tenant = await this.tenantModel.findById(createPaymentDto.tenantId);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const existingPayment = await this.paymentModel.findOne({
      tenantId: createPaymentDto.tenantId,
      month: createPaymentDto.month,
      year: createPaymentDto.year,
    });

    if (existingPayment) {
      throw new ConflictException(
        'Payment for this tenant and period already exists',
      );
    }

    const payment = new this.paymentModel(createPaymentDto);
    return payment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel
      .find()
      .populate('tenantId', 'name phone email roomId')
      .sort({ year: -1, month: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Payment> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel
      .findById(id)
      .populate('tenantId', 'name phone email roomId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const existingPayment = await this.paymentModel.findById(id);

    if (!existingPayment) {
      throw new NotFoundException('Payment not found');
    }

    if (updatePaymentDto.tenantId) {
      const tenant = await this.tenantModel.findById(
        updatePaymentDto.tenantId,
      );

      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }
    }

    const tenantId =
      updatePaymentDto.tenantId ?? existingPayment.tenantId.toString();

    const month = updatePaymentDto.month ?? existingPayment.month;
    const year = updatePaymentDto.year ?? existingPayment.year;

    const duplicatePayment = await this.paymentModel.findOne({
      _id: { $ne: id },
      tenantId,
      month,
      year,
    });

    if (duplicatePayment) {
      throw new ConflictException(
        'Payment for this tenant and period already exists',
      );
    }

    const payment = await this.paymentModel
      .findByIdAndUpdate(id, updatePaymentDto, {
        new: true,
        runValidators: true,
      })
      .populate('tenantId', 'name phone email roomId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async remove(id: string): Promise<Payment> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid payment ID');
    }

    const payment = await this.paymentModel.findByIdAndDelete(id).exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}