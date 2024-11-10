import { ObserverHealth } from '@/services/check-health/check-health.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type LibraryResponse, Client } from 'node-mailjet';
import type { RequestData } from 'node-mailjet/declarations/request/Request';

@Injectable()
export class MailService {
  private readonly mailjet: Client;

  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = configService.getOrThrow<string>('mail.key.public');
    const apiSecret = configService.getOrThrow<string>('mail.key.private');

    this.mailjet = new Client({
      apiKey,
      apiSecret,
    });
  }

  async sendFailedHealthCheckMail(observerHealth: ObserverHealth) {
    const templateId = this.configService.getOrThrow<number>(
      'mail.templates.failedHealthCheck',
    );

    const toEmail = this.configService.getOrThrow<string>('mail.to.email');
    const toName = this.configService.getOrThrow<string>('mail.to.name');

    return this.sendMail(
      templateId,
      `Health Check Failed: ${observerHealth.observer.label}`,
      {
        observerLabel: observerHealth.observer.label,
        observerUrl: observerHealth.observer.url,
        json: JSON.stringify(observerHealth.healthCheck),
        checkedAt: new Date().toISOString(),
      },
      toEmail,
      toName,
    );
  }

  private sendMail(
    templateId: number,
    subject: string,
    variables: Record<string, unknown>,
    emailTo: string,
    nameTo: string,
    attachments?: Iterable<Record<string, string>>,
    cc?: { Email: string; Name: string }[],
  ): Promise<LibraryResponse<RequestData>> {
    const env = this.configService.get<string>('env');

    if (env !== 'production' && env !== 'staging') {
      return Promise.reject(
        `${subject} Mail didn't fire because env is not production! Current ${env}.`,
      );
    }

    const fromEmail = this.configService.getOrThrow<string>('mail.from.email');
    const fromName = this.configService.getOrThrow<string>('mail.from.name');

    try {
      return this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: emailTo,
                Name: nameTo,
              },
            ],
            TemplateID: templateId,
            TemplateLanguage: true,
            Subject: subject,
            Variables: variables,
            Attachments: attachments,
            Cc: cc,
          },
        ],
      });
    } catch (error) {
      this.logger.error(`Mail Service: ${error}`);
      return Promise.reject(error);
    }
  }
}
