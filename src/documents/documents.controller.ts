/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'shared/jwt-auth.guard';
import { RolesGuard } from 'shared/roles.guard';
import { Roles } from 'shared/roles.decorator';
import { Role } from 'shared/role.enum';

@Controller('documents')
@UseGuards()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req,
  ) {
    return this.documentsService.create(createDocumentDto, file, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  findAll(@Req() req) {
    return this.documentsService.findAll(req.user);
  }

  @Get('owner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  findOne(@Req() req) {
    return this.documentsService.findByOwner(req.user);
  }

  @Delete(':ID')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  remove(@Param('ID') ID: string, @Req() req) {
    console.log(ID);
    return this.documentsService.remove(ID, req.user);
  }
}
