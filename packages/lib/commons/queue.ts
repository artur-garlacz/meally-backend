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
  type: typeof QueueCommands;
  data: T;
};
