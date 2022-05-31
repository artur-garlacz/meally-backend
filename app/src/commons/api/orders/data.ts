export enum OrderStatus {
  created = 'created',
  accepted = 'accepted',
  prepared = 'prepared',
  delivered = 'delivered',
  rejected = 'rejected',
}

export type OrderStatusType = keyof typeof OrderStatus;
