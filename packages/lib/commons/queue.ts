export enum QueueChannels {
  user = 'user',
  order = 'order',
  offer = 'offer',
}

export enum QueueCommands {
  created = 'created',
  updated = 'updated',
}

export type ConsumedChannelData<T> = {
  type: QueueCommands;
  data: T;
};

export type CreatedOrderEvent = {
  email: string;
  title: string;
  totalPrice: number;
  orderType: 'customer' | 'merchant';
};
