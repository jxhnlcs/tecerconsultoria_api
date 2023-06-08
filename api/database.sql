CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
);

INSERT INTO users (username, password)
VALUES ('admin', '123');

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  dataNascimento DATE NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  filiacao VARCHAR(255),
  endereco VARCHAR(255) NOT NULL,
  cep VARCHAR(9) NOT NULL,
  estadoCivil VARCHAR(50) NOT NULL,
  dependentes VARCHAR(255),
  empresa VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  socio VARCHAR(255),
  enderecoEmpresa VARCHAR(255) NOT NULL,
  cepEnderecoEmpresa VARCHAR(9) NOT NULL,
  crmPJ VARCHAR(255),
  crmPF VARCHAR(255),
  vinculosPJ VARCHAR(255),
  vinculosPF VARCHAR(255),
  senhaGov VARCHAR(255),
  contribuiINSS BOOLEAN,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  instagram VARCHAR(255),
  facebook VARCHAR(255)
);

CREATE TABLE funcionario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  dataNascimento DATE NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  rg VARCHAR(20) NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE documentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  categoria VARCHAR(255),
  arquivo VARCHAR(255) NOT NULL
);
