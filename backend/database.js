const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'banco.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite.');
    }
});

db.serialize(() => {
    
    db.run(`
        CREATE TABLE IF NOT EXISTS responsaveis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS chamados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            prioridade TEXT NOT NULL,
            status TEXT NOT NULL,
            data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
            responsavel_id INTEGER,
            FOREIGN KEY (responsavel_id) REFERENCES responsaveis (id)
        )
    `);

    db.get("SELECT COUNT(*) AS count FROM responsaveis", (err, row) => {
        if (row && row.count === 0) {
            const insert = db.prepare("INSERT INTO responsaveis (nome) VALUES (?)");
            insert.run("Ana (Suporte de TI)");
            insert.run("Carlos (Manutenção)");
            insert.run("Beatriz (Infraestrutura)");
            insert.finalize();
            console.log('✅ 3 Responsáveis iniciais inseridos com sucesso!');
        }
    });
});

module.exports = db;