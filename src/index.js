import { actionStorage } from "./gherkin/bdd.js";

const applyStyles = require("./style.js");
require("./gherkin/bdd.js");
let startStyle = false;
export function action(
  { attr = "", text = null, maxAttempts = 3 },
  options = {}
) {
  let regex = /^[!@#$%¨&*()_+{}[\]:;,.?~\\\/|]/.test(attr);
  return cy.document({ log: false }).then((doc) => {
    let cypress;
    if (text) {
      cypress = cy.step(text);
    } else {
      cypress = cy;
    }

    if (typeof attr === "object") {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }
      actionStorage.find.element = attr;
      return cypress.get(attr, options).wait(500, { log: false });
    }

    if (attr.startsWith("//")) {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }
      return cypress
        .xpath(attr, options)
        .wait(500, { log: false })
        .then((element) => {
          actionStorage.find.element = element;
          return element;
        });
    }

    const selector = elementRefactorySelector(attr, regex, doc);
    if (typeof selector === "object") {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }
      actionStorage.find.element = selector;
      return cypress.get(selector, options).wait(500, { log: false });
    }

    if (doc.querySelectorAll(selector).length > 0) {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }

      actionStorage.find.element = doc.querySelectorAll(selector);
      return cypress
        .get(doc.querySelectorAll(selector), options)
        .wait(500, { log: false });
    } else {
      return searching(selector, options, maxAttempts);
    }
  });
}
export function act(attr = "", maxAttempts = 3, options = {}) {
  let regex = /^[!@#$%¨&*()_+{}[\]:;,.?~\\\/|]/.test(attr);
  return cy.document({ log: false }).then((doc) => {
    let cypress = cy;

    if (typeof attr === "object") {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }
      actionStorage.find.element = attr;
      return cypress.get(attr, options).wait(500, { log: false });
    }

    if (attr.startsWith("//")) {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }
      return cypress
        .xpath(attr, options)
        .wait(500, { log: false })
        .then((element) => {
          actionStorage.find.element = element;
          return element;
        });
    }

    const selector = elementRefactorySelector(attr, regex, doc);
    if (typeof selector === "object") {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }
      actionStorage.find.element = selector;
      return cypress.get(selector, options).wait(500, { log: false });
    }

    if (doc.querySelectorAll(selector).length > 0) {
      if (!window && !actionStorage.find) {
        actionStorage.find = {};
      }

      actionStorage.find.element = doc.querySelectorAll(selector);
      return cypress
        .get(doc.querySelectorAll(selector), options)
        .wait(500, { log: false });
    } else {
      return searching(selector, options, maxAttempts);
    }
  });
}
function elseIf(num, attr, elements) {
  if (num > 0) {
    const log = {
      name: "if",
      message: `✅  exist:  ${attr} `,
      consoleProps: () => {
        return {
          XPath: attr,
          "Results length": elements?.length,
          Result: elements,
        };
      },
    };
    Cypress.log(log);
  } else {
    const log = {
      name: "else",
      message: `🔴  skipped:  ${attr} not found`,
      consoleProps: () => {
        return {
          XPath: attr,
          "Results length": elements,
          Result: elements,
        };
      },
    };
    Cypress.log(log);
  }
}

function searching(attr, options, maxAttempts) {
  const baseWaitTime = 3000; // 3000ms ou 3 segundos

  const attempts = (attempt = 1) => {
    return cy.document({ log: false }).then((doc) => {
      const waitTime = attempt * baseWaitTime;

      return cy
        .log(`🔍 searching *${attr}*, ${attempt}ª tentativa...`)
        .wait(waitTime)
        .then(() => {
          let selector = doc.querySelectorAll(attr);
          if (selector.length > 0) {
            return cy.get(selector, options).wait(500, { log: false });
          } else if (attempt < maxAttempts) {
            return attempts(attempt + 1);
          }

          return cy.wrap(null, { log: false });
        });
    });
  };

  return attempts(); // Inicia a primeira tentativa
}

