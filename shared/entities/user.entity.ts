/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Document } from './document.entity';

@Entity('JK_USERS')
export class User {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: false })
  NAME: string;

  @Column({ nullable: false, unique: true })
  EMAIL: string;

  @Column({ nullable: true })
  PHONE_NUMBER: string;

  @Column({ nullable: false })
  LOCATION: string;

  @Column({ nullable: false })
  ROLE: string;

  @Column({ nullable: false, select: false })
  PASSWORD: string;

  @Column({ nullable: false, default: false })
  EULA: boolean;

  @Column({ nullable: false, default: false })
  VERIFIED: boolean;

  @Column({ nullable: false })
  FLAG: string;

  @Column({ nullable: true })
  CREATED_BY: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'CREATED_AT',
  })
  CREATED_AT: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'MODIFIED_AT',
  })
  MODIFIED_AT: Date;

  @OneToMany(() => Document, document => document.OWNER)
DOCUMENTS: Document[];
}
