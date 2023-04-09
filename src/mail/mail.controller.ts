import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerResDTO } from '../owners/dtos/owner.res.dto';
import { OwnerRole } from '../common/enums/owner-role';
import { CommonResponseDTO } from '../common/dtos/common.res.dto';
import { TestMailFormDTO } from './dtos/test-mail-form.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('mail')
@Controller('api/v1/mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({
    summary: '이메일 발송 ( 테스트용 )',
    description: '관리자 또는 운영자 전용',
  })
  async sendMail(
    @Body() testMailFormDTO: TestMailFormDTO,
    @CurrentUser() currentOwner: OwnerResDTO,
  ) {
    const roleId = currentOwner.roleId;
    if (roleId !== OwnerRole.Admin && roleId !== OwnerRole.Manager)
      throw new UnauthorizedException(
        '관리자 혹은 운영자만 접근할 수 있습니다.',
      );

    await this.mailService.testSendMail(testMailFormDTO);
    return new CommonResponseDTO('이메일 발송', {}, {});
  }
}
