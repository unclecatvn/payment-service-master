import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _request from 'request-promise';
@Injectable()
export class CaptchaSolverService {
  constructor(private readonly configService: ConfigService) {}

  async solveCaptcha(base64: string): Promise<string> {
    const captchaApiBaseUrl = this.configService.get<string>(
      'CAPTCHA_API_BASE_URL',
    );
    const captchaTextResolver = await _request.post(
      captchaApiBaseUrl + '/resolver',
      {
        form: {
          body: base64,
        },
      },
    );

    if (!captchaTextResolver.includes('OK'))
      throw new Error('Captcha error ' + captchaTextResolver);

    const captchaContent = captchaTextResolver.split('|')[1];
    return captchaContent;
  }
}
