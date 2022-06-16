import amqplib, { Channel, Connection } from 'amqplib';

export type QueueAssertions = 'user' | 'offer' | 'order';
export type QueueClient = {
  connection: Connection;
  channel: Channel;
};

export async function createQueueClient() {
  // rabbitmq default port is 5672
  const amqpServer = 'amqp://localhost:5672';
  const connection: Connection = await amqplib.connect(amqpServer);
  const channel: Channel = await connection.createChannel();
  // make sure that the order channel is created, if not this statement will create it
  return {
    connection,
    channel,
  };
}
