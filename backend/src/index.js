const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tarefasKanban',
    password: 'senai',
    port: 5432,
});

app.use(cors());
app.use(express.json());

const validateTask = (req, res, next) => {
    const { id_usuario, descricao, nome_setor, prioridade, data_cadastro, status } = req.body;
    if (!id_usuario || !descricao || !nome_setor || !prioridade || !data_cadastro || !status) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    next();
};

app.get('/tarefas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tarefas');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
});

app.get('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM tarefas WHERE id_tarefa = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar tarefa' });
    }
});

app.post('/tarefas', validateTask, async (req, res) => {
    const { id_usuario, descricao, nome_setor, prioridade, data_cadastro, status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tarefas (id_usuario, descricao, nome_setor, prioridade, data_cadastro, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [id_usuario, descricao, nome_setor, prioridade, data_cadastro, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar tarefa' });
    }
});

app.put('/tarefas/:id', validateTask, async (req, res) => {
    const { id } = req.params;
    const { id_usuario, descricao, nome_setor, prioridade, data_cadastro, status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tarefas SET id_usuario = $1, descricao = $2, nome_setor = $3, prioridade = $4, data_cadastro = $5, status = $6 WHERE id_tarefa = $7 RETURNING *',
            [id_usuario, descricao, nome_setor, prioridade, data_cadastro, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
});

app.delete('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tarefas WHERE id_tarefa = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao deletar tarefa' });
    }
});

app.post('/usuario', async (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
            [nome, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao adicionar usuario' });
    }
});

app.get('/usuario', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuario');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar usuario' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});