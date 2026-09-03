# Contexto e Design System Global: Front-end (Renick Kids)
<!-- AUDIT_TOKEN: RENICK_FRONTEND_GLOBAL_VERIFIED -->

## 1. Stack Tecnológica
* **Core:** React 19, Vite, React Router DOM.
* **Estilização:** Tailwind CSS v4.
* **Gerenciamento de Estado:** Zustand (stores modulares desacopladas por domínio).
* **Consumo de API:** Instância centralizada do Axios com interceptors de requisição/erro.
* **Testes:** Vitest e React Testing Library com mocks para requisições de rede.

## 2. Padrões de Código e Componentização
* **Nomenclatura:**
  * Componentes e Hooks exportados: `PascalCase` (arquivos `.jsx`).
  * Funções utilitárias e métodos: `camelCase` (iniciadas por verbo).
  * Estados booleanos: prefixados com `is`, `has` ou `can` (`isLoading`, `hasError`, `isOpen`).
* **Arquitetura de Componentes:**
  * Divisão estrita entre componentes de UI Pura (dumb components / sem estado externo) e componentes de Contêiner/Página (conectados a stores e APIs).
  * Evitar funções e JSX profundamente aninhados no mesmo arquivo; extrair subcomponentes reutilizáveis.

## 3. Design System & Design Tokens (Regras Rígidas)
* **Cores Globais:**
  * Primária / Ação Principal: `#CDF22B` (Texto do botão: `#0A0A0A` para contraste).
  * Secundária / Ação Alternativa: `#1E45FB` (Texto do botão: `#FAFAFA`).
  * Background Geral (Mobile e Desktop): `#FAFAFA`.
  * Fundo de Cards e Contêineres: `#FAFAFA`.
  * Texto Principal / Títulos: `#0A0A0A`.
  * Texto Secundário / Apoio: `#0A0A0A` com 60% de opacidade.
  * Bordas Padrão (Inputs e divisórias): `#0A0A0A` com 25% de opacidade (`border-black/25`).
  * Bordas Ativas / Foco (Inputs Focus): `#0A0A0A` com 100% de opacidade (`border-black`).
  * Erros e Validações: `#D22A31`.
* **Tipografia:**
  * Títulos de Página / Headers de Destaque (H1): Fonte `Suez One`, peso Regular, `uppercase`, cor `#1E45FB`.
    * Tamanho Mobile: `32px` (`text-2xl`).
    * Tamanho Desktop: `48px` (`text-4xl`).
  * Subtítulos, Headers Secundários e Labels: Fonte `Poppins`, peso Bold, `uppercase`, cor `#0A0A0A`.
    * Tamanho Mobile: `18px` (`text-lg`).
    * Tamanho Desktop: `20px` (`text-xl`).
  * Textos de Botão (CTA): Fonte `Poppins`, peso Bold, `uppercase`, tamanho `16px` a `18px`.
  * Textos Corridos, Legendas e Placeholders: Fonte `Poppins`, peso Regular, `text-sm` (`14px`) ou `text-base` (`16px`).
* **Geometria de Componentes e Espaçamentos:**
  * Altura padrão de botões e inputs de formulário: estritamente `62px` (`h-[62px]`).
  * Raio de curvatura de borda: `0px` (`rounded-none`).
  * Espaçamento vertical entre seções e campos: `16px` (`gap-4` ou `space-y-4`).
  * Padding horizontal base da tela no mobile: `16px` (`px-4`).

## 4. Diretrizes de Consumo de API e Estado
* Nenhuma chamada direta de `fetch` ou `axios` dentro de componentes de UI; utilizar services de API dedicados ou actions dentro de stores do Zustand.
* Todo loading assíncrono e erro de requisição deve ter tratamento de UI explícito (skeletons/spinners e mensagens de erro no padrão `#D22A31`).