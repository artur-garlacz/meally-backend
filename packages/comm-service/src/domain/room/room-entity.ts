import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity({ name: 'room' })
export class RoomEntity {
  @Index()
  @Column({ type: 'uuid' })
  roomId: string;
}

export class RoomParticipantEntity {
  @Index()
  @Column({ type: 'uuid' })
  roomParticipantId: string;

  roomId: string;

  @Column({ type: 'uuid' })
  userId: string;
}
