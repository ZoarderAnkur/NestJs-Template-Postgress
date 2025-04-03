/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('JK_DOCUMENTS')
export class Document {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  TITLE: string;

  @Column()
  FILENAME: string;

  @Column()
  PATH: string;

  @Column()
  MIMETYPE: string;

  @Column()
  SIZE: number;

  @ManyToOne(() => User, (user) => user.ID)
  @JoinColumn({ name: 'OWNER' })
  OWNER: User;

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
  UPDATEDAT: Date;
}
