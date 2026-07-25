import {
  IsDateString,
  IsIn,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: '66a123456789abcdef123456',
    description: 'MongoDB ObjectId penghuni',
  })
  @IsMongoId()
  tenantId!: string;

  @ApiProperty({
    example: 7,
    description: 'Bulan pembayaran (1-12)',
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @ApiProperty({
    example: 2026,
    description: 'Tahun pembayaran',
    minimum: 2000,
  })
  @IsInt()
  @Min(2000)
  year!: number;

  @ApiProperty({
    example: 800000,
    description: 'Nominal pembayaran dalam Rupiah',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({
    example: 'transfer',
    description: 'Metode pembayaran',
    enum: ['cash', 'transfer'],
  })
  @IsIn(['cash', 'transfer'])
  paymentMethod!: string;

  @ApiPropertyOptional({
    example: 'paid',
    description: 'Status pembayaran',
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  })
  @IsOptional()
  @IsIn(['paid', 'unpaid'])
  status?: string;

  @ApiPropertyOptional({
    example: '2026-07-25',
    description: 'Tanggal pembayaran',
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}