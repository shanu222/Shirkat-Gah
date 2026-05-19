import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private ses: SESClient | null = null;
  private fromEmail: string;

  constructor(private config: ConfigService) {
    this.fromEmail = config.get('SES_FROM_EMAIL', 'noreply@shirkatgah.org');

    if (config.get('NODE_ENV') === 'production' || config.get('AWS_SES_ENABLED') === 'true') {
      this.ses = new SESClient({
        region: config.get('AWS_REGION', 'ap-south-1'),
      });
    }
  }

  async sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
    if (!this.ses) {
      this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
      return { messageId: 'dev-mode' };
    }

    const params: SendEmailCommandInput = {
      Source: this.fromEmail,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
          ...(textBody && { Text: { Data: textBody, Charset: 'UTF-8' } }),
        },
      },
    };

    const result = await this.ses.send(new SendEmailCommand(params));
    this.logger.log(`Email sent to ${to}: ${result.MessageId}`);
    return { messageId: result.MessageId };
  }

  async sendPasswordReset(to: string, resetUrl: string, firstName: string) {
    return this.sendEmail(
      to,
      'Reset Your Shirkat Gah Password',
      `<h1>Hello ${firstName}</h1><p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
      `Hello ${firstName}, reset your password: ${resetUrl}`,
    );
  }

  async sendWelcome(to: string, firstName: string) {
    return this.sendEmail(
      to,
      'Welcome to Shirkat Gah Platform',
      `<h1>Welcome ${firstName}!</h1><p>Your account has been created on the Shirkat Gah Digital Platform.</p>`,
    );
  }
}
