import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Document } from './document.entity';
import { IngestionStatus } from '../ingestion-status.enum';

@Entity('JK_INGESTION')
@Entity()
export class Ingestion {
  @PrimaryGeneratedColumn()
  ID: string;

  @Column({
    type: 'enum',
    enum: IngestionStatus,
    default: IngestionStatus.PENDING,
  })
  STATUS: IngestionStatus;

  @Column({ nullable: true })
  MESSAGE: string;

  @ManyToOne(() => User)
  INITIATEDBY: User;

  @ManyToOne(() => Document)
  DOCUMENT: Document;

  @CreateDateColumn()
  STARTEDAT: Date;

  @UpdateDateColumn()
  UPDATEDAT: Date;

  @Column({ nullable: true })
  COMPLETEDAT: Date;
}
