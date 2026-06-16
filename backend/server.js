
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
    res.json({ mensagem: 'Servidor rodando' });
});

// === ROTAS DA NOSSA API ===

// 1. Rota para buscar os responsáveis (Vamos precisar disso no Front-end para o campo de seleção)
app.get('/api/responsaveis', (req, res) => {
    db.all("SELECT * FROM responsaveis", [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// 2. Rota para listar os chamados cadastrados
app.get('/api/chamados', (req, res) => {
    // Usamos o LEFT JOIN para já trazer o nome do responsável junto com os dados do chamado
    const sql = `
        SELECT chamados.*, responsaveis.nome as responsavel_nome 
        FROM chamados 
        LEFT JOIN responsaveis ON chamados.responsavel_id = responsaveis.id
        ORDER BY chamados.data_abertura DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Criando Chamado
app.post('/api/chamados', (req, res) => {
    
    const { titulo, descricao, prioridade, status, responsavel_id } = req.body;
    
    const sql = `INSERT INTO chamados (titulo, descricao, prioridade, status, responsavel_id) VALUES (?, ?, ?, ?, ?)`;
    const params = [titulo, descricao, prioridade, status, responsavel_id];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(400).json({ erro: err.message });
        
        
        res.json({ id: this.lastID, mensagem: 'Chamado criado com sucesso!' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});