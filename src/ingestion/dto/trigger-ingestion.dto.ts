import { IsNotEmpty, IsString } from 'class-validator';

export class TriggerIngestionDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;
}
