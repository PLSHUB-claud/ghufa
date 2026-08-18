# Relatório de Segurança — GHUFA Web v6

## Escopo

Projeto analisado a partir do ZIP enviado pelo proprietário. A revisão cobriu:

- `index.html`
- `styles.css`
- `app.js`
- `app.source.js`
- `playlist.json`
- `secure_server.py`
- histórico Git presente no ZIP
- executável `cloudflared.exe` empacotado no projeto

A análise foi estática e defensiva. O executável não foi executado.

## Resumo executivo

Não foi encontrado um caminho confirmado para **tomar o site, realizar defacement remoto, roubar cookies/tokens, executar código no servidor ou enviar arquivos arbitrários ao host**.

Os problemas mais importantes eram de **hardening do frontend e do servidor local**:

1. `app.js` executava o payload via `new Function(...)`, impedindo uma CSP forte e criando uma superfície desnecessária de execução dinâmica.
2. A playlist era renderizada com `innerHTML`, criando sinks de DOM XSS caso a origem dos metadados se torne controlável externamente no futuro.
3. Não havia Content Security Policy nem headers defensivos no servidor local.
4. O bloco anti-DevTools usava `Function("debugger")()` em loop e limpeza de console; isso não protege o código e piora segurança/manutenção.
5. O servidor local podia ser endurecido contra acesso a dotfiles, symlinks e abuso de conexões caso fosse exposto por túnel.
6. O player criava `blob:` URLs sem revogá-las e aceitava qualquer arquivo fornecido ao input sem validação adicional no JavaScript.
7. A área “About You” consulta um serviço externo para mostrar o IP público, gerando uma questão de privacidade/terceiro.

A versão endurecida incluída junto deste relatório corrige esses itens sem mudar o layout visual do site.

---

# Achados

## GHF-01 — Execução dinâmica via `new Function`

**Severidade:** Média  
**Status original:** Confirmado  
**Status corrigido:** Corrigido

### Evidência

O `app.js` original reconstruía código usando Base64 + XOR (`0x5a`) e então executava o resultado com `new Function(...)`.

O payload foi decodificado de forma estática, sem ser executado. Após normalização de finais de linha, o conteúdo decodificado é **idêntico a `app.source.js`**.

SHA-256 do conteúdo normalizado:

`7f7dbd3c7c0507d6aeb8f22db68a4fc0c07bff6ead4bdf61569971640d27d078`

Isso significa que não havia uma segunda carga escondida diferente do source legível analisado.

### Risco

- exige comportamento equivalente a `eval`;
- impede usar `script-src 'self'` de forma limpa em CSP;
- dificulta auditoria e manutenção;
- ofuscação não protege segredos presentes no cliente.

### Correção aplicada

- `app.js` agora usa diretamente o código endurecido;
- removido `new Function`;
- removido o loader Base64/XOR em runtime;
- CSP agora pode usar `script-src 'self'` sem `unsafe-eval`.

### Recomendação para builds futuros

Se quiser ofuscar/minificar por estética ou para dificultar cópia casual, use apenas transformação estática de nomes/minificação. Não gere uma string de JavaScript para executar via `eval`/`Function`.

---

## GHF-02 — Sinks de DOM XSS usando `innerHTML`

**Severidade:** Baixa no estado atual / Média-Alta se a playlist virar entrada externa  
**Status original:** Confirmado  
**Status corrigido:** Corrigido

### Evidência

A versão original usava `innerHTML` ao renderizar:

- `track.title`
- `track.sub` / artista
- atributos `title`

Atualmente os valores da playlist estão hardcoded no próprio JavaScript, portanto **não foi identificado um vetor remoto atual que permita ao visitante controlar esses campos**.

### Risco futuro

Se a playlist passar a ser carregada de:

- `playlist.json` alterável por usuário;
- API;
- query string/hash;
- painel administrativo;
- banco de dados;
- conteúdo enviado por terceiros;

um título malicioso poderia se transformar em HTML interpretado pelo navegador.

### Correção aplicada

- removido `innerHTML` da renderização da playlist;
- uso de `document.createElement()`;
- uso de `textContent` para texto;
- uso da propriedade `.title` para tooltip;
- limpeza com `replaceChildren()`.

### Critério de aceitação

`app.js` não deve conter `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval` ou `new Function` para dados de playlist.

---

## GHF-03 — Ausência de Content Security Policy

