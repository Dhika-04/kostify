import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    example: 'A-01',
    description: 'Nomor unik kamar',
  })
  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

  @ApiProperty({
    example: 'Standard',
    description: 'Tipe kamar',
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({
    example: 800000,
    description: 'Harga sewa kamar per bulan',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    example: ['Kasur', 'Lemari', 'WiFi'],
    description: 'Daftar fasilitas kamar',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @ApiPropertyOptional({
    example: 'available',
    description: 'Status kamar',
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available',
  })
  @IsOptional()
  @IsIn(['available', 'occupied', 'maintenance'])
  status?: string;
}