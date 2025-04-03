/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from 'shared/entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from 'shared/entities/user.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
    userPayload: User,
  ): Promise<Document> {
    const user = await this.documentsRepository.manager
      .getRepository(User)
      .findOne({
        where: { EMAIL: userPayload.EMAIL },
      });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const document = this.documentsRepository.create({
      TITLE: createDocumentDto.title,
      FILENAME: file.originalname,
      PATH: file.path,
      MIMETYPE: file.mimetype,
      SIZE: file.size,
      OWNER: user,
    });

    return this.documentsRepository.save(document);
  }

  async findAll(user: User): Promise<Document[]> {
    return this.documentsRepository.find({ where: { OWNER: { ID: user.ID } } });
  }

  async findByOwner(userPayload: User): Promise<Document[]> {
    const user = await this.documentsRepository.manager
      .getRepository(User)
      .findOne({
        where: { EMAIL: userPayload.EMAIL },
      });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const documents = await this.documentsRepository.find({
      where: { OWNER: { ID: user.ID } },
    });

    if (!documents || documents.length === 0) {
      throw new NotFoundException('No documents found for this user');
    }

    return documents;
  }

  async findOne(ID: any, userPayload: User): Promise<Document> {
    const user = await this.documentsRepository.manager
      .getRepository(User)
      .findOne({
        where: { EMAIL: userPayload.EMAIL },
      });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const document = await this.documentsRepository.findOne({
      where: { ID, OWNER: { ID: user.ID } },
      relations: ['OWNER'],
    });
    if (!document) {
      throw new NotFoundException(
        'Document not found or the document not belongs to the user',
      );
    }
    return document;
  }

  async remove(ID: string, user: User) {
    const document = await this.findOne(ID, user);
    const result = await this.documentsRepository.remove(document);
    if (result) {
      return {
        statusCode: 200,
        message: 'Document deleted successfully',
      };
    }
  }
}
