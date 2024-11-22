import React, { useState } from 'react';

function Card({ tarefa, buscarTarefas, usuario }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTarefa, setEditedTarefa] = useState({ ...tarefa });
  const [isAluguelModalOpen, setIsAluguelModalOpen] = useState(false);
  const [aluguelData, setAluguelData] = useState({
    id_usuario: '',
    data_inicio: '',
    data_fim: ''
  });

  const alterarSituacao = async (novaSituacao) => {
    if (novaSituacao === 'fazendo') {
      setIsAluguelModalOpen(true);
    } else {
      await atualizarTarefa(novaSituacao);
    }
  };

  const atualizarTarefa = async (novaSituacao, dadosAluguel = null) => {
    const body = { ...tarefa, status: novaSituacao };
    if (dadosAluguel) {
      body.id_usuario = dadosAluguel.id_usuario;
      body.data_inicio = dadosAluguel.data_inicio;
      body.data_fim = dadosAluguel.data_fim;
    }
    await fetch(`http://localhost:3000/tarefas/${tarefa.id_tarefa}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    buscarTarefas();
  };

  const salvarAluguel = async () => {
    await atualizarTarefa('fazendo', aluguelData);
    setIsAluguelModalOpen(false);
    setAluguelData({ id_usuario: '', data_inicio: '', data_fim: '' });
  };

  const editarTarefa = async () => {
    await fetch(`http://localhost:3000/tarefas/${tarefa.id_tarefa}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTarefa)
    });
    buscarTarefas();
    setIsEditing(false);
  };

  const deletarTarefa = async () => {
    const confirmed = window.confirm("Tem certeza de que deseja deletar esta tarefa?");
    if (confirmed) {
      await fetch(`http://localhost:3000/tarefas/${tarefa.id_tarefa}`, { method: 'DELETE' });
      buscarTarefas();
    }
  };

  return (
    <div className="tarefa-card">
      <h3>{tarefa.descricao}</h3>
      <p>Setor: {tarefa.nome_setor}</p>
      <p>Prioridade: {tarefa.prioridade}</p>
      <p>Status: {tarefa.status}</p>

      {tarefa.status === 'a fazer' && (
        <>
          <button onClick={() => alterarSituacao('fazendo')}>Iniciar</button>
          <button onClick={() => alterarSituacao('pronto')}>Concluir</button>
        </>
      )}

      {tarefa.status === 'fazendo' && (
        <>
          <button onClick={() => alterarSituacao('pronto')}>Concluir</button>
          <button onClick={() => alterarSituacao('a fazer')}>Voltar para A Fazer</button>
        </>
      )}

      {tarefa.status === 'pronto' && (
        <button onClick={() => alterarSituacao('a fazer')}>Reabrir</button>
      )}

      {isEditing ? (
        <div>
          <input
            value={editedTarefa.descricao}
            onChange={(e) => setEditedTarefa({ ...editedTarefa, descricao: e.target.value })}
          />
          <input
            value={editedTarefa.nome_setor}
            onChange={(e) => setEditedTarefa({ ...editedTarefa, nome_setor: e.target.value })}
          />
          <select
            value={editedTarefa.prioridade}
            onChange={(e) => setEditedTarefa({ ...editedTarefa, prioridade: e.target.value })}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <button onClick={editarTarefa}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)}>Editar</button>
          <button onClick={deletarTarefa}>Deletar</button>
        </>
      )}

      {isAluguelModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Início de Tarefa</h2>
            <select
              value={aluguelData.id_usuario}
              onChange={(e) => setAluguelData({ ...aluguelData, id_usuario: e.target.value })}
            >
              <option value="">Selecione o Usuário</option>
              {usuario.map(usuario => (
                <option key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nome}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={aluguelData.data_inicio}
              onChange={(e) => setAluguelData({ ...aluguelData, data_inicio: e.target.value })}
            />
            <input
              type="date"
              value={aluguelData.data_fim}
              onChange={(e) => setAluguelData({ ...aluguelData, data_fim: e.target.value })}
            />
            <button onClick={salvarAluguel}>Confirmar Início</button>
            <button onClick={() => setIsAluguelModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
