import React, { useEffect, useState } from 'react';
import Card from './components/Card';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [usuario, setusuario] = useState([]);
  const [isAddingTarefa, setIsAddingTarefa] = useState(false);
  const [isAddingUsuario, setIsAddingUsuario] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    descricao: '',
    nome_setor: '',
    prioridade: 'baixa',  // default
    data_cadastro: '',
    status: 'a fazer',  // default
    id_usuario: '',  // Será preenchido com id do usuário
  });
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
  });

  const filtroTarefasPorStatus = (status) => Array.isArray(tarefas) ? tarefas.filter(tarefa => tarefa.status === status): [];

  function adicionarTarefa() {
    setIsAddingTarefa(true);
  }

  function adicionarUsuario() {
    setIsAddingUsuario(true);
  }

  const salvarTarefa = async () => {
    try {
      await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTarefa),
      });
      setIsAddingTarefa(false);
      setNovaTarefa({ descricao: '', nome_setor: '', prioridade: 'baixa', data_cadastro: '', status: 'a fazer', id_usuario: '' });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const salvarUsuario = async () => {
    try {
      await fetch('http://localhost:5432/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });
      setIsAddingUsuario(false);
      setNovoUsuario({ nome: '', email: '' });
      buscarusuario();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas');
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const buscarusuario = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuario');
      const data = await response.json();
      setusuario(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
    buscarusuario();
  }, []);

  return (
    <div>
      <header>
        <h1>Sistema de Tarefas</h1>
        <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
        <button onClick={adicionarUsuario}>Adicionar Usuário</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>A Fazer</h2>
          {filtroTarefasPorStatus('a fazer').map(tarefa => (
            <Card key={tarefa.id_tarefa} tarefa={tarefa} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Fazendo</h2>
          {filtroTarefasPorStatus('fazendo').map(tarefa => (
            <Card key={tarefa.id_tarefa} tarefa={tarefa} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Pronto</h2>
          {filtroTarefasPorStatus('pronto').map(tarefa => (
            <Card key={tarefa.id_tarefa} tarefa={tarefa} buscarTarefas={buscarTarefas} usuario={usuario} />
          ))}
        </div>
      </div>

      {isAddingTarefa && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Tarefa</h2>
            <input
              placeholder="Descrição"
              value={novaTarefa.descricao}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
            />
            <input
              placeholder="Nome do Setor"
              value={novaTarefa.nome_setor}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, nome_setor: e.target.value })}
            />
            <select
              value={novaTarefa.prioridade}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <input
              type="date"
              placeholder="Data de Cadastro"
              value={novaTarefa.data_cadastro}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, data_cadastro: e.target.value })}
            />
            <select
              value={novaTarefa.status}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, status: e.target.value })}
            >
              <option value="a fazer">A Fazer</option>
              <option value="fazendo">Fazendo</option>
              <option value="pronto">Pronto</option>
            </select>
            <select
              value={novaTarefa.id_usuario}
              onChange={(e) => setNovaTarefa({ ...novaTarefa, id_usuario: e.target.value })}
            >
              <option value="">Selecione o Usuário</option>
              {usuario.map(usuario => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nome}
                </option>
              ))}
            </select>
            <button onClick={salvarTarefa}>Salvar</button>
            <button onClick={() => setIsAddingTarefa(false)}>Cancelar</button>
          </div>
        </div>
      )};

      {isAddingUsuario && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Usuário</h2>
            <input
              placeholder="Nome"
              value={novoUsuario.nome}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
            />
            <input
              placeholder="Email"
              value={novoUsuario.email}
              onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
            />
            <button onClick={salvarUsuario}>Salvar</button>
            <button onClick={() => setIsAddingUsuario(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
