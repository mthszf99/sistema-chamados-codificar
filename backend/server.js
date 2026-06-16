
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

//ROTAS
// Rota para buscar os resp
app.get('/api/responsaveis', (req, res) => {
    db.all("SELECT * FROM responsaveis", [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

// Rota para listar os chamados feitos
app.get('/api/chamados', (req, res) => {

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

// Criando chamado distribuição automatica para quem tem menos chamados
app.post('/api/chamados', (req, res) => {
    const { titulo, descricao, prioridade, status, responsavel_id } = req.body;
    
    const salvarChamado = (idResponsavel) => {
        const sql = `INSERT INTO chamados (titulo, descricao, prioridade, status, responsavel_id) VALUES (?, ?, ?, ?, ?)`;
        const params = [titulo, descricao, prioridade, status, idResponsavel];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(400).json({ erro: err.message });
            res.json({ id: this.lastID, responsavel_id: idResponsavel, mensagem: 'Chamado criado com sucesso!' });
        });
    };

    // buscando id especifico
    if (responsavel_id) {
        salvarChamado(responsavel_id);
    } else {
        // Busca quem tem menos chamados em aberto
        const sqlBusca = `
            SELECT r.id, COUNT(c.id) as total_abertos
            FROM responsaveis r
            LEFT JOIN chamados c ON r.id = c.responsavel_id AND c.status IN ('Aberto', 'Em andamento')
            GROUP BY r.id
            ORDER BY total_abertos ASC
            LIMIT 1
        `;

        db.get(sqlBusca, [], (err, row) => {
            if (err) return res.status(500).json({ erro: err.message });
            
            // row.id terá o ID do responsavel com menos chamados
            salvarChamado(row.id);
        });
    }
});

// rota para atualizar ou modificar um chamado
app.put('/api/chamados/:id', (req, res) => {
    const { titulo, descricao, prioridade, status, responsavel_id } = req.body;
    const chamadoId = req.params.id;

    const sql = `UPDATE chamados SET titulo = ?, descricao = ?, prioridade = ?, status = ?, responsavel_id = ? WHERE id = ?`;
    const params = [titulo, descricao, prioridade, status, responsavel_id, chamadoId];

    db.run(sql, params, function(err) {
        if (err) return res.status(400).json({ erro: err.message });
        res.json({ mensagem: 'Chamado atualizado com sucesso!' });
    });
});

// Rota para deletar um chamado se o cliente por um acaso abriu sem querer ou não precise mais etc
app.delete('/api/chamados/:id', (req, res) => {
    const chamadoId = req.params.id;
    
    db.run(`DELETE FROM chamados WHERE id = ?`, chamadoId, function(err) {
        if (err) return res.status(400).json({ erro: err.message });
        res.json({ mensagem: 'Chamado excluído com sucesso!' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});