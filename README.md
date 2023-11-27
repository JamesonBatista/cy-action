# Cypress Action Command

Este pacote fornece um comando personalizado `action` para o Cypress, permitindo a realização de diversas ações em elementos do DOM com base em seletores específicos e opções de customização.

## Características

- Suporta seleção de elementos via atributos, tags, seletores CSS e XPath.
- Permite a passagem de opções do Cypress, como `timeout`.
- Oferece uma descrição personalizada para cada ação, melhorando a legibilidade dos logs de teste.

## Instalação

Para instalar o pacote, execute o seguinte comando no seu projeto Cypress:

```bash
npm i cy-action
```

## Configuração

Após a instalação, você precisa importar e registrar o comando `action` no Cypress. Adicione o seguinte código no seu arquivo de comandos Cypress (geralmente `cypress/support/commands.js` ou `cypress/support/e2e.js`):

```javascript
require("cy-action");
```

## Uso

O comando `cy.action` pode ser usado em seus testes Cypress da seguinte maneira:

```javascript
// Exemplo de uso do comando `action`
cy.action(
  { attr: "meu-seletor", text: "Descrição da ação" },
  { timeout: 10000 }
).click(); // Opções passadas como segundo argumento
```

### Parâmetros

- `attr`: O seletor do elemento (string). Pode ser um atributo, tag, seletor CSS ou XPath.
- `text`: Uma descrição da ação para ser exibida nos logs.
- `options`: Opções adicionais do Cypress, como `timeout`.

### Exemplos

#### Selecionando por Atributo

```javascript
cy.action({
  attr: "data-test-id=botao-login",
  text: "Clicando no botão de login",
}).type();
```

#### Selecionando por Tag

```javascript
cy.action({
  attr: "<button>",
  text: "Interagindo com botões",
}).click();
```

#### Selecionando por Xpath

```javascript
cy.action({
  attr: '//*[@id="page-walker"]/form/fieldset[1]/div[2]/div/input',
  text: "Interagindo com botões",
}).select();
```

#### Selecionando por fullXPath

```javascript
cy.action({
  attr: "/html/body/div/div/button",
  text: "Selecionando botão via XPath",
}).type();
```

## Contribuições

Contribuições são sempre bem-vindas. Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob os termos da licença MIT.
