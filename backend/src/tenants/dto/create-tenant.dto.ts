import {
  IsDateString,
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    example: 'Andi Saputra',
    description: 'Nama lengkap penghuni',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: '081234567890',
    description: 'Nomor telepon penghuni',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: 'andi@example.com',
    description: 'Alamat email penghuni',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '66a123456789abcdef123456',
    description: 'MongoDB ObjectId kamar yang ditempati',
  })
  @IsMongoId()
  roomId!: string;

  @ApiProperty({
    example: '2026-07-25',
    description: 'Tanggal check-in penghuni',
  })
  @IsDateString()
  checkInDate!: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Status penghuni',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}