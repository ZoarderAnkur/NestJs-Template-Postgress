import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IngestionStatus } from 'shared/ingestion-status.enum';

export class UpdateIngestionDto {
  @IsOptional()
  @IsEnum(IngestionStatus)
  status?: IngestionStatus;

  @IsOptional()
  @IsString()
  message?: string;
}
