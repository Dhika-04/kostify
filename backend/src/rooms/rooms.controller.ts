import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({
    summary: 'Menambahkan kamar baru',
  })
  @ApiResponse({
    status: 201,
    description: 'Kamar berhasil ditambahkan',
  })
  @ApiResponse({
    status: 400,
    description: 'Data kamar tidak valid',
  })
  @ApiResponse({
    status: 409,
    description: 'Nomor kamar sudah digunakan',
  })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Menampilkan seluruh kamar',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar kamar berhasil ditampilkan',
  })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Menampilkan detail kamar',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId kamar',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Data kamar berhasil ditemukan',
  })
  @ApiResponse({
    status: 404,
    description: 'Kamar tidak ditemukan',
  })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Mengubah data kamar',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId kamar',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Data kamar berhasil diperbarui',
  })
  @ApiResponse({
    status: 400,
    description: 'Data kamar tidak valid',
  })
  @ApiResponse({
    status: 404,
    description: 'Kamar tidak ditemukan',
  })
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus kamar',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId kamar',
    example: '66a123456789abcdef123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Kamar berhasil dihapus',
  })
  @ApiResponse({
    status: 404,
    description: 'Kamar tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description: 'Kamar tidak dapat dihapus karena sedang digunakan',
  })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}