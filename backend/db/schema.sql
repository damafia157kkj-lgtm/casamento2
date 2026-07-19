-- =========================================================
-- Site de Casamento — Script de banco de dados (MySQL)
-- Etapa 2: 2 tabelas relacionadas, PK, FK e registros de teste
-- =========================================================

USE railway;

-- ---------------------------------------------------------
-- Tabela 1: casamentos
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS casamentos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  noivo       VARCHAR(120)  NOT NULL,
  noiva       VARCHAR(120)  NOT NULL,
  data        DATE          NOT NULL,
  horario     TIME          NOT NULL,
  local       VARCHAR(160)  NOT NULL,
  cidade      VARCHAR(120)  NOT NULL,
  foto        VARCHAR(500)  NOT NULL,
  descricao   TEXT          NOT NULL,
  criado_em   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Tabela 2: itens (comidas e bebidas), relacionada a casamentos
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS itens (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  casamento_id   INT NOT NULL,
  nome           VARCHAR(120) NOT NULL,
  tipo           ENUM('comida', 'bebida') NOT NULL,
  preco          DECIMAL(8,2) NOT NULL,
  criado_em      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_itens_casamento
    FOREIGN KEY (casamento_id) REFERENCES casamentos(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Registros de teste — casamentos
-- ---------------------------------------------------------
INSERT INTO casamentos (noivo, noiva, data, horario, local, cidade, foto, descricao) VALUES
('Arthur Carvalho', 'Camila Ferraz', '2026-09-12', '17:00:00', 'Espaço Villa Jardim', 'Belo Horizonte - MG', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop', 'Uma cerimônia ao ar livre entre jardins, seguida de recepção à luz de velas.'),
('Rafael Souza', 'Beatriz Lima', '2026-10-03', '16:30:00', 'Fazenda Boa Vista', 'Contagem - MG', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop', 'Casamento rústico com decoração de campo e festa até o amanhecer.'),
('Lucas Andrade', 'Fernanda Rocha', '2026-11-21', '18:00:00', 'Salão Cristal', 'Nova Lima - MG', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop', 'Elegância clássica em salão de cristal com jantar completo.'),
('Pedro Martins', 'Larissa Costa', '2026-08-08', '15:00:00', 'Chácara Recanto Verde', 'Betim - MG', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop', 'Cerimônia intimista ao entardecer, cercada por natureza e amigos próximos.'),
('Gustavo Lima', 'Juliana Alves', '2026-12-05', '19:00:00', 'Espaço Bella Vista', 'Belo Horizonte - MG', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop', 'Festa sofisticada com decoração dourada e jantar francês.'),
('Thiago Nunes', 'Amanda Ribeiro', '2027-01-16', '17:30:00', 'Sítio das Rosas', 'Sabará - MG', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200&auto=format&fit=crop', 'Casamento ao pôr do sol com decoração romântica em tons pastel.');

-- ---------------------------------------------------------
-- Registros de teste — itens (comidas e bebidas)
-- ---------------------------------------------------------
INSERT INTO itens (casamento_id, nome, tipo, preco) VALUES
(1, 'Filé ao Molho Madeira', 'comida', 68.00),
(1, 'Risoto de Camarão', 'comida', 74.00),
(1, 'Espumante Brut', 'bebida', 45.00),
(2, 'Costela no Bafo', 'comida', 58.00),
(2, 'Caipirinha de Frutas', 'bebida', 22.00),
(2, 'Pão de Queijo Gourmet', 'comida', 24.00),
(3, 'Salmão Grelhado', 'comida', 79.00),
(3, 'Taça de Vinho Tinto', 'bebida', 32.00),
(4, 'Frango Recheado', 'comida', 52.00),
(4, 'Suco Natural de Maracujá', 'bebida', 14.00),
(5, 'Magret de Pato', 'comida', 92.00),
(5, 'Champagne Francês', 'bebida', 120.00),
(6, 'Camarão na Moranga', 'comida', 71.00),
(6, 'Drink Rosé Sunset', 'bebida', 28.00);