import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'room' })
export class RoomEntity {
  @Index()
  @Column({ type: 'uuid' })
  roomId: string;
}

@Entity({ name: 'roomParticipant' })
export class RoomParticipantEntity {
  @Index()
  @Column({ type: 'uuid' })
  roomParticipantId: string;

  roomId: string;

  @Column({ type: 'uuid' })
  userId: string;
}
