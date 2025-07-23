# SuperTask Frontend 🚀

Interface moderna e responsiva para gerenciamento de tarefas com dashboard inteligente e tema dark/light. Desenvolvida com Next.js 15 e TailwindCSS.

> 🔗 **Backend:** [SuperTask Backend (Django REST)](https://github.com/JannyferTamagno/SuperTask-backend)

## 📋 Funcionalidades

- ✅ **Interface moderna e intuitiva** - Dashboard clean com componentes reutilizáveis
- 🏷️ **Gerenciamento completo de tarefas** - Criar, editar, visualizar e deletar tarefas
- 📊 **Dashboard com estatísticas** - Cards informativos e métricas em tempo real
- 💬 **Frase motivacional diária** - Inspiração carregada da API do backend
- 🔍 **Filtros e busca avançada** - Encontre tarefas por título, prioridade e status
- 🔐 **Autenticação segura** - Login/registro integrado com JWT
- 🌙 **Tema Dark/Light** - Alternância suave entre temas com persistência
- 📱 **Design totalmente responsivo** - Funciona perfeitamente em mobile e desktop
- ⚡ **Performance otimizada** - Next.js 15 com Turbopack para desenvolvimento rápido
- 🧪 **Testes automatizados** - Jest e Testing Library configurados
- 🎨 **Componentes modulares** - Arquitetura limpa e reutilizável

## 🛠️ Tech Stack

**Frontend (Este repositório):**

- Next.js 15.4.2
- React 19.1.0
- TypeScript 5
- TailwindCSS 4
- Lucide React (ícones)
- Jest + Testing Library

**Integração:**

- API REST do Django Backend
- Autenticação JWT
- LocalStorage para persistência de tema
- Fetch API para requisições

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm, yarn ou pnpm

### Executando o projeto

1. Clone o repositório:

```bash
git clone https://github.com/JannyferTamagno/SuperTask-frontend.git
cd SuperTask-frontend
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://supertask-api.onrender.com/api
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Acesse a aplicação:

- Frontend: http://localhost:3000
- Para funcionar completamente, certifique-se de que o backend esteja rodando

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build de produção
npm run build

# Executar build de produção
npm run start

# Linting
npm run lint

# Testes
npm run test
```

## 🧪 Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com coverage
npm test -- --coverage
```

## 📖 Estrutura do Projeto

```
supertask-frontend/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── dashboard/         # Página principal do dashboard
│   │   ├── login/            # Página de login/registro
│   │   ├── layout.tsx        # Layout raiz
│   │   └── page.tsx          # Página inicial (redirect)
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Banner/           # Banner de boas-vindas
│   │   ├── Button/           # Botão customizável
│   │   ├── Card/             # Cards de estatísticas
│   │   ├── Categoriescard/   # Card de categorias
│   │   ├── CreateTaskModal/  # Modal de criação de tarefas
│   │   ├── Filterbar/        # Barra de filtros
│   │   ├── Navbar/           # Barra de navegação
│   │   ├── Quotecontainer/   # Container da frase do dia
│   │   ├── Statscontainer/   # Containers de estatísticas
│   │   ├── Taskcontainer/    # Lista de tarefas
│   │   └── __tests__/        # Testes dos componentes
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.tsx       # Hook de autenticação
│   │   ├── useCategories.tsx # Hook de categorias
│   │   ├── useDashboard.tsx  # Hook do dashboard
│   │   └── useTasks.tsx      # Hook de tarefas
│   ├── providers/            # Context providers
│   │   ├── AppProviders.tsx  # Provider principal
│   │   └── ThemeProvider.tsx # Provider de temas
│   ├── types/                # Definições TypeScript
│   │   └── task.ts           # Tipos relacionados a tarefas
│   ├── api/                  # Integração com API
│   │   └── index.tsx         # Cliente da API REST
│   └── globals.css           # Estilos globais
├── public/                   # Arquivos estáticos
├── tailwind.config.ts        # Configuração TailwindCSS
├── tsconfig.json            # Configuração TypeScript
├── next.config.ts           # Configuração Next.js
├── jest.config.ts           # Configuração Jest
└── package.json             # Dependências e scripts
```

## 🎨 Componentes Principais

### Dashboard
Interface principal com:
- Banner personalizado com nome do usuário
- Cards de estatísticas (completas, pendentes, vencidas)
- Lista de categorias com cores
- Container de tarefas com paginação
- Frase motivacional diária

### Autenticação
- Formulário unificado de login/registro
- Validação de campos em tempo real
- Integração com JWT tokens
- Redirecionamento automático

### Gerenciamento de Tarefas
- Modal de criação com validação
- Filtros por prioridade, status e busca
- Ordenação personalizada
- Ações de editar/deletar
- Toggle de status completo/pendente

### Sistema de Temas
- Alternância Dark/Light suave
- Persistência no localStorage
- Detecção de preferência do sistema
- Transições CSS otimizadas

## 🔗 Integração com API

### Endpoints Utilizados

```typescript
// Autenticação
POST /api/auth/login/
POST /api/auth/register/
POST /api/auth/logout/
GET /api/auth/user/

// Tarefas
GET /api/tasks/
POST /api/tasks/
PATCH /api/tasks/${id}/
DELETE /api/tasks/${id}/
PATCH /api/tasks/${id}/toggle-status/

// Dashboard
GET /api/dashboard/stats/
GET /api/dashboard/quote/

// Categorias
GET /api/categories/
POST /api/categories/
```

### Autenticação JWT

```typescript
// Headers automáticos em todas as requisições
Authorization: Bearer ${access_token}

// Refresh automático de tokens
// Logout automático em caso de erro 401
```

## 🌙 Sistema de Temas

O sistema de temas funciona com:

```typescript
// Hook de tema
const { theme, toggleTheme } = useTheme()

// Classes TailwindCSS
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"

// Persistência automática
localStorage.setItem('theme', theme)
```

## 📱 Responsividade

- **Mobile First:** Design otimizado para dispositivos móveis
- **Breakpoints:** Adaptação automática para tablet e desktop
- **Touch Friendly:** Botões e áreas clicáveis otimizadas
- **Grid Responsivo:** Layout flexível em todas as telas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com/api
   ```
3. Deploy automático a cada push na main

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Configure as mesmas variáveis de ambiente

### Build Local

```bash
npm run build
npm run start
```

## 🧪 Testes

### Estrutura de Testes

```bash
src/components/__tests__/
├── Button.test.tsx       # Testes do componente Button
├── Card.test.tsx         # Testes do componente Card
└── ...                   # Outros testes de componentes
```

### Exemplo de Teste

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

test('renders button and handles click', () => {
  const handleClick = jest.fn()
  render(<Button onClick={handleClick}>Click Me</Button>)
  
  fireEvent.click(screen.getByText('Click Me'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines de Contribuição

- Use TypeScript para type safety
- Siga os padrões do ESLint configurado
- Adicione testes para novos componentes
- Mantenha componentes pequenos e reutilizáveis
- Use TailwindCSS para estilização
- Documente props complexas com JSDoc

## 📋 Roadmap

- [x] **Interface completa** - Dashboard funcional com todos os componentes
- [x] **Autenticação JWT** - Login/registro integrado
- [x] **Sistema de temas** - Dark/Light mode com persistência
- [x] **Gestão de tarefas** - CRUD completo via API
- [x] **Filtros e busca** - Sistema de filtros avançado
- [x] **Responsividade** - Design mobile-first
- [x] **Testes unitários** - Cobertura básica de componentes
- [x] **Deploy Vercel** - Ambiente de produção estável
- [ ] **PWA** - Transformar em Progressive Web App
- [ ] **Notificações push** - Lembretes de tarefas vencidas
- [ ] **Drag & Drop** - Reordenação de tarefas
- [ ] **Temas customizáveis** - Criação de temas personalizados
- [ ] **Offline mode** - Funcionalidade offline com sync
- [ ] **Compartilhamento** - Compartilhar listas de tarefas
- [ ] **Relatórios** - Gráficos de produtividade
- [ ] **Integração calendário** - Sincronização com Google Calendar
- [ ] **App mobile nativo** - React Native version

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Repositórios Relacionados

- **Backend:** [SuperTask Backend](https://github.com/JannyferTamagno/SuperTask-backend) - API Django REST
- **Frontend:** Este repositório - Interface Next.js com TailwindCSS

## 👨‍💻 Autor

**Jannyfer Tamagno**

- GitHub: [@JannyferTamagno](https://github.com/JannyferTamagno)
- LinkedIn: [@jannyfer-tamagno](https://linkedin.com/in/jannyfertamagno)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - O framework React para produção
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitário incrível
- [Lucide React](https://lucide.dev/) - Biblioteca de ícones linda e consistente
- [Vercel](https://vercel.com/) - Plataforma de deploy otimizada para Next.js

---

⭐ Não esqueça de dar uma estrela se este projeto te ajudou!