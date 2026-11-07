# Quiz de Física (Eletrostática, Mecânica dos Fluidos e Termologia)

Quiz de Física (ensino médio) que funciona direto no navegador, sem instalar nada.

## Arquivos

<!-- ARQUIVOS:INICIO -->
| Arquivo | Para que serve |
|---|---|
| `index.html` | Página principal do quiz |
| `style.css` | Visual (cores, fontes, menus) |
| `script.js` | Lógica do quiz |
| `perguntas-eletro.js` | **Banco de perguntas** de Eletrostática (edite aqui para incluir questões) |
| `perguntas-fluidos.js` | **Banco de perguntas** de Mecânica dos Fluidos |
| `perguntas-termo.js` | **Banco de perguntas** de Termologia |
| `perguntas-onda.js` | **Banco de perguntas** de Ondulatória (Som) |
| `perguntas-optica.js` | **Banco de perguntas** de Óptica Geométrica |
| `perguntas-mec.js` | **Banco de perguntas** de Mecânica (cinemática e dinâmica) |
| `perguntas-edin.js` | **Banco de perguntas** de Eletrodinâmica |
| `quiz-edin.js`, `quiz-eletro.js`, `quiz-fluidos.js`, `quiz-mec.js`, `quiz-onda.js`, `quiz-optica.js`, `quiz-termo.js` | Configuração de cada quiz: nome, áreas, cartões, resumo, mensagens e questões numéricas |
| `figuras-fluidos.js`, `figuras-termo.js`, `figuras.js` | Figuras (SVG) usadas nas perguntas e retratos ilustrados dos cientistas (desenhos próprios) |
| `figuras-anim.js` | Kit de animação (cenas, legendas, linha do tempo) |
| `figuras-animq-auto.js` | Animações de resolução geradas automaticamente pelos moldes (não editar à mão) |
| `figuras-animq-edin.js`, `figuras-animq-eletro.js`, `figuras-animq-eletro2.js`, `figuras-animq-eletro3.js`, `figuras-animq-eletro4.js`, `figuras-animq-fluidos.js`, `figuras-animq-fluidos2.js`, `figuras-animq-mec.js`, `figuras-animq-onda.js`, `figuras-animq-optica.js`, `figuras-animq-termo.js`, `figuras-animq-termo2.js`, `figuras-animq-termo3.js` | Animações feitas à mão para cada questão, por área |
| `fontes.js` | Lista de fontes de referência (botão FONTE e tela Fontes) |
| `banco-extra.js`, `banco-proprio.js`, `editor.css`, `editor.html`, `editor.js` | Editor de questões; `banco-proprio.js` leva as perguntas próprias aos alunos |
| `.github/workflows/validar.yml`, `validar-banco.js` | Conferem os bancos de perguntas (ids repetidos, gabarito, alternativas, áreas); os fluxos do GitHub rodam sozinhos a cada envio |
| `firebase-config.js`, `nuvem.js` | Nuvem opcional (Firebase): login por código e sincronização do histórico do aluno |
| `perfil.js` | Desempenho do aluno, treino adaptativo (tudo guardado no aparelho) |
| `fx.js` | Som, vibração e confete |
| `icon-192.png`, `icon-512.png`, `icon.svg`, `manifest.webmanifest`, `sw.js` | Instalação no celular e uso sem internet |
<!-- ARQUIVOS:FIM -->

## Publicar no GitHub Pages

1. Crie um repositório **público** no GitHub.
2. Envie **todos os arquivos desta pasta** para a raiz do repositório (Add file → Upload files).
3. Em **Settings → Pages**, escolha `Deploy from a branch`, branch `main`, pasta `/ (root)` e salve.
4. Em cerca de 1 minuto o quiz abre em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Para atualizar, envie os arquivos alterados de novo (o mesmo nome substitui o antigo).

## Instalar no celular

Abra o endereço do quiz no Chrome (Android) ou Safari (iPhone) e use **Adicionar à tela inicial**.
Depois da primeira visita o quiz também abre sem internet.

## Incluir perguntas

Abra `perguntas-eletro.js` ou `perguntas-fluidos.js` e copie uma linha existente. Campos:

- `id`: único (ex.: `q160`)
- `t`: área (`el`, `co`, `ca`, `po`, `eq`)
- `q`: enunciado; `o`: alternativas; `a`: posição da correta (começa em 0)
- `h`: dica; `e`: explicação
- `f`: nome de uma figura de `figuras.js` (opcional)
- `v`: `1` para manter a ordem das alternativas (verdadeiro/falso)
- `c`: `1` se a questão exige cálculo. Essas **não aparecem** no modo cronometrado.

Para conferir o banco, abra o quiz com `#teste` no final do endereço (ex.: `.../index.html#teste`).

## Jogo em grupo: use o Kahoot

A sala ao vivo e o painel do professor foram retirados do app. Para jogar com a turma, monte o quiz no Kahoot (o Claude consegue criar o quiz no Kahoot a partir das perguntas). O app fica só com o estudo individual, sem servidor e sem internet para funcionar: o histórico, o caderno de erros e o desempenho do aluno ficam no próprio aparelho.