**Severidade:** Média (defesa em profundidade)  
**Status original:** Confirmado  
**Status corrigido:** Parcial/Completo conforme hospedagem

### Risco

Sem CSP, uma futura falha de injeção HTML/JS tem menos barreiras para virar execução de script.

### Correção aplicada

Foi adicionada CSP no `index.html` compatível com o site atual:

- scripts apenas do próprio site;
- objetos bloqueados;
- frames bloqueados;
- conexões externas limitadas ao endpoint usado para IP;
- mídia local e `blob:` permitidas;
- `base-uri` bloqueado;
- formulários bloqueados.

O `secure_server.py` também envia CSP via header e inclui `frame-ancestors 'none'`.

### Observação de hospedagem

A política via `<meta http-equiv="Content-Security-Policy">` protege grande parte do frontend, mas alguns controles são mais fortes quando enviados como header HTTP. Se a publicação passar por reverse proxy/CDN, configure os headers no proxy também.

---

## GHF-04 — “Anti-inspect” não é mecanismo de segurança

**Severidade:** Baixa  
**Status original:** Confirmado  
**Status corrigido:** Corrigido

### Evidência

O código original:

- bloqueava F12;
- bloqueava Ctrl+Shift+I/J/C;
- bloqueava Ctrl+U e Ctrl+S;
- bloqueava botão direito;
- executava `Function("debugger")()` a cada ~400 ms;
- limpava o console periodicamente.

### Risco

Não impede alguém de baixar o JavaScript, usar outro cliente HTTP, desabilitar JS ou analisar o repositório. Também:

- quebra acessibilidade/usabilidade;
- dificulta diagnóstico;
- força execução dinâmica incompatível com CSP forte;
- pode degradar desempenho.

### Correção aplicada

Bloco removido integralmente.

---

## GHF-05 — Fingerprinting e consulta de IP de terceiro

**Severidade:** Média para privacidade / Baixa para comprometimento do site  
**Status:** Mantido com hardening

### Evidência

A janela “About You” lê dados disponíveis no navegador, incluindo:

- user-agent;
- idioma;
- resolução;
- profundidade de cor;
- plataforma;
- memória aproximada;
- quantidade de threads lógicas;
- tipo de conexão;
- timezone;
- tamanho da janela;
- Do Not Track;
- estado de cookies.

Também consulta `https://api.ipify.org?format=json` para exibir o IP público.

### Correção aplicada

A função estética foi preservada, mas a consulta externa agora usa:

- `credentials: "omit"`;
- `referrerPolicy: "no-referrer"`;
- `cache: "no-store"`;
- timeout de 4 segundos;
- validação do formato/tamanho da resposta antes de exibir.

### Recomendação opcional

Se quiser o menor impacto de privacidade possível, remova a consulta de IP ou coloque a exibição atrás de consentimento explícito do visitante.

---

## GHF-06 — `blob:` URL não era revogada e upload local tinha validação mínima

**Severidade:** Baixa  
**Status original:** Confirmado  
**Status corrigido:** Corrigido

### Risco

Não foi encontrado upload para servidor; o arquivo é carregado localmente no navegador. Porém o código original mantinha Object URLs sem `URL.revokeObjectURL()`, podendo acumular memória durante a sessão.

### Correção aplicada

- revoga a Object URL anterior antes de criar outra;
- revoga ao voltar para uma faixa do acervo;
- revoga no `pagehide`;
- limita arquivo local a 100 MiB;
- rejeita MIME explicitamente não-audio;
- limita o nome mostrado na UI.

---

## GHF-07 — Hardening de caminho no servidor local

**Severidade:** Média se exposto externamente / Baixa em localhost  
**Status original:** Melhorável  
**Status corrigido:** Corrigido

### Contexto

O servidor escutava apenas `127.0.0.1`, o que reduz bastante o impacto. Porém o projeto também contém referência a uso de Cloudflare Tunnel; um túnel pode tornar um serviço de localhost acessível externamente.

### Melhorias aplicadas

- resolução canônica com `Path.resolve()`;
- bloqueio de `..`;
- bloqueio de dotfiles/dot-directories;
- bloqueio de backslash em URL;
- proteção contra symlink que aponte para fora da raiz;
- allowlist de extensões;
- diretório sem listagem;
- POST/PUT/DELETE/PATCH bloqueados;
- headers defensivos;
- timeout de socket;
- limite de 32 conexões concorrentes.

