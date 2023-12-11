const applyStyles = require("./style.js");
export function action(
  { attr = "", text = null, ifExist = false, maxAttempts = 6 },
  test,
  options = {}
) {
  applyStyles();
  let regex = /^[!@#$%¨&*()_+{}[\]:;,.?~\\\/|]/.test(attr);
  const search = (selector, test) => {
    let cypress;
    if (text) {
      cypress = cy.step(text);
    } else {
      cypress = cy;
    }
    return cy.get("body", { log: false }).then(($body) => {
      const doc = $body[0].ownerDocument;
      const sel = elementRefactorySelector(selector, regex, doc);
      const element = $body.find(sel);

      if (element.length) {
        elseIf(1, selector, element);
        return test(cy.wrap(element));
      } else {
        elseIf(0, selector, element);
        return null;
      }
    });
  };

  if (ifExist) {
    if (attr.startsWith("//")) {
      return searchingXpathifElse(attr).then((elements) => {
        if (elements.length > 0) {
          elseIf(1, attr, elements);
          return test(cy.wrap(elements));
        } else {
          elseIf(0, attr, elements);
          return cy.wrap(null, { log: false });
        }
      });
    }

    return search(attr, test);
  } else {
    return cy.document({ log: false }).then((doc) => {
      let cypress;
      if (text) {
        cypress = cy.step(text);
      } else {
        cypress = cy;
      }
      if (typeof attr === "object") {
        return cypress.get(attr, options).wait(1000, { log: false });
      }

      if (attr.startsWith("//")) {
        return searchingXpath(attr);
      }
      const selector = elementRefactorySelector(attr, regex, doc);
      if (typeof selector === "object") {
        return cypress.get(selector, options).wait(1000, { log: false });
      }

      if (doc.querySelectorAll(selector).length > 0) {
        return cypress.get(selector, options).wait(1000, { log: false });
      } else {
        return searching(selector, options, maxAttempts);
      }
    });
  }
}
function elseIf(num, attr, elements) {
  applyStyles();

  if (num > 0) {
    const log = {
      name: "cssSelector",
      message: `✅  exist: element '${attr}' found`,
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
      name: "not-cssSelector",
      message: `🔴  skipped: element '${attr}' not found`,
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
    cy.document({ log: false }).then((doc) => {
      const waitTime = attempt * baseWaitTime;

      cy.log(`🔍 searching *${attr}* in page, ${attempt}ª tentativa...`)
        .wait(waitTime)
        .then(() => {
          let selector = doc.querySelectorAll(attr);
          if (selector.length > 0) {
            return cy.get(selector, options).wait(1000, { log: false });
          }

          if (attempt < maxAttempts) {
            attempts(attempt + 1);
          }
        });
    });
  };
  attempts();
}
const searchingXpath = (xpathSelector) => {
  let nodes = [];

  cy.then(() => {
    const log = {
      name: "xpath",
      message: xpathSelector,
      consoleProps: () => {
        return {
          XPath: xpathSelector,
          "Results length": nodes.length,
          Result: nodes[0],
        };
      },
    };

    const getValue = () => {
      return new Cypress.Promise((resolve, reject) => {
        let contextNode = cy.state("window").document;

        let iterator = document.evaluate(
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

        resolve(Cypress.$(nodes));
      });
    };

    const executeSearch = () => {
      return getValue().then((value) => {
        Cypress.log(log);

        if (value && value.length > 0) {
          log.$el = value;
          return value;
        } else {
          return waitAttempts(xpathSelector, 1);
        }
      });
    };

    function waitAttempts(xpathSelector, attempt) {
      const maxAttempts = 6;
      const waitTimes = [3000, 5000, 10000, 20000, 30000, 60000];

      if (attempt <= maxAttempts) {
        return cy
          .log(
            `🔍 searching *${xpathSelector}* in page, ${attempt} tentative...`
          )
          .wait(waitTimes[attempt - 1])
          .then(() => {
            return getValue().then((value) => {
              if (value && value.length > 0) {
                log.$el = value;
                return value;
              } else if (attempt < maxAttempts) {
                return waitAttempts(xpathSelector, attempt + 1);
              }
            });
          });
      }
    }

    return executeSearch();
  });
};
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

Cypress.Commands.add("elseIf", (selector, text = "elseIf find selector") => {
  return cy.window({ log: false }).then((win) => {
    let elementExists = win.document.querySelector(selector);

    if (!elementExists) {
      if (selector.startsWith("#") && selector.includes("select")) {
        const newSelect = document.createElement("select");
        newSelect.style.display = "none";
        win.document.body.appendChild(newSelect);
        elementExists = newSelect;
        let notFind = cy.step(text);
        notFind.then(() => {
          elseIf(0, selector, newSelect);
        });
        return notFind.wrap(newSelect);
      } else {
        const matches = selector.match(/(\w+)\[/);
        const elementType = matches && matches[1] ? matches[1] : "div";
        const newElement = document.createElement(elementType);
        newElement.style.display = "none";
        win.document.body.appendChild(newElement);
        elementExists = newElement;
        let notFind = cy.step(text);
        notFind.then(() => {
          elseIf(0, selector, elementExists);
        });
        return notFind.wrap(newElement);
      }
    }

    let findOK = cy.step(text);
    findOK.then(() => {
      elseIf(1, selector, elementExists);
    });
    return findOK.wrap(elementExists);
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
