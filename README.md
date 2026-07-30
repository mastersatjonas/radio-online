# Rádio IDE — Frontend

Frontend estático criado em HTML, CSS e JavaScript para a **Rádio IDE — A Voz que Transforma**.

## Arquivos

- `index.html`: estrutura da página.
- `styles.css`: todo o visual e responsividade.
- `script.js`: links, vídeo do YouTube e programação.
- `img/logo.png`: logotipo .

## Como abrir

Dê dois cliques em `index.html` ou abra a pasta no VS Code e use a extensão **Live Server**.

## O que alterar primeiro

Abra `script.js` e edite o objeto `RADIO_CONFIG`:

```js
const RADIO_CONFIG = {
  youtubeVideoId: "ID_DO_VIDEO",
  youtubeChannelUrl: "LINK_DO_CANAL",
  instagramUrl: "LINK_DO_INSTAGRAM",
  whatsappNumber: "5563999999999",
  whatsappMessage: "Mensagem inicial do WhatsApp"
};
```

No campo `youtubeVideoId`, informe somente o código do vídeo.

Exemplo:

- Link: `https://www.youtube.com/watch?v=kVv9I2VFStQ`
- ID: `kVv9I2VFStQ`

## Programação

No mesmo `script.js`, altere os itens do array `PROGRAMACAO`. O site identifica automaticamente o programa que está no ar conforme o horário do visitante.

## Publicação no Netlify

1. Entre no Netlify.
2. Arraste a pasta `radio-ide-frontend` para a área de publicação.
3. Aguarde a geração do endereço público.

## Observações

- A reprodução automática com som pode ser bloqueada pelos navegadores.
- O endereço do WhatsApp deve conter apenas números, sem `+`, espaços ou traços.
- Substitua `img/logo.svg` pela logo oficial quando ela estiver disponível.
