/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from 'shared/jwt-auth.guard';
import { RolesGuard } from 'shared/roles.guard';
import { Ingestion } from 'shared/entities/ingestion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentsModule } from 'src/documents/documents.module';
// import { DocumentsService } from 'src/documents/documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingestion]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    DocumentsModule,
  ],
  controllers: [IngestionController],
  exports: [JwtAuthGuard, RolesGuard],
  providers: [IngestionService, JwtAuthGuard, RolesGuard],
})
export class IngestionModule {}
