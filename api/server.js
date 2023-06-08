const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const port = 3000;

app.use(express.json());
app.use(cors());

// Configurações do banco de dados
const db = mysql.createConnection({
  host: 'database.ctk3skro8xoh.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'database',
  multipleStatements: true
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso');
});

// Rota para o login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consulta ao banco de dados
  db.query(
    'SELECT username, password FROM users WHERE username = ? AND password = ? UNION SELECT username, password FROM funcionario WHERE username = ? AND password = ?',
    [username, password, username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else if (results.length === 0) {
        res.status(401).json({ message: 'Credenciais inválidas' });
      } else {
        res.json({ message: 'Login bem-sucedido' });
      }
    }
  );
});

// Rota para verificar se o CPF ou CNPJ já estão cadastrados
app.get('/clientes', (req, res) => {
  const { cpf, cnpj } = req.query;

  // Consulta ao banco de dados
  db.query(
    'SELECT * FROM cliente WHERE cpf = ? OR cnpj = ?',
    [cpf, cnpj],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

// Rota para cadastrar cliente
app.post('/clientes', (req, res) => {
  const cliente = req.body;

  // Consulta ao banco de dados para inserir o cliente
  db.query('INSERT INTO cliente SET ?', cliente, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.status(201).json({ message: 'Cliente cadastrado com sucesso' });
    }
  });
});

// Rota para verificar se o CPF ou RG já estão cadastrados
app.get('/funcionarios', (req, res) => {
  const { cpf, rg } = req.query;

  // Consulta ao banco de dados
  db.query(
    'SELECT * FROM funcionario WHERE cpf = ? OR rg = ?',
    [cpf, rg],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});


// Rota para cadastrar funcionário
app.post('/funcionarios', (req, res) => {
  const funcionario = req.body;

  // Inserir o funcionário na tabela 'funcionario'
  db.query('INSERT INTO funcionario SET ?', funcionario, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.status(201).json({ message: 'Funcionário cadastrado com sucesso' });
    }
  });
});

// Rota para obter a lista de clientes
app.get('/buscarClientes', (req, res) => {
  // Consulta ao banco de dados para obter a lista de clientes
  db.query('SELECT id, nome FROM cliente', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      const clientes = results.map(result => result);
      res.json(clientes);
    }
  });
});

const multer = require('multer');

// Configuração do Multer para salvar os arquivos no disco
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Rota para cadastrar documento
app.post('/documentos', upload.single('arquivo'), (req, res) => {
  const documento = req.body;
  const arquivo = req.file;

  // Construir o link completo para o arquivo
  const fileLink = `${req.protocol}://${req.get('host')}/uploads/${arquivo.filename}`;

  // Consulta ao banco de dados para inserir o documento
  db.query(
    'INSERT INTO documentos (cliente_id, nome, data, hora, categoria_id, arquivo) VALUES (?, ?, ?, ?, ?, ?)',
    [documento.cliente, documento.nome, documento.data, documento.hora, documento.categoria, fileLink],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.status(201).json({ message: 'Documento cadastrado com sucesso' });
      }
    }
  );
});

// Rota para obter a lista de funcionários
app.get('/obterFuncionarios', (req, res) => {
  // Consulta ao banco de dados para obter a lista de funcionários
  db.query('SELECT * FROM funcionario', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      const funcionarios = results.map(result => result);
      res.json(funcionarios);
    }
  });
});

// Rota para obter a lista de clientes
app.get('/obterClientes', (req, res) => {
  // Consulta ao banco de dados para obter a lista de clientes
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      const clientes = results.map(result => result);
      res.json(clientes);
    }
  });
});

// Rota para obter a lista de documentos
app.get('/obterDocumentos', (req, res) => {
  // Consulta ao banco de dados para obter a lista de documentos
  db.query('SELECT documentos.*, cliente.nome AS nome_cliente, categorias.nome AS nome_categoria FROM documentos JOIN cliente ON documentos.cliente_id = cliente.id JOIN categorias ON documentos.categoria_id = categorias.id;', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      const documentos = results.map(result => result);
      res.json(documentos);
    }
  });
});

app.get('/obterCategorias', (req, res) => {
  // Consulta ao banco de dados para obter a lista de documentos
  db.query('SELECT * FROM categorias;', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      const categoria = results.map(result => result);
      res.json(categoria);
    }
  });
});

app.get('/obterDocumentosById/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM documentos WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Documento não encontrado' });
      } else {
        const documento = results[0];
        res.json(documento);
      }
    }
  });
});

app.get('/obterClienteById/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM cliente WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Cliente não encontrado' });
      } else {
        const documento = results[0];
        res.json(documento);
      }
    }
  });
});

app.get('/obterFuncionarioById/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM funcionario WHERE id = ?', id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ message: 'Funcionario não encontrado' });
      } else {
        const funcionario = results[0];
        res.json(funcionario);
      }
    }
  });
});

app.delete('/deletarCliente/:id', (req, res) => {
  const clienteId = req.params.id;

  db.query('DELETE FROM cliente WHERE id = ?', [clienteId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.json({ message: 'Cliente excluído com sucesso' });
    }
  });
});

app.delete('/deletarDoc/:id', (req, res) => {
  const clienteId = req.params.id;

  db.query('DELETE FROM documentos WHERE id = ?', [clienteId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.json({ message: 'Documento excluído com sucesso' });
    }
  });
});

app.delete('/deletarFuncionario/:id', (req, res) => {
  const clienteId = req.params.id;

  db.query('DELETE FROM funcionario WHERE id = ?', [clienteId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.json({ message: 'Funcionario excluído com sucesso' });
    }
  });
});

app.put('/editarCliente/:id', (req, res) => {
  const clienteId = req.params.id;
  const cliente = req.body;

  // Consulta ao banco de dados para atualizar o cliente com o ID fornecido
  db.query('UPDATE cliente SET ? WHERE id = ?', [cliente, clienteId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.status(200).json({ message: 'Cliente atualizado com sucesso' });
    }
  });
});

app.put('/editarFuncionario/:id', (req, res) => {
  const funcionarioId = req.params.id;
  const funcionario = req.body;

  // Consulta ao banco de dados para atualizar o cliente com o ID fornecido
  db.query('UPDATE funcionario SET ? WHERE id = ?', [funcionario, funcionarioId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.status(200).json({ message: 'Funcionário atualizado com sucesso' });
    }
  });
});

app.put('/editarDoc/:id', (req, res) => {
  const docId = req.params.id;
  const doc = req.body;

  // Consulta ao banco de dados para atualizar o cliente com o ID fornecido
  db.query('UPDATE documentos SET ? WHERE id = ?', [doc, docId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor' });
    } else {
      res.status(200).json({ message: 'Documento atualizado com sucesso' });
    }
  });
});

// Rota de autenticação de login do aplicativo
app.post('/loginApp', (req, res) => {
    const { cpf, senha } = req.body;
  
    // Verifique as credenciais do cliente no banco de dados
    const query = 'SELECT * FROM cliente WHERE cpf = ? AND senha = ?';
    connection.query(query, [cpf, senha], (error, results) => {
      if (error) {
        console.error('Erro ao verificar as credenciais:', error);
        res.status(500).json({ message: 'Erro ao verificar as credenciais' });
      } else {
        if (results.length > 0) {
          // Login bem-sucedido
          res.status(200).json({ message: 'Login bem-sucedido' });
        } else {
          // Login inválido
          res.status(401).json({ message: 'CPF ou senha inválidos' });
        }
      }
    });
  });  

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
