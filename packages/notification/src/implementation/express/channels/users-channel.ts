import { UserEntity } from '@app/modules/users/domain/entities';
import { AppServices } from '@notify/implementation/app-services';
import { QueueChannels } from '@lib/commons/queue';
import { transformToClass } from '@lib/utils/validation';

export const userChannel = async (app: AppServices) => {
  const { channel } = app.queueClient;

  await channel.assertQueue(QueueChannels.user, { durable: true });

  await channel.consume(QueueChannels.user, async (data) => {
    console.log(`Received ${Buffer.from(data!.content)}`);

    if (data) {
      const user: UserEntity = JSON.parse(data.content.toString('utf-8'));

      const mailOptions = {
        from: '"Meally" <garlacz.artur@gmail.com>',
        to: user.email,
        subject: 'Welcome!',
        template: 'welcome-mail',
        context: {
          name: 'Archie',
        },
      };

      app.mailClient.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
    }

    channel.ack(data!);
  });
};