const searchingXpathifElse = (xpathSelector) => {
  return cy.document({ log: false }).then((doc) => {
    return new Cypress.Promise((resolve) => {
      let nodes = [];
      let contextNode = doc;
      let iterator = doc.evaluate(
        xpathSelector,
        contextNode,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
      );

      let node = iterator.iterateNext();
      while (node) {
        nodes.push(node);
        node = iterator.iterateNext();
      }

      if (nodes.length > 0) {
        resolve(cy.wrap(nodes, { log: false }));
      } else {
        resolve(cy.wrap([], { log: false }));
      }
    });
  });
};

function elementRefactorySelector(attr, regex, doc) {
  let xSelector = null;

  if (!doc || !doc.evaluate) {
    doc = cy.state("window").document;
  }

  if (
    !attr.startsWith("<") &&
    !attr.endsWith(">") &&
    !regex &&
    !attr.startsWith("/ht")
  ) {
    xSelector = `[${attr}]`;
  } else if (
    attr.startsWith("<") &&
    attr.endsWith(">") &&
    !attr.startsWith("//") &&
    !attr.startsWith("/") &&
    !regex
  ) {
    const tags = attr.match(/<([^>]*)>/);
    xSelector = tags[1];
  } else if (attr.includes(">")) {
    xSelector = attr;
  } else if (attr.startsWith("/ht")) {
    return doc.evaluate(
      attr,
      doc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  } else {
    return searchingXpathifElse(attr);
  }

  return xSelector;
}
Cypress.Commands.add("action", (options, getOptions) => {
  return action(options, getOptions);
});
Cypress.Commands.add("act", (options, getOptions) => {
  return act(options, getOptions);
});
Cypress.Commands.add(
  "attributes",
  { prevSubject: true },
  (subject, attributes) => {
    return cy.wrap(subject, { log: false }).filter(
      (index, el) => {
        return Object.entries(attributes).every(([attr, value]) => {
          return el.getAttribute(attr) === value;
        });
      },
      { log: false }
    );
  }
);

Cypress.Commands.add("If", (selector, options = {}) => {
  const { text = null, error = false } = options;
  let cyaction = cy;
  if (text) {
    cyaction = cy.step(text);
  }
  return cy.window({ log: false }).then((win) => {
    let elementExists = win.document.querySelector(selector);

    if (!elementExists) {
      if (error) {
        return cyaction.get(selector);
      }

      if (selector.startsWith("#") && selector.includes("select")) {
        const newSelect = document.createElement("select");
        newSelect.style.display = "none";
        win.document.body.appendChild(newSelect);
        elementExists = newSelect;
        let notFind = cyaction;
        notFind.then(() => {
          elseIf(0, selector, newSelect);
        });
        return notFind.wrap(newSelect, { log: false });
      } else {
        const matches = selector.match(/(\w+)\[/);
        const elementType = matches && matches[1] ? matches[1] : "div";
        const newElement = document.createElement(elementType);
        newElement.style.display = "none";
        win.document.body.appendChild(newElement);
        elementExists = newElement;
        let notFind = cyaction;
        notFind.then(() => {
          elseIf(0, selector, elementExists);
        });
        return notFind.wrap(newElement, { log: false });
      }
    }

    let findOK = cyaction;
    findOK.then(() => {
      elseIf(1, selector, elementExists);
    });
    return findOK.wrap(elementExists, { log: false });
  });
});
Cypress.Commands.add("elseIf", (selector, options = {}) => {
  const { text = null, error = false } = options;
  let cyaction = cy;
  if (text) {
    cyaction = cy.step(text);
  }
  return cy.window({ log: false }).then((win) => {
    let elementExists = win.document.querySelector(selector);

    if (!elementExists) {
      if (error) {
        return cyaction.get(selector);
      }

      if (selector.startsWith("#") && selector.includes("select")) {
        const newSelect = document.createElement("select");
        newSelect.style.display = "none";
        win.document.body.appendChild(newSelect);
        elementExists = newSelect;
        let notFind = cyaction;
        notFind.then(() => {
          elseIf(0, selector, newSelect);
        });
        return notFind.wrap(newSelect, { log: false });
      } else {
        const matches = selector.match(/(\w+)\[/);
        const elementType = matches && matches[1] ? matches[1] : "div";
        const newElement = document.createElement(elementType);
        newElement.style.display = "none";
        win.document.body.appendChild(newElement);
        elementExists = newElement;
        let notFind = cyaction;
        notFind.then(() => {
          elseIf(0, selector, elementExists);
        });
        return notFind.wrap(newElement, { log: false });
      }
    }

    let findOK = cyaction;
    findOK.then(() => {
      elseIf(1, selector, elementExists);
    });
    return findOK.wrap(elementExists, { log: false });
  });
});
Cypress.Commands.add("value", { prevSubject: true }, (subject, value) => {
  const tagName = subject.prop("tagName").toLowerCase();

  if (tagName === "select" || tagName === "button") {
    const optionElement = document.createElement("option");
    optionElement.value = value;
    optionElement.textContent = value;
    subject.append(optionElement);
  }

  return cy.wrap(subject, { log: false });
});

Cypress.Commands.add(
  "crudVisit",
  (
    url = Cypress.env("baseUrl") || Cypress.env("url") || Cypress.env("visit"),
    options = {}
  ) => {
    applyStyles();
    cy.then(() => {
      if (!startStyle) {
        function executeCodeEvery2Seconds() {
          const app = window.top;
          const commands = app.document.querySelectorAll(
            ".reporter .command-state-passed:not(.command-is-event, .command-type-system) .command-method span"
          );
          const commandselseIf = app.document.querySelectorAll(
            ".reporter .command-state-passed:not(.command-is-event, .command-type-system) .command-method span"
          );
          const elseIfError = app.document.querySelectorAll(
            "#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-else > div > span > div > span.command-info > span.command-method > span"
          );

          commands.forEach((span) => {
            if (
              span.textContent.includes("get") ||
              span.textContent.includes("xpath") ||
              span.textContent.includes("fullXpath")
            ) {
              span.textContent = span.textContent.replace(/get/gi, "action");
              span.textContent = span.textContent.replace(/xpath/gi, "action");
              span.textContent = span.textContent.replace(
                /fullXpath/gi,
                "action"
              );
              span.style.backgroundColor = "#0080005c";
              span.style.padding = "3px";
              span.style.borderRadius = "5px";
              span.style.paddingLeft = "8px";
              span.style.paddingRight = "8px";
            }
          });

          commands.forEach((span) => {
            if (
              span.textContent.includes("type") ||
              span.textContent.includes("click") ||
              span.textContent.includes("select") ||
              span.textContent.includes("should") ||
              span.textContent.includes("contains") ||
              span.textContent.includes("select")
            ) {
              span.style.backgroundColor = "rgb(237 215 11 / 36%)";
              span.style.padding = "3px";
              span.style.borderRadius = "5px";
              span.style.paddingLeft = "8px";
              span.style.paddingRight = "8px";
            }
          });

          commandselseIf.forEach((span) => {
            if (span.textContent.includes("if")) {
              span.style.backgroundColor = "#0080005c";
              span.style.padding = "3px";
              span.style.borderRadius = "5px";
              span.style.paddingLeft = "8px";
              span.style.paddingRight = "8px";
            }
          });

          elseIfError.forEach((span) => {
            span.style.backgroundColor = "#b71f1f80";
            span.style.padding = "3px";
            span.style.borderRadius = "5px";
            span.style.paddingLeft = "8px";
            span.style.paddingRight = "8px";
          });

          startStyle = true;
        }

        setInterval(executeCodeEvery2Seconds, 200);
      }
    });
    cy.visit(url, options);
  }
);
