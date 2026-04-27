<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260427121212 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE operation_categories (operation_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_746429B544AC3583 (operation_id), INDEX IDX_746429B512469DE2 (category_id), PRIMARY KEY (operation_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE operation_categories ADD CONSTRAINT FK_746429B544AC3583 FOREIGN KEY (operation_id) REFERENCES operation (id)');
        $this->addSql('ALTER TABLE operation_categories ADD CONSTRAINT FK_746429B512469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('INSERT INTO operation_categories (operation_id, category_id) SELECT id, category_id FROM operation WHERE category_id IS NOT NULL');
        $this->addSql('ALTER TABLE operation DROP FOREIGN KEY `FK_1981A66D12469DE2`');
        $this->addSql('DROP INDEX IDX_1981A66D12469DE2 ON operation');
        $this->addSql('ALTER TABLE operation DROP category_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE operation_categories DROP FOREIGN KEY FK_746429B544AC3583');
        $this->addSql('ALTER TABLE operation_categories DROP FOREIGN KEY FK_746429B512469DE2');
        $this->addSql('DROP TABLE operation_categories');
        $this->addSql('ALTER TABLE operation ADD category_id INT NOT NULL');
        $this->addSql('ALTER TABLE operation ADD CONSTRAINT `FK_1981A66D12469DE2` FOREIGN KEY (category_id) REFERENCES category (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_1981A66D12469DE2 ON operation (category_id)');
    }
}
