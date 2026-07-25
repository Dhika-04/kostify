import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({
    summary: 'Menambahkan penghuni baru',
  })
  @ApiResponse({
    status: 201,
    description: 'Penghuni berhasil ditambahkan',
  })
  @ApiResponse({
    status: 400,
    description: 'Data penghuni tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Kamar tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description: 'Kamar tidak tersedia',
  })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Menampilkan seluruh penghuni',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar penghuni berhasil ditampilkan',
  })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Menampilkan detail penghuni',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId penghuni',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Data penghuni berhasil ditemukan',
  })
  @ApiResponse({
    status: 400,
    description: 'ID penghuni tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Penghuni tidak ditemukan',
  })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Mengubah data penghuni',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId penghuni',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Data penghuni berhasil diperbarui',
  })
  @ApiResponse({
    status: 400,
    description: 'Data atau ID penghuni tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Penghuni atau kamar tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description: 'Kamar tujuan tidak tersedia',
  })
  update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus penghuni',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId penghuni',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Penghuni berhasil dihapus',
  })
  @ApiResponse({
    status: 400,
    description: 'ID penghuni tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Penghuni tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description:
      'Penghuni memiliki riwayat pembayaran dan tidak dapat dihapus',
  })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}