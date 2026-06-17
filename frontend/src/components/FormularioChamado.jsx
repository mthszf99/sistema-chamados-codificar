import { useState, useEffect } from 'react';
import api from '../api';

export default function FormularioChamado({ aoCriarChamado }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('Baixa');
  const [responsavelId, setResponsavelId] = useState('');
  const [responsaveis, setResponsaveis] = useState([]);

  // buscando responsaveis cadastrado
  useEffect(() => {
    api.get('/responsaveis')
      .then(response => setResponsaveis(response.data))
      .catch(error => console.error("Erro ao buscar responsáveis:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/chamados', {
        titulo,
        descricao,
        prioridade,
        status: 'Aberto', // chamado fica aberto quando iniciado
        responsavel_id: responsavelId || null // se estiver vazio busca o resp menos sobrecarregado
      });
      
      setTitulo('');
      setDescricao('');
      setPrioridade('Baixa');
      setResponsavelId('');
      
      aoCriarChamado();
      
    } catch (error) {
      console.error(error);
      alert('Erro ao criar o chamado.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Abrir Novo Chamado</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input 
            type="text" 
            required 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: Teclado quebrado"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prioridade</label>
          <select 
            value={prioridade} 
            onChange={(e) => setPrioridade(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Descrição do Problema</label>
        <textarea 
          required 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Atribuir a um Responsável</label>
        <select 
          value={responsavelId} 
          onChange={(e) => setResponsavelId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Distribuição Automática (Menos chamados)</option>
          {responsaveis.map((resp) => (
            <option key={resp.id} value={resp.id}>
              {resp.nome}
            </option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Registrar Chamado
      </button>
    </form>
  );
}