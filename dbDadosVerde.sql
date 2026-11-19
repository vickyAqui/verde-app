CREATE TABLE tbl_Nivel_Usuario (
  idNivel_Usuario INT PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(30) NOT NULL UNIQUE,

  CONSTRAINT chk_nivel_usuario
    CHECK (descricao IN ('comum', 'admin'))
);

CREATE TABLE tbl_Usuario (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT,
  idNivel_Usuario INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cpf CHAR(11) UNIQUE,
  dataNasc DATE,

  CONSTRAINT fk_usuario_nivel
    FOREIGN KEY (idNivel_Usuario)
    REFERENCES tbl_Nivel_Usuario(idNivel_Usuario)
);

CREATE TABLE tbl_Area (
  idArea INT PRIMARY KEY AUTO_INCREMENT,
  cidade VARCHAR(30) NOT NULL,
  bairro VARCHAR(30),
  rua VARCHAR(35) NOT NULL,
  statusArea VARCHAR(20) NOT NULL DEFAULT 'identificada',
  latitude DOUBLE,
  longitude DOUBLE,
  raio DOUBLE DEFAULT 180,
  poligono TEXT,

  CONSTRAINT chk_status_area
    CHECK (statusArea IN ('identificada', 'em tratamento', 'reflorestada'))
);

CREATE TABLE tbl_Denuncia (
  idDenuncia INT PRIMARY KEY AUTO_INCREMENT,
  idUsuario INT NOT NULL,
  idArea INT NOT NULL,
  titulo VARCHAR(35) NOT NULL,
  dataDenuncia DATE NOT NULL,
  statusDenuncia VARCHAR(20) NOT NULL DEFAULT 'aberta',
  descricao VARCHAR(100),
  fotos JSON,

  CONSTRAINT fk_denuncia_usuario
    FOREIGN KEY (idUsuario)
    REFERENCES tbl_Usuario(idUsuario),

  CONSTRAINT fk_denuncia_area
    FOREIGN KEY (idArea)
    REFERENCES tbl_Area(idArea),

  CONSTRAINT chk_status_denuncia
    CHECK (statusDenuncia IN ('aberta', 'em tratamento', 'resolvida'))
);

CREATE TABLE tbl_Tipo_Conteudo (
  idTipo_Conteudo INT PRIMARY KEY AUTO_INCREMENT,
  tipo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE tbl_Conteudo (
  idConteudo INT PRIMARY KEY AUTO_INCREMENT,
  idTipo_Conteudo INT NOT NULL,
  categoria VARCHAR(50),
  titulo VARCHAR(100),
  tempoLeitura INT,
  descricao VARCHAR(255),
  link VARCHAR(255),

  CONSTRAINT fk_conteudo_tipo
    FOREIGN KEY (idTipo_Conteudo)
    REFERENCES tbl_Tipo_Conteudo(idTipo_Conteudo)
);