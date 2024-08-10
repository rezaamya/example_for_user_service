import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtilitiesService {
  public sanitize(email: string): string {
    let sanitizedEmail = email;

    if (email && email.includes('gmail.com')) {
      const emailParts = email.split('@');
      if (
        emailParts[0] &&
        (emailParts[0].includes('.') || emailParts[0].includes('+'))
      ) {
        const emailWithoutPlus = emailParts[0].split('+');
        sanitizedEmail =
          emailWithoutPlus[0].replaceAll('.', '') + '@' + emailParts[1];
      }
    }

    return sanitizedEmail;
  }
}
