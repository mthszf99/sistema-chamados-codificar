# Sistema de Controle de Chamados Internos - Codificar

Aplicação web desenvolvida como resolução do desafio Full Stack para a equipe de engenharia de software da Codificar. O sistema permite o cadastro, listagem, edição e distribuição automática de chamados de suporte.

## Tecnologias e Justificativas Arquiteturais

A escolha da stack tecnológica foi guiada pelo pragmatismo, produtividade e pela minha atual familiaridade com o ecossistema JavaScript/TypeScript, visando entregar um código limpo e funcional.

* **Front-end: React e Vite**
    * **Justificativa:** Como tenho consolidado meus estudos no ecossistema React, utilizá-lo na web permite uma transição natural e alta produtividade através da componentização. O vite foi escolhido por ser um empacotador moderno e extremamente rápido.
* **Back-end: Node.js + Express**
    * **Justificativa:** Seguindo a dica do desafio sobre produtividade em equipes pequenas, adotar JavaScript tanto no Front-end quanto no Back-end reduz drasticamente o atrito de desenvolvimento, permitindo que a mesma linguagem e lógica transitem por toda a aplicação.
* **Banco de Dados: SQLite**
    * **Justificativa:** Pensando como arquiteto e priorizando a facilidade de execução pela equipe da Codificar, o SQLite dispensa a necessidade de instalar, configurar ou popular servidores de banco de dados (como MySQL ou Postgres) localmente. O banco é criado e populado com os responsáveis iniciais automaticamente ao rodar o servidor pela primeira vez.
* **Estilização: Tailwind CSS**
    * **Justificativa:** Utilizado como *styleguide* para construir uma interface limpa, responsiva e funcional rapidamente, sem a necessidade de criar arquivos CSS complexos.

## Decisões de Negócio e Trade-offs

* **Modelo de Status e Distribuição Automática:** O desafio solicitava a definição do conceito de chamados "em aberto" para a distribuição automática. Defini que chamados com status **"Aberto"** ou **"Em andamento"** são considerados pendentes. A distribuição automática via API conta essas ocorrências e atribui o novo chamado ao responsável com o menor número.
* **Busca e Filtros:** Para manter o foco nos fundamentos e evitar complexidade desnecessária no back-end (privilegiando a qualidade e estabilidade da API), o mecanismo de busca textual (por título ou responsável) foi implementado via JavaScript diretamente no Front-end.

## Como executar o projeto localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **Git** instalados na sua máquina.

### 1. Clonar o repositório
\`\`\`bash
git clone https://github.com/mthszf99/sistema-chamados-codificar.git
cd sistema-chamados-codificar
\`\`\`

### 2. Rodando o Back-end (API e Banco de Dados)
Abra um terminal e execute os seguintes comandos:
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*Nota: Ao iniciar o servidor pela primeira vez, o arquivo `banco.sqlite` será criado automaticamente e a tabela de responsáveis será populada com 3 atendentes (Ana, Carlos e Beatriz).*
A API estará rodando em: `http://localhost:3000`

### 3. Rodando o Front-end (Interface)
Abra um **novo terminal** (mantendo o back-end rodando), volte para a raiz do projeto e execute:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Acesse o link gerado no terminal (geralmente `http://localhost:5173`) no seu navegador.

## Demonstração do Sistema

Clique na imagem abaixo para assistir ao vídeo de demonstração das funcionalidades:

[![Demonstração do Sistema](https://img.youtube.com/vi/LzWbo9R5YYs/maxresdefault.jpg)](https://www.youtube.com/watch?v=LzWbo9R5YYs)

## Funcionalidades Implementadas
* [x] Cadastro de chamados (Título, Descrição, Prioridade, Status).
* [x] Responsáveis pré-cadastrados via carga inicial do banco.
* [x] Distribuição Automática (atribui ao responsável com menos chamados pendentes).
* [x] Atribuição Manual de responsáveis.
* [x] Visualização em lista com filtro de busca em tempo real.
* [x] Modal de edição detalhada para acompanhamento de status.
* [x] Dashboard com cards de resumo em tempo real da situação atual dos chamados.

---
Desenvolvido com dedicação para o processo seletivo da Codificar Sistemas Tecnológicos.