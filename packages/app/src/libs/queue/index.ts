import amqplib, { Channel, Connection } from 'amqplib';

import { QueueConfig } from '../utils/config';

export type QueueAssertions = 'user' | 'offer' | 'order';
export type QueueClient = {
  connection: Connection;
  channel: Channel;
};

export async function createQueueClient(
  config: QueueConfig,
): Promise<QueueClient> {
  // rabbitmq default port is 5672

  const amqpServer = `amqp://${config.host}:${config.port}`;
  const connection: Connection = await amqplib.connect(amqpServer);
  const channel: Channel = await connection.createChannel();

  // make sure that the order channel is created, if not this statement will create it
  return {
    connection,
    channel,
  };
}
