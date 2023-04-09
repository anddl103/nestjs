import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class DnggChpher {
  private CIPHER_KEY: string;
  private _key;
  private _iv;
  private _encode: BufferEncoding;

  constructor() {
    this.CIPHER_KEY = process.env.CIPHER_KEY;
    this._encode = 'base64';
    // this._iv = randomBytes(16);
  }

  private async init(): Promise<void> {
    if (!this._key || !this._iv) {
      this._key = (await promisify(scrypt)(
        this.CIPHER_KEY,
        'salt',
        32,
      )) as Buffer;
      this._iv = (await promisify(scrypt)(
        this.CIPHER_KEY,
        'salt',
        16,
      )) as Buffer;
    }
  }
  /**
   * 암호화
   * @param str (암호화 시킬 문자)
   * @returns (인코딩 후 문자열(base64)로 추가 인코딩 후 리턴)
   */
  async encrypt(str: string): Promise<string> {
    return this.encryptByBuffer(Buffer.from(str));
  }

  /**
   * 복호화
   * @param str (인코딩 (base64)된 문자)
   * @returns
   */
  async decrypt(str: string): Promise<string> {
    return this.decryptByBuffer(Buffer.from(str, this._encode));
  }

  private async encryptByBuffer(str: Buffer): Promise<string> {
    try {
      await this.init();
      const cipher = createCipheriv('aes-256-ctr', this._key, this._iv);
      const encryptedText = Buffer.concat([cipher.update(str), cipher.final()]);
      return encryptedText.toString(this._encode);
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('암호화 이상');
    }
  }

  private async decryptByBuffer(str: Buffer): Promise<string> {
    try {
      await this.init();
      const decipher = createDecipheriv('aes-256-ctr', this._key, this._iv);
      const decryptedText = Buffer.concat([
        decipher.update(str),
        decipher.final(),
      ]);
      return decryptedText.toString();
    } catch (error) {
      throw new UnauthorizedException('복호화 이상');
    }
  }
}
