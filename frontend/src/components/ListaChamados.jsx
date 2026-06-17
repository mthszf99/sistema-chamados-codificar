import { useEffect, useState } from 'react';
import api from '../api';

export default function ListaChamados({ atualizar }) {
  const [chamados, setChamados] = useState([]);
  const [busca, setBusca] = useState('');
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  useEffect(() => {
    carregarChamados();
  }, [atualizar]);

  const carregarChamados = () => {
    api.get('/chamados')
      .then(response => setChamados(response.data))
      .catch(error => console.error("Erro ao buscar chamados:", error));
  };

  // função para salvar a edicao feita no modal
  const salvarEdicao = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/chamados/${chamadoSelecionado.id}`, {
        titulo: chamadoSelecionado.titulo,
        descricao: chamadoSelecionado.descricao,
        prioridade: chamadoSelecionado.prioridade,
        status: chamadoSelecionado.status,
        responsavel_id: chamadoSelecionado.responsavel_id
      });
      
      setChamadoSelecionado(null);
      carregarChamados();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar o chamado.');
    }
  };

  const chamadosFiltrados = chamados.filter(chamado => {
    const termoBusca = busca.toLowerCase();
    const titulo = chamado.titulo.toLowerCase();
    const responsavel = (chamado.responsavel_nome || '').toLowerCase();
    return titulo.includes(termoBusca) || responsavel.includes(termoBusca);
  });

  // cards dos chamados abertos, fechados, em andamento e resolvidos
  const contagem = {
    Aberto: chamados.filter(c => c.status === 'Aberto').length,
    'Em andamento': chamados.filter(c => c.status === 'Em andamento').length,
    Resolvido: chamados.filter(c => c.status === 'Resolvido').length,
    Fechado: chamados.filter(c => c.status === 'Fechado').length,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Chamados Recentes</h2>
        
        <input 
          type="text" 
          placeholder="Buscar por título ou responsável..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full md:w-1/2 rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Abertos</span>
          <span className="text-3xl font-black text-red-700">{contagem.Aberto}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Em Andamento</span>
          <span className="text-3xl font-black text-blue-700">{contagem['Em andamento']}</span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Resolvidos</span>
          <span className="text-3xl font-black text-green-700">{contagem.Resolvido}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Fechados</span>
          <span className="text-3xl font-black text-gray-700">{contagem.Fechado}</span>
        </div>
      </div>
      
      {chamadosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Nenhum chamado encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {chamadosFiltrados.map((chamado) => (
            <li key={chamado.id} className="border border-gray-200 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{chamado.titulo}</h3>
                <div className="flex gap-2 text-xs font-medium mt-2">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">Resp: {chamado.responsavel_nome || 'Aguardando...'}</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Prioridade: {chamado.prioridade}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  chamado.status === 'Resolvido' || chamado.status === 'Fechado' ? 'bg-green-100 text-green-800' : 
                  chamado.status === 'Em andamento' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {chamado.status}
                </span>
                
                <button 
                  onClick={() => setChamadoSelecionado(chamado)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold py-1 px-3 rounded transition"
                >
                  Ver Detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* MODAL */}
      {chamadoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Detalhes do Chamado #{chamadoSelecionado.id}</h3>
            
            <form onSubmit={salvarEdicao}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700">Título</label>
                <input 
                  type="text"
                  value={chamadoSelecionado.titulo}
                  onChange={(e) => setChamadoSelecionado({...chamadoSelecionado, titulo: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700">Descrição</label>
                <textarea 
                  value={chamadoSelecionado.descricao}
                  onChange={(e) => setChamadoSelecionado({...chamadoSelecionado, descricao: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Status</label>
                  <select 
                    value={chamadoSelecionado.status}
                    onChange={(e) => setChamadoSelecionado({...chamadoSelecionado, status: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Resolvido">Resolvido</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700">Prioridade</label>
                  <select 
                    value={chamadoSelecionado.prioridade}
                    onChange={(e) => setChamadoSelecionado({...chamadoSelecionado, prioridade: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setChamadoSelecionado(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}