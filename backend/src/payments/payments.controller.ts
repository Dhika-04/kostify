import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Menambahkan pembayaran baru',
  })
  @ApiResponse({
    status: 201,
    description: 'Pembayaran berhasil ditambahkan',
  })
  @ApiResponse({
    status: 400,
    description: 'Data pembayaran tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Penghuni tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description:
      'Pembayaran untuk penghuni dan periode tersebut sudah ada',
  })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Menampilkan seluruh pembayaran',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar pembayaran berhasil ditampilkan',
  })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Menampilkan detail pembayaran',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId pembayaran',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Data pembayaran berhasil ditemukan',
  })
  @ApiResponse({
    status: 400,
    description: 'ID pembayaran tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Pembayaran tidak ditemukan',
  })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Mengubah data pembayaran',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId pembayaran',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Data pembayaran berhasil diperbarui',
  })
  @ApiResponse({
    status: 400,
    description: 'Data atau ID pembayaran tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Pembayaran atau penghuni tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description:
      'Pembayaran untuk penghuni dan periode tersebut sudah ada',
  })
  update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus pembayaran',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId pembayaran',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Pembayaran berhasil dihapus',
  })
  @ApiResponse({
    status: 400,
    description: 'ID pembayaran tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Pembayaran tidak ditemukan',
  })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}