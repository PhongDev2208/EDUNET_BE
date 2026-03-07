import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixContractIdSchemaPackages1772808019839
  implements MigrationInterface
{
  private readonly schema = process.env.DATABASE_SCHEMA || 'dev_local';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.schema}"."Packages"
      ADD COLUMN IF NOT EXISTS "contractId" uuid NULL;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_Packages_contractId'
        ) THEN
          ALTER TABLE "${this.schema}"."Packages"
          ADD CONSTRAINT "FK_Packages_contractId"
          FOREIGN KEY ("contractId") REFERENCES "${this.schema}"."Contracts"("id")
          ON DELETE SET NULL;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.schema}"."Packages"
      DROP CONSTRAINT IF EXISTS "FK_Packages_contractId";
    `);

    await queryRunner.query(`
      ALTER TABLE "${this.schema}"."Packages"
      DROP COLUMN IF EXISTS "contractId";
    `);
  }
}