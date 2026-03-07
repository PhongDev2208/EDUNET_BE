import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { getJwtSecret } from '../constant';
import { User } from 'src/user/entities/user.entity';

export class JwtService {
  constructor() {}

  generateJwtToken = (user: User): string => {
    const secret = Buffer.from(getJwtSecret(), 'base64');
    const payload = {
      email: user.email.trim().toLowerCase(),
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(
      payload,
      secret,
      {
        expiresIn: 86400, // expires in 24 hours
      },
    );
    return token;
  };

  generateRefreshToken = async () => {
    const randomUUID = crypto.randomUUID();
    return await bcrypt.hash(randomUUID, 10);
  };

  /**
   * Authenticate the user using a JWT token.
   * @param token - The JWT token provided by the user.
   * @returns The decoded payload of the JWT token.
   */
  decodeJwtToken = (token: string): string | JwtPayload => {
    const secret = Buffer.from(getJwtSecret(), 'base64');
    return jwt.verify(token.replace('Bearer ', ''), secret);
  };

  /**
   * Hashes a password using bcrypt.
   */
  generateHashedPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  /**
   * Check if a plain text password matches a hashed password.
   */
  checkPasswordMatch = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  };
}
