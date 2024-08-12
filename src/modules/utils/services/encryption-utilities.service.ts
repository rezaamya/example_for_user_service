import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionUtilitiesService {
  public async hash(
    plainText: string,
    saltRound: number = 10,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(plainText, salt);
  }

  public async compare(
    plainText: string,
    hashedString: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedString);
  }
}
