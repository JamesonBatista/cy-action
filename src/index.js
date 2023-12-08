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
        console.log("a", selector);

        return cypress.get(selector, options).wait(1000, { log: false });
      } else {
        return searching(selector, options, maxAttempts);
      }
    });
  }
}
function elseIf(num, attr, elements) {
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
    return cy.wrap(subject).filter((index, el) => {
      return Object.entries(attributes).every(([attr, value]) => {
        return el.getAttribute(attr) === value;
      });
    });
  }
);
