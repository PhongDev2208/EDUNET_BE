import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Đồng bộ entities với schema database:
 * - User: name → firstName/lastName, phoneNumber → phone, thêm socialLinks
 * - Session: expiredAt → expiresAt, revoked → isRevoked, device fields → userAgent/ipAddress
 * - PasswordReset: bảng PasswordResetTokens → PasswordResets, các cột đổi tên
 * Migration này đã được áp dụng — schema hiện tại đã khớp.
 */
export class SyncEntitiesWithSchema1741334400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Các thay đổi đã được áp dụng trong InitialSchema
    // Migration này giữ lại để tracking lịch sử
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Không revert vì InitialSchema đã bao gồm schema mới nhất
  }
}
