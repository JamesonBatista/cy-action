# Cypress Action Command

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

After installation, you need to import and register the `action` command in Cypress. Add the following code to your Cypress commands file (usually `cypress/support/commands.js` or `cypress/support/e2e.js`):

```javascript
require("cypress-action");
```

![[config]](src/e2e.png)

![[cy-action]](src/image.png)(https://youtu.be/fl0olsqrz6U)

## Uso

The `cy.action` command can be used in your Cypress tests as follows:

```javascript
// Example of using the `action` command
cy.action(
  { attr: "my-selector", text: "Action description" },
  { timeout: 10000 }
).click(); // Options passed as second argument
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

## Contributions

Contributions are always welcome. Feel free to open issues or send pull requests.

## License

This project is licensed under the terms of the MIT License.
