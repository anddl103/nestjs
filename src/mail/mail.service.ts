import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ForgotPasswordFormDTO } from './dtos/forgot-password-form.dto';
import { TestMailFormDTO } from './dtos/test-mail-form.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async tempPasswordMail(
    forgotPasswordFormDTO: ForgotPasswordFormDTO,
  ): Promise<void> {
    const { toAddress, subject, username, fullName, tempPassword } =
      forgotPasswordFormDTO;
    const template = '/forgot-password';
    if (template !== undefined) {
      await this.mailerService.sendMail({
        to: toAddress,
        subject,
        template,
        context: {
          username,
          fullName,
          tempPassword,
        },
      });
    }
  }

  async testSendMail(mailFormDTO: TestMailFormDTO): Promise<void> {
    const { toAddress, subject, message } = mailFormDTO;
    const template = '/test';
    if (template !== undefined) {
      await this.mailerService.sendMail({
        to: toAddress,
        subject,
        template,
        context: {
          message,
        },
      });
    }
  }
}
