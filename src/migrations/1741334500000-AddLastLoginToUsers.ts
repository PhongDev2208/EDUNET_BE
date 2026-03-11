import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Thêm cột lastLogin vào bảng Users
 * Cột đã được bao gồm trong InitialSchema — migration này giữ lại để tracking.
 */
export class AddLastLoginToUsers1741334500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Đã bao gồm trong InitialSchema migration
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Không revert
  }
}
