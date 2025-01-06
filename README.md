# reddit-client
O projeto é destinado a criação de um aplicativo web que exibe múltiplos subreddits em colunas separadas e personalizáveis.

Link para o [Projeto Reddit Client](https://roadmap.sh/projects/reddit-client)

![Exemplo para o projeto](https://assets.roadmap.sh/guest/reddit-client-o876k.png)

## Ferramentas utilizadas no desenvolvimento

- HTML
- CSS
- JavaScript
    - Trabalhar com APIs externas
    - Requisições assíncronas
    - Gerenciar estados
    - Interfaces de usuários dinâmicas e responsivas
- NPM
    - [Marked](https://www.npmjs.com/package/marked)
    - [Webpack](https://www.npmjs.com/package/webpack)
    - [Webpack-CLI](https://www.npmjs.com/package/webpack-cli)
- [VS Code Studio](https://code.visualstudio.com/)
    - Extensão: Live Server

## Observações
O comando abaixo é relacionado ao webpack-cli. Ele executará a ferramenta webpack do arquivo node_modules, iniciando com o arquivo script.js e encontrando quaisquer instruções necessárias para substitui-los pelo código apropriado. Assim, por padrão, será criado a pasta dist com o arquivo main.js que será utilizado na aplicação.
```bash
./node_modules/.bin/webpack ./script.js --mode=development
```
O arquivo webpack.config.js, localizado neste repositório, elimina a necessidade de escrever o comando inteiro. Dessa forma, o comando se torna:
```bash
./node_modules/.bin/webpack
```
Quando o arquivo script.js for atualizado é necessário executar o comando novamente.