### Testes executados

- `/` retornou `200`;
- symlink `escape.html -> /etc/hosts` retornou `403`;
- tentativa de acesso a `/.git/config` retornou `403`.

---

## GHF-08 — Ausência de headers defensivos no servidor local

**Severidade:** Média como hardening  
**Status corrigido:** Corrigido

Foram adicionados:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

---

## GHF-09 — `.git/` dentro do ZIP distribuído

**Severidade:** Informativa/Baixa  
**Status:** Removido da versão endurecida

O ZIP original contém o diretório `.git`, incluindo objetos e histórico. Isso aumenta o pacote e pode expor arquivos apagados/versões antigas caso algum segredo tenha sido commitado anteriormente.

Neste projeto, a busca realizada nos commits disponíveis não encontrou:

- API keys;
- tokens;
- passwords;
- private keys;
- Discord webhooks;
- Bearer tokens.

Como o repositório já é público, o impacto adicional é menor, mas `.git/` não deve fazer parte de um pacote de deploy.

---

## GHF-10 — `cloudflared.exe` empacotado

**Severidade:** Informativa  
**Status:** Verificado e removido do pacote web endurecido

O executável original não foi executado.

SHA-256 calculado:

`c29eee2b121f5436a642eed69fd9767da7e7b8c510fa50aaa130337f931357b5`

Metadados internos indicam `cloudflared` versão `2026.8.2`, build de 14/08/2026.

O SHA-256 coincide com o checksum publicado para o binário oficial `cloudflared-windows-amd64.exe` da release 2026.8.2.

Mesmo sendo legítimo, ele foi removido do pacote web endurecido porque não é necessário para servir os arquivos estáticos. Se precisar dele, prefira manter a ferramenta instalada/separada do diretório publicado.

---

# Itens que NÃO foram encontrados

Durante esta revisão não encontrei evidência de:

- roubo de cookies;
- roubo de token Discord;
- coleta de senhas;
- keylogger;
- acesso a webcam/microfone;
- geolocalização GPS;
- `sendBeacon` para exfiltração;
- WebSocket oculto;
- webhook Discord;
- backend com autenticação quebrada;
- endpoint de upload remoto;
- RCE no servidor;
- SSRF;
- SQL injection;
- LFI remoto confirmado;
- caminho confirmado de defacement remoto;
- segredo/API key exposto no código ou nos dois commits disponíveis.

---

# Arquivos alterados na versão endurecida

- `app.js`
- `app.source.js`
- `index.html`
- `secure_server.py`

Também foram removidos do pacote de distribuição:

- `.git/`
- `cloudflared.exe`

Os assets, CSS, músicas, capas e layout foram mantidos.

---

# Checklist para o Gemini

Use isto como critério de aceitação caso novas mudanças sejam feitas:

- [ ] Não reintroduzir `eval()` ou `new Function()`.
- [ ] Não usar `innerHTML` para metadados de música, dados de API ou entrada de usuário.
- [ ] Preferir `textContent`, `createElement` e propriedades DOM.
- [ ] Manter `script-src 'self'` sem `unsafe-eval`.
- [ ] Se a playlist passar para JSON/API, validar estrutura, tamanho e URLs antes de usar.
- [ ] Nunca colocar token/API key/segredo em JavaScript do frontend.
- [ ] Manter `rel="noopener noreferrer"` em links `target="_blank"`.
- [ ] Não publicar `.git/`, arquivos `.env`, logs ou binários auxiliares junto do site.
- [ ] Se o servidor local for exposto por túnel, manter limites de conexão/timeouts ou usar servidor web de produção.
- [ ] Preservar `X-Content-Type-Options`, CSP, Referrer-Policy e Permissions-Policy.
- [ ] Se houver coleta/armazenamento futuro de fingerprint/IP, tratar isso explicitamente como dado de privacidade.
- [ ] Rodar `node --check app.js` após alterações.
- [ ] Rodar `python -m py_compile secure_server.py` após alterações.

---

# Resultado final da revisão

**Risco geral antes:** Baixo a Médio.  
**Risco geral depois do hardening:** Baixo para a arquitetura atual de site estático.

O site tinha várias medidas que pareciam “segurança” visualmente, mas as correções importantes são as que reduzem execução dinâmica, sinks HTML, exposição desnecessária e superfície do servidor local.
