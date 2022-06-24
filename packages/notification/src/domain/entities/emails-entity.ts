import { Column, Index, PrimaryColumn } from 'typeorm';

export class Email {
  @PrimaryColumn()
  @Index()
  emailId: string;

  @Column()
  sendTo: string;

  @Column()
  createdAt: Date;

  @Column()
  erroredAt: Date;

  @Column()
  sentAt: Date;

  @Column()
  userId: string;
}
