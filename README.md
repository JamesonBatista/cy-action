# Cypress Action Command

![cypress](https://img.shields.io/badge/cy.action-1.0.0-brightgreen)
![cypress](https://img.shields.io/badge/cypress-13.6.0-brightgreen)
![xpath](https://img.shields.io/badge/xpath-2.0.1-green)
![generate-datafaker](https://img.shields.io/badge/datafaker-1.0.2-yellow)
![fileUpload](https://img.shields.io/badge/fileUpload-5.0.8-blue)

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

## Snippets

> action <br>
> actionIf

## Use

The `cy.action` command can be used in your Cypress tests as follows:

#### `text` in cy.action

    in cy.action the text parameter is not mandatory, but using it will help indicate the action, and use the visuals of your test

```javascript
// Example of using the `action` command
cy.action({ attr: "my-selector" }).click(); // Options passed as second argument
```

```javascript
// Example of using the `action` command
cy.action(
  { attr: 'name="nam"', text: "Action description", maxAttempts: 8 },
  null,
  {
    timeout: 10000000,
  }
).type("olá"); // Options passed as second argument
```

### Parameters

- `attr`: The element selector (string). It can be an attribute, tag, CSS or XPath selector.
- `text`: A description of the action to be displayed in the logs.
- `options`: Additional Cypress options, such as `timeout`.

### Examples

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

    action({
      attr: "/html/body/div/div/form/fieldset[2]/div[4]/div[2]/input",
      text: "full xpath",
    }, null, {timeout: 10000})
      .clear()
      .type(faker.generateName());
  });
```

### cy.action whith maxAttempts to inform how long to wait for the element to become visible

```javascript
action({
  attr: '//*[@id="page-walker"]/form/fieldset[1]/div[2]/div/input',
  text: "xpath",
  maxAttempts: 4,
}).type(faker.generateName());
```

## cy.action ifElse

```javascript
it("Tests ifElse", () => {
  // atributo
  action({ attr: 'name="name"', text: "attr", ifExist: true }, (el) =>
    el.type(faker.generateName())
  );
  //
  action({ attr: 'name="nam"', text: "attr not exist", ifExist: true }, (el) =>
    el.type(faker.generateName())
  );
  // cssSelector
  action(
    {
      attr: "#page-walker > form > fieldset:nth-child(3) > div:nth-child(3) > div:nth-child(1) > input[type=text]",
      text: "css selector",
      ifExist: true,
    },
    (el) => el.type(faker.generateEmails())
  );
  // cssSelector element not exist
  action(
    {
      attr: "#page-walker > form > fieldset:nth-child(3) > div:nth-child(3) > div:nth-child(1) > input[type=text]",
      text: "css selector not exist",
      ifExist: true,
    },
    (el) => el.type(faker.generateEmails())
  );
  // xpath
  action(
    {
      attr: '//*[@id="page-walker"]/form/fieldset[1]/div[3]/div[2]/input',
      text: "xpath element ",
      ifExist: true,
    },
    (el) => el.type(faker.generateCPF())
  );
  // xpath element not exist
  action(
    {
      attr: '//*[@id="page-walker"]/form/fieldset[1]/div[3]/div[2]/inpu',
      text: "xpath element not exist",
      ifExist: true,
    },
    (el) => el.type(faker.generateCPF())
  );
  //fullxpath
  action(
    {
      attr: "/html/body/div/div/form/fieldset[2]/div[4]/div[2]/input",
      text: "fullxpath elemen",
      ifExist: true,
    },
    (el) => el.type(faker.generateStreet())
  );
  //fullxpath not exist
  action(
    {
      attr: "/html/body/div/div/form/fieldset[2]/div[4]/div[2]/inpu",
      text: "fullxpath element not exist",
      ifExist: true,
    },
    (el) => el.type(faker.generateStreet())
  );

  // with options cypress
  action(
    {
      attr: "/html/body/div/div/form/fieldset[2]/div[4]/div[2]/inpu",
      text: "fullxpath element not exist",
      ifExist: true,
    },
    (el) => el.type(faker.generateStreet()),
    { timeout: 2000 }
  );
});
```

## O cy.action integration generate-datafaker

## Contributions

Contributions are always welcome. Feel free to open issues or send pull requests.

## License

This project is licensed under the terms of the MIT License.
