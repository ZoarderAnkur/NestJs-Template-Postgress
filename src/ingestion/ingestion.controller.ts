/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { JwtAuthGuard } from 'shared/jwt-auth.guard';
import { RolesGuard } from 'shared/roles.guard';
import { Roles } from 'shared/roles.decorator';
import { Role } from 'shared/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @ApiTags('Users')
  @ApiBearerAuth('x-access-token')
  @Post('trigger')
  @Roles(Role.Admin)
  trigger(
    @Body() triggerIngestionDto: TriggerIngestionDto,
    @Req() req,
  ) {
    return this.ingestionService.triggerIngestion(
      triggerIngestionDto,
      req.user,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.ingestionService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.ingestionService.findOne(id, req.user);
  }

  @Put(':id')
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateIngestionDto: UpdateIngestionDto,
    @Req() req,
  ) {
    return this.ingestionService.update(id, updateIngestionDto, req.user);
  }

  @Post('webhook/:id')
  webhookUpdate(
    @Param('id') id: string,
    @Body() updateIngestionDto: UpdateIngestionDto,
  ) {
    return this.ingestionService.webhookUpdate(id, updateIngestionDto);
  }
}
