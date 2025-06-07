# Catálogo E-commerce

Link para video no youtube :[https://youtu.be/xP7AOcPvWgI]

Um catálogo de produtos moderno e responsivo desenvolvido com Vue.js 3, que consome a API DummyJSON para exibir produtos de forma organizada e interativa.

## Características Principais

- **Listagem de Produtos**: Exibição de produtos em grid responsivo com informações detalhadas
- **Sistema de Filtros**: Filtros avançados por categoria, preço, avaliação e ordenação
- **Busca em Tempo Real**: Campo de busca que filtra produtos instantaneamente
- **Carrinho de Compras**: Sistema completo de carrinho com persistência local
- **Paginação**: Navegação entre páginas de produtos
- **Visualização Detalhada**: Páginas individuais para cada produto
- **Modal de Preview**: Visualização rápida de produtos sem sair da página principal
- **Interface Responsiva**: Design adaptável para desktop, tablet e mobile

## Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript progressivo
- **Vite** - Build tool e bundler
- **Vue Router** - Roteamento para Single Page Application
- **Axios** - Cliente HTTP para consumo de APIs
- **Tailwind CSS** - Framework CSS utilitário
- **Composition API** - API moderna do Vue.js para melhor organização do código

## Funcionalidades Detalhadas

### Sistema de Filtros
- **Categorias**: Seleção múltipla de categorias com contadores
- **Preço**: Filtro por faixa de preço com valores personalizados
- **Avaliação**: Filtro por avaliação mínima (1-5 estrelas)
- **Ordenação**: Por nome, preço e avaliação

### Carrinho de Compras
- Adição de produtos com quantidade padrão
- Alteração de quantidade na página do carrinho
- Remoção individual de produtos
- Cálculo automático de subtotais e total
- Persistência dos dados no localStorage
- Modal de confirmação ao adicionar produtos

### Interface do Usuário
- Design moderno com gradientes e sombras
- Navbar fixa no topo da página
- Sidebar de filtros com scroll independente
- Cards de produtos com efeitos hover
- Paginação intuitiva
- Feedback visual para ações do usuário

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. Clone o repositório:
\`\`\`bash
git clone [https://github.com/marselo157/catalogo-e-commerce]
cd catalogoecommerce
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Execute o projeto em modo de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

4. Acesse a aplicação em: \`http://localhost:5173\`

## API Utilizada

O projeto consome a **DummyJSON API** para obter dados dos produtos:

- **Endpoint principal**: \`https://dummyjson.com/products\`
- **Produto específico**: \`https://dummyjson.com/products/{id}\`
- **Documentação**: [https://dummyjson.com/docs](https://dummyjson.com/docs)

## Componentes Principais

### FilterSidebar
Componente responsável pelos filtros de produtos:
- Filtros por categoria com contadores dinâmicos
- Campos de preço mínimo e máximo
- Seleção de avaliação mínima
- Opções de ordenação

### ProductGrid
Exibe os produtos em formato de grid:
- Layout responsivo (1-4 colunas)
- Cards com informações do produto
- Botões de ação (Preview e Ver Mais)
- Paginação automática

### ProductModal
Modal para visualização rápida:
- Informações detalhadas do produto
- Botão para adicionar ao carrinho
- Link para página completa do produto

### useCart (Composable)
Gerencia o estado do carrinho:
- Adicionar/remover produtos
- Atualizar quantidades
- Calcular totais
- Persistência no localStorage

## Configuração do Tailwind CSS

O projeto utiliza uma configuração customizada do Tailwind com cores personalizadas:

\`\`\`javascript
colors: {
  primary: '#7C3AED',      // Roxo principal
  secondary: '#67E8F9',    // Ciano claro
  background: '#0F172A',   // Fundo escuro
  text: '#FFFFFF',         // Texto principal
  mutedText: '#CBD5E1'     // Texto secundário
}
\`\`\`

## Contato

Para dúvidas ou sugestões, entre em contato através de:
- Email: [arturctaroco10987654321@gmail.com]
- GitHub: [github.com/artur-taroco]
- Github: [github.com/marselo157]
