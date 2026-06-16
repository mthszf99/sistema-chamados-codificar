import { useEffect, useState } from 'react';
import api from '../api';

export default function ListaChamados() {
  const [chamados, setChamados] = useState([]);

  // buscando os chamados existentes
  useEffect(() => {
    api.get('/chamados')
      .then(response => {
        setChamados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar chamados:", error);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chamados Recentes</h2>
      
      {chamados.length === 0 ? (
        <p className="text-gray-500">Nenhum chamado aberto no momento.</p>
      ) : (
        <ul className="space-y-3">
          {chamados.map((chamado) => (
            <li key={chamado.id} className="border border-gray-200 p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{chamado.titulo}</h3>
                <p className="text-sm text-gray-600">Responsável: {chamado.responsavel_nome || 'Aguardando...'}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                chamado.status === 'Resolvido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {chamado.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}