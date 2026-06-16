import ListaChamados from './components/ListaChamados';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Painel de Suporte
          </h1>
          <p className="text-gray-600 mt-2">Gerenciamento de chamados internos</p>
        </header>

        <main>
          {/* formulario */}
          
          {/* lista de chamados */}
          <ListaChamados />
        </main>
      </div>
    </div>
  );
}

export default App;