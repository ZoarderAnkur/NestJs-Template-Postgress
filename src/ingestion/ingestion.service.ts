/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
import { UpdateIngestionDto } from './dto/update-ingestion.dto';
import { DocumentsService } from '../documents/documents.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Ingestion } from 'shared/entities/ingestion.entity';
import { User } from 'shared/entities/user.entity';
import { IngestionStatus } from 'shared/ingestion-status.enum';

@Injectable()
export class IngestionService {
  private pythonClient;

  constructor(
    @InjectRepository(Ingestion)
    private ingestionRepository: Repository<Ingestion>,
    private documentsService: DocumentsService,
  ) {
    this.pythonClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001, // Python microservice port
      },
    });
  }

  async triggerIngestion(triggerIngestionDto: TriggerIngestionDto, user: User): Promise<Ingestion> {
    const document = await this.documentsService.findOne(triggerIngestionDto.documentId, user);

    const ingestion = this.ingestionRepository.create({
      STATUS: IngestionStatus.PENDING,
      INITIATEDBY: user,
      DOCUMENT: document,
    });

    const savedIngestion = await this.ingestionRepository.save(ingestion);

    // Send to Python microservice
    this.pythonClient.emit('ingestion_triggered', {
      ingestionId: savedIngestion.ID,
      documentPath: document.PATH,
    });

    return savedIngestion;
  }

  async findAll(user: User): Promise<Ingestion[]> {
    return this.ingestionRepository.find({ 
      where: { INITIATEDBY: { ID: user.ID } },
      relations: ['DOCUMENT', 'INITIATEDBY'],
    });
  }

  async findOne(ID: string, user: User): Promise<Ingestion> {
    const ingestion = await this.ingestionRepository.findOne({ 
      where: { ID, INITIATEDBY: { ID: user.ID } },
      relations: ['DOCUMENT', 'INITIATEDBY'],
    });
    if (!ingestion) {
      throw new NotFoundException('Ingestion not found');
    }
    return ingestion;
  }

  async update(id: string, updateIngestionDto: UpdateIngestionDto, user: User): Promise<Ingestion> {
    const ingestion = await this.findOne(id, user);
    
    if (updateIngestionDto.status === IngestionStatus.COMPLETED) {
      ingestion.COMPLETEDAT = new Date();
    }

    Object.assign(ingestion, updateIngestionDto);
    return this.ingestionRepository.save(ingestion);
  }

  async webhookUpdate(ID: string, updateIngestionDto: UpdateIngestionDto): Promise<Ingestion> {
    const ingestion = await this.ingestionRepository.findOne({ where: { ID } });
    if (!ingestion) {
      throw new NotFoundException('Ingestion not found');
    }

    if (updateIngestionDto.status === IngestionStatus.COMPLETED) {
      ingestion.COMPLETEDAT = new Date();
    }

    Object.assign(ingestion, updateIngestionDto);
    return this.ingestionRepository.save(ingestion);
  }
}