## Nuvem opcional: histórico do aluno em qualquer aparelho

Sem configurar nada, o app funciona só no aparelho. Para o histórico (acertos, erros, caderno de erros, rodadas) acompanhar o aluno, use o Firebase gratuito (plano Spark, sem prazo de validade). **Não use o "Data Connect/SQL" do Firebase**: esse é pago depois do período de teste.

**Configuração (uma vez):**
1. Em https://console.firebase.google.com crie um projeto (pode desativar o Analytics).
2. **Build → Authentication → Sign-in method**: ative **E-mail/senha** (o aluno não vê e-mail: o app cria uma conta interna a partir do código).
3. **Build → Firestore Database → Create database**, em modo de produção. Na aba **Rules**, cole e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /alunos/{uid} {
      allow read, delete: if request.auth != null && request.auth.uid == uid;
      allow create, update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['dados','ts'])
        && request.resource.data.dados is string
        && request.resource.data.dados.size() < 300000;
    }
  }
}
```
4. **Configurações do projeto → Geral → Seus apps → Web (</>)**: registre um app e copie `apiKey` e `projectId` para o arquivo `firebase-config.js`. Envie-o ao GitHub.
5. (Recomendado) No Google Cloud Console, em **APIs e serviços → Credenciais**, restrinja a chave de API ao endereço do seu GitHub Pages.

**Códigos dos alunos:** em `editor.html`, seção **Códigos dos alunos**, gere e imprima uma lista (um código por aluno, ex.: `K7M2-QX9P`). O aluno digita o código em **Desempenho → Minha conta** e a conta é criada na primeira vez. Cada aluno só acessa o próprio documento (regras acima). Guarde a lista de códigos com você.

**Como funciona:** o aparelho continua sendo a cópia principal. Depois de cada resposta o app envia os dados em segundo plano; ao entrar em outro aparelho, o histórico é baixado e unido ao que já existe. Relatórios ("O que melhorar", evolução por semana) são calculados no próprio aparelho. Para a escola: o app guarda só o código, as respostas e as datas, sem nome real. Avise a direção e as famílias sobre a coleta (LGPD).

**Limites:** quem souber o código de um aluno acessa o histórico dele, então trate o código como senha. O plano gratuito tem limites diários de leituras e escritas, suficientes para turmas; acompanhe o consumo no console.

## Dois quizzes na mesma aplicação

A página inicial (`index.html`) pergunta qual quiz abrir. Para abrir direto, use `index.html?q=eletro`, `?q=fluidos` ou `?q=termo`. O botão Voltar leva à escolha. Cada quiz guarda caderno de erros, ranking e desempenho separados. 

**Só o quiz escolhido é carregado:** ao abrir `?q=fluidos`, o navegador baixa apenas `perguntas-fluidos.js`, `quiz-fluidos.js` e `figuras-fluidos.js`, em vez de todos os bancos. (O arquivo único `Quiz__Eletrost_tica_3.html` traz tudo embutido.)

**Para criar outro quiz:** copie `quiz-fluidos.js`, `perguntas-fluidos.js` e `figuras-fluidos.js` com o novo nome e ajuste o conteúdo (as chaves das áreas devem ser diferentes das dos outros quizzes). Depois registre os três arquivos na lista `ARQ` no fim de `script.js`, no `sw.js`, no `editor.html` e em `validar-banco.js` (ele já os encontra pelo nome), e acrescente um botão `data-q` na tela de escolha de `index.html`.

As perguntas de Fluidos foram escritas para este projeto (não são cópia do livro) e devem ser revisadas pelo professor. Os retratos de Torricelli, Pascal, Arquimedes e Stevin são ilustrações simples feitas no próprio código.

## Recursos do professor

- **Lista ou prova para imprimir:** no quiz, menu Lista: escolha o número de questões, o formato (lista ou prova com cabeçalho) e o gabarito em página separada.
- **Editor de questões** (`editor.html`): crie, edite, duplique e oculte perguntas. As alterações ficam neste aparelho. Para os alunos receberem as perguntas, toque em **Gerar arquivo para os alunos**, que baixa o `banco-proprio.js`, e envie esse arquivo ao GitHub no lugar do que já existe. Também exporta e importa em JSON.

## Recursos do aluno

- **Caderno de erros:** guarda as perguntas que o aluno errou, com a explicação. O botão "Treinar com meus erros" refaz essas perguntas, e uma pergunta sai do caderno depois de 2 acertos seguidos. Dá para exportar o caderno em um código e importar em outro aparelho.
- **Meu desempenho:** perguntas vistas e dominadas por área, treino adaptativo (mais perguntas das que errou ou não vê há tempo) e evolução por rodada.

## Conferir o banco de perguntas

Depois de editar um `perguntas-*.js`, rode `node validar-banco.js` (precisa do Node.js). Ele aponta ids repetidos, gabarito fora das alternativas, alternativas repetidas ou vazias, áreas inexistentes e figuras que faltam. No GitHub, a mesma conferência roda sozinha a cada envio (aba **Actions**); se aparecer um X vermelho, abra o detalhe para ver a pergunta com problema.
