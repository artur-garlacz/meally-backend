import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export async function toPasswordHash(password: string): Promise<string> {
  const salt = randomBytes(8).toString('hex');
  const hashedPassword = await getHashedPassword(password, salt);
  return `${salt}.${hashedPassword}`;
}

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  try {
    const [salt, hashedPassword] = passwordHash.split('.');
    const suppliedHashedPassword = await getHashedPassword(password, salt);
    return timingSafeEqual(
      Buffer.from(hashedPassword),
      Buffer.from(suppliedHashedPassword),
    );
  } catch {
    return false;
  }
}

export async function getHashedPassword(
  password: string,
  salt: string,
): Promise<string> {
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex');
}
