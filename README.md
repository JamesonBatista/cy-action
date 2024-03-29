# Cypress Action Command

![cypress](https://img.shields.io/badge/cy.action-1.0.0-brightgreen)
![cypress](https://img.shields.io/badge/cypress-13.6.0-brightgreen)
![xpath](https://img.shields.io/badge/xpath-2.0.1-green)
![generate-datafaker](https://img.shields.io/badge/datafaker-1.0.2-yellow)
![fileUpload](https://img.shields.io/badge/fileUpload-5.0.8-blue)

### generate-datafaker

[generate-datafaker](https://www.npmjs.com/package/generate-datafaker)

### Required

| NodeJs
| Cypress version 10 >

This package provides a custom `action` command for Cypress, allowing you to perform various actions on DOM elements based on specific selectors and customization options.

## Characteristics

- Supports element selection via attributes, tags, CSS and XPath selectors.
- Allows passing of Cypress options such as `timeout`.
- Provides a personalized description for each action, improving the readability of test logs.

## Installation

To install the package, run the following command in your Cypress project:

```bash
npm i cypress-action
```

## Use Snippets in cy.action

> ### action<br>
>
> ### action<br>
>
> ### actionIf<br>
>
> ### elseIf<br>
>
> ### test_bdd<br>
>
> ### test_action<br>
>
> ### test_bdd_BR<br>
>
> ### scenario<br>
>
> ### given<br>
>
> ### when<br>
>
> ### and<br>
>
> ### then<br>
>
> ### cenario<br>
>
> ### dado<br>
>
> ### quando<br>
>
> ### e<br>
>
> ### entao<br>
>
> <br>

## Settings

```javascript

cy.action automatically adds dependencies to the project in e2e.js file
```

```javascript
import "cypress-plugin-steps";
require("cypress-action");
import "cypress-file-upload";
require("cypress-xpath");
export const faker = require("generate-datafaker");
import "cypress-wait-until";
```

## Use

The `cy.action` command can be used in your Cypress tests as follows:

#### `text` in cy.action

    in cy.action the text parameter is not mandatory, but using it will help indicate the action, and use the visuals of your test

```javascript
// Example of using the `action` command
cy.action({ attr: "my-selector" }).click(); // Options passed as second argument
```

### Parameters

- `attr`: The element selector (string). It can be an attribute, tag, CSS or XPath selector.
- `text`: A description of the action to be displayed in the logs.
- `options`: Additional Cypress options, such as `timeout`.

### Examples

```javascript
cy.action({ attr: "my-selector" }, { timeout: 10000 }).click();
```

#### Selecting by Attribute

```javascript
cy.action({
  attr: "data-test-id=botao-login",
  text: "Clicking the login button",
}).type();
```

#### Selecting by Tag

```javascript
cy.action({
  attr: "<button>",
  text: "Interacting with buttons",
}).click();
```

#### Selecting by Xpath

```javascript
cy.action({
  attr: '//*[@id="page-walker"]/form/fieldset[1]/div[2]/div/input',
  text: "Interacting with buttons",
}).select();
```

#### Selecting by fullXPath

```javascript
cy.action({
  attr: "/html/body/div/div/button",
  text: "Selecting button via XPath",
}).type();
```

```javascript
cy.action({ attr: "<form>", text: "action mapeando caminho" })
  .find(".field")
  .find('[placeholder="Nome completo"]')
  .clear()
  .type("Teste buscando por camadas usando tags");
```

```javascript
// attachFile
cy.action({ attr: 'type="file"', text: "attachFile include" }).attachFile(
  "image.png"
);
```

```javascript
// cssSelector
cy.action({
  attr: "#page-walker > form > fieldset:nth-child(3) > div:nth-child(2) > div > input[type=text]",
  text: "action por selector",
})
  .clear()
  .type("Teste com selector");
```

```javascript
// action not text
cy.action({ attr: 'name="name"' }).clear().type("Teste sem texto de ação");
```

```javascript
// attribute
cy.action({ attr: 'name="name"', text: "action por atributo" }).type(
  "Teste com atributo"
);
our
cy.action({ attr: 'placeholder="Nome completo"', text: "action por atributo" }).type(
  "Teste com atributo"
);

<input type="text" name="name" placeholder="Nome completo">
```

```javascript
action({ attr: 'name="name"', text: "attr" })
  .clear()
  .type(faker.generateName());

action({
  attr: "#page-walker > form > fieldset:nth-child(3) > div:nth-child(2) > div > input[type=text]",
  text: "cssSelector",
})
  .clear()
  .type(faker.generateName());

action({
  attr: '//*[@id="page-walker"]/form/fieldset[1]/div[2]/div/input',
  text: "xpath",
})
  .clear()
  .type(faker.generateName());

action(
  {
    attr: "/html/body/div/div/form/fieldset[2]/div[4]/div[2]/input",
    text: "full xpath",
  },
  { timeout: 10000 }
)
  .clear()
  .type(faker.generateName());
```

### cy.action whith maxAttempts to inform how long to wait for the element to become visible

```javascript
action({
  attr: '//*[@id="page-walker"]/form/fieldset[1]/div[2]/div/input',
  text: "xpath",
  maxAttempts: 4,
}).type(faker.generateName());
```

# elseIf action in element

```javascript
// elseIf with input
cy.elseIf('input[name="cpf"]').type("07957743463", { force: true });

// else If with select
cy.elseIf('select[name="cpf"]')
  .value("07957743463")
  .select("07957743463", { force: true });

// else If with  button
cy.elseIf('button[name="cpf"]').click({ force: true });

// else If with  button and value/text
cy.elseIf('button[name="cpf"]').value("Click Me").click({ force: true });

// elseIf with label
cy.elseIf('label[name="cpf"]').value("Entry password").click({ force: true });

// elseIf with label
cy.elseIf('label[name="cpf"]').click({ force: true });

// Usando elseIf para selecionar um elemento com um seletor CSS específico
cy.elseIf("#meuElemento").click({ force: true });

// Especificando o tipo de tag para um elemento existente e tratando-o conforme necessário
cy.elseIf(
  "#page-walker > form > fieldset:nth-child(3) > div:nth-child(3) > div:nth-child(2) > select[type=text]"
)
  .value("minhaOpção")
  .select("minhaOpção", { force: true });

// Para um botão, por exemplo, apenas para verificar se existe
cy.elseIf("#meuBotao").value("Click Me").click({ force: true });

cy.elseIf(
  "#page-walker > form > fieldset:nth-child(3) > div:nth-child(2) > div > input[type=text]"
).type(faker.generateName(), { force: true });
```

# Mixed Functions

```javascript
cy.action({ attr: selects.fillName })
  .click()
  .elseIf('input[name="name"]')
  .type("Test");

cy.action({ attr: selects.fillEmail })
  .click()
  .act('name="email"') //action
  .type("Test#test.com");

cy.action({ attr: selects.fillName })
  .click()
  .If('input[name="name"]') // elseIf
  .type("Test");
```

## Use BDD in cy.action

```javascript
import { Dado, Cenario, faker, Quando, E, Entao } from "../support/e2e";

Cenario("", function () {
  Dado("", function () {}, {});
  Quando("", function () {}, {});
  E("", function () {}, {});
  Entao("", function () {}, {});
});
```

## BDD whit options skip and only

```javacript
import { Dado, Cenario, faker, Quando, E, Entao } from "../support/e2e";

Cenario("Tests", function () {

 Dado("Dado tests", function () {

 }, { skip: true });

 Quando("Quando tests", function () {

 }, { only: true });
});

```

## Use cy.visit config

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportHeight: 1000,
  viewportWidth: 1400,

  env: {
    title: "Tests With Cypress and cy.action 💥",
    subTitle: "CY.ACTION presentation",
    styles: {
      background: "red",
      text: "green",
    },
  },
});
```

## O cy.action integration generate-datafaker

## Contributions

Contributions are always welcome. Feel free to open issues or send pull requests.

## License

This project is licensed under the terms of the MIT License.
