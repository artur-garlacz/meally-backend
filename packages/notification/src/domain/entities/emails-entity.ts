import { Index, PrimaryColumn } from 'typeorm';

export class Email {
  @PrimaryColumn()
  @Index()
  emailId: string;
}
