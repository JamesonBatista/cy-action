export function action(
  { attr = "", text = "action page description" },
  options = {}
) {
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
function searching(attr, maxAttempts = 6) {
  const attempts = (attempt = 1) => {
    cy.document({ log: false }).then((doc) => {
      const waitAttempts =
        attempt === 1
          ? 3000
          : attempt === 2
          ? 5000
          : attempt === 3
          ? 10000
          : attempt === 4
          ? 20000
          : attempt === 5
          ? 30000
          : 60000;

      cy.log(`🔍 searching *${attr}* in page, ${attempt} tentative...`)
        .wait(waitAttempts)
        .then(() => {
          if (attr.startsWith("/ht")) {
            return fullPage(attr).then((el) => {
              if (el) {
                return cypress.get(el, options).wait(1000, { log: false });
              }
            });
          } else {
            let selector = doc.querySelectorAll(attr);
            if (selector.length > 0) {
              return cypress.get(selector, options).wait(1000, { log: false });
            }
          }

          if (attempt < maxAttempts) {
            attempts(attempt + 1);
          }
        });
    });
  };
  attempts();

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

const searchingXpath = (xpathSelector, cypress) => {
  let nodes = [];

  cypress.then(() => {
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
Cypress.Commands.add("action", (options, getOptions) => {
  return action(options, getOptions);
});
