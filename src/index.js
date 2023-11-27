function action({ attr = "", text = "action page description" }, options = {}) {
  let cypress;
  let regex = /^[!@#$%¨&*()_+{}[\]:;,.?~\\\/|]/.test(attr);
  return cy.document({ log: false }).then((doc) => {
    cypress = cy.step(text);
    if (typeof attr === "object") {
      return cypress.get(attr, options).wait(1000, { log: false });
    }
    if (!attr.startsWith("<") && !attr.endsWith(">") && !regex) {
      let selector = doc.querySelectorAll(`[${attr}]`);
      if (selector.length > 0) {
        return cypress.get(selector, options).wait(1000, { log: false });
      } else {
        return searching(`[${attr}]`);
      }
    } else if (
      attr.startsWith("<") &&
      attr.endsWith(">") &&
      !attr.startsWith("//") &&
      !attr.startsWith("/") &&
      !regex
    ) {
      const tags = attr.match(/<([^>]*)>/);
      let forTag = doc.querySelectorAll(tags[1]);
      if (forTag.length > 0) {
        return cypress.get(forTag, options).wait(1000, { log: false });
      } else {
        return searching(tags[1], cypress);
      }
    } else if (attr.includes(">")) {
      const cssSelector = doc.querySelectorAll(attr);
      if (cssSelector.length > 0) {
        return cypress.get(attr, options).wait(1000, { log: false });
      } else {
        return searching(attr, cypress);
      }
    } else if (regex && attr.startsWith("/ht")) {
      return fullPage(attr).then((el) => {
        const log = {
          name: "fullXpath",
          message: attr,
          consoleProps: () => {
            return {
              XPath: attr,
              "Results length": el.length,
              Result: el,
            };
          },
        };
        Cypress.log(log);
        if (el) {
          return cypress.get(el, options).wait(1000, { log: false });
        } else {
          searching(attr, cypress);
        }
      });
    } else {
      return searchingXpath(attr, cypress);
    }
  });

  function fullPage(xpath) {
    return cy.document({ log: false }).then((document) => {
      return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    });
  }
}
Cypress.Commands.add("action", (options, getOptions) => {
  return action(options, getOptions);
});
