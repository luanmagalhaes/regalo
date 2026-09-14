# 🎁 Regalo

> A lista de presentes do bibuaidi.

**Regalo** é um app interno para os amigos guardarem tamanho, medida e preferência de presente num lugar só. Ninguém mais precisa perguntar "qual é o número do seu pé?" três dias antes do aniversário.

Cada pessoa tem o próprio espaço, e esse espaço é dela: escolhe a cor, a carinha, cola adesivo e arrasta pela tela até ficar do jeito que quer.

---

## 🍦 O que ele faz

| | |
| --- | --- |
| 👕 | Cada item vira um desenho: toca no ícone da blusa e escreve o número embaixo |
| ✍️ | O campo é livre — cabe `M`, `44`, `38/M`, `18 ou 19`, o que for |
| 🍩 | Item sem medida (doce, livro, jogo) pergunta o gosto, não o número |
| 📸 | Foto no perfil, opcional, encolhida no próprio aparelho antes de subir |
| 💌 | Campo aberto de dica de presente, para o que não cabe em etiqueta |
| ➕ | Botão de `+` para criar item que não está na lista, com nome e observação próprios |
| 🏷️ | Item pode ficar marcado como **a confirmar** quando a pessoa não tem certeza |
| 💝 | Listas de **ama ganhar**, **não curte** e **já tem demais**, todas editáveis |
| 🎨 | Oito sabores de cor, carinha trocável e adesivos arrastáveis pelo perfil |
| 🎂 | Tracker de aniversário com contagem regressiva e aviso **15 dias antes** |
| 🏆 | Nível e conquistas por perfil preenchido, para cutucar quem não respondeu |
| 🔊 | Sons curtos ao escolher, guardar e comemorar, com botão de silêncio |
| 🎬 | Abertura com o presente se abrindo e carrossel explicando o app na primeira visita |

## 🎂 Como funciona o aviso de aniversário

Todo perfil com data entra no tracker, ordenado por quem vem primeiro. Quando alguém entra na janela de **15 dias**, aparece uma faixa na home e o card ganha destaque. Se a pessoa autorizar a notificação do navegador, o aviso também chega como notificação do celular na primeira vez em que o app abrir dentro da janela — uma vez por aniversário, por ano.

O cálculo vive em funções puras, cobertas por teste, inclusive a virada de ano e quem nasceu em 29 de fevereiro (comemora em 1º de março nos anos que não são bissextos).

## 🔒 Privacidade

A lista tem medida de roupa de gente real, então o app não fica aberto na internet:

- entrada protegida por **senha da turma** (`REGALO_PASSPHRASE`), guardada num cookie `httpOnly`
- todas as rotas de API conferem essa senha antes de responder
- `robots: noindex` — a página não entra em buscador
- RLS ligada nas duas tabelas e **nenhuma policy**: o banco só responde à chave secreta, que nunca sai do servidor

## 🛠️ Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** strict
- **Tailwind CSS 4** — `@theme` e `@utility`, sem arquivo de config
- **Supabase** (Postgres) para a lista compartilhada entre os celulares
- **Vitest** nas regras de aniversário e de medalhas (31 testes)
- Ícones dos itens desenhados à mão em SVG, sem biblioteca

## 🚀 Rodando

```bash
pnpm install
cp .env.example .env.local   # preencha as três variáveis
pnpm dev                     # http://localhost:1000
pnpm test
pnpm lint
pnpm build
pnpm icons                   # regenera os ícones a partir de src/app/icon.svg
```

Variáveis de ambiente:

| Variável | Para que serve |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | endereço do projeto Supabase |
| `SUPABASE_SECRET_KEY` | chave secreta, usada só no servidor |
| `REGALO_PASSPHRASE` | senha combinada no grupo; sem ela, o app abre sem trava |

As migrations ficam em `supabase/migrations` e são aplicadas na ordem do nome.

## 🎨 Cores

Paleta de sorveteria: morango `#ff6fa5`, pistache `#7fd9a6`, blueberry `#7c8cf8`, uva `#b07bff`, caramelo `#f0a44d`, menta `#6fd9d2`, baunilha `#f5cf6a` e chocolate `#a9704f`, sobre creme `#fff6ea` com traço em `#3b2450`.
