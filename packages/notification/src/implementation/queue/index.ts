import { QueueConfig } from '@notify/utils/config';
import amqplib, { Channel, Connection } from 'amqplib';

export type QueueAssertions = 'user' | 'offer' | 'order';
export type QueueClient = {
  connection: Connection;
  channel: Channel;
};

export async function createQueueClient(config: QueueConfig) {
  // rabbitmq default port is 5672
  console.log(config);
  const amqpServer = `amqp://${config.host}:${config.port}`;
  const connection: Connection = await amqplib.connect(amqpServer);
  const channel: Channel = await connection.createChannel();

  return {
    connection,
    channel,
  };
}
