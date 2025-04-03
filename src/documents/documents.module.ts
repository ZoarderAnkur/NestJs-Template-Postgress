/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'shared/entities/document.entity';
import { JwtAuthGuard } from 'shared/jwt-auth.guard';
import { RolesGuard } from 'shared/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DocumentsController],
  exports: [JwtAuthGuard, DocumentsService, RolesGuard],
  providers: [DocumentsService, JwtAuthGuard, RolesGuard],
})
export class DocumentsModule {}
