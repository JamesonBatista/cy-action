const styles = require("./styles");
const applyStyles = require("../style");

function createTestWrapper(testFunction) {
  return function (text, callback, options = {}) {
    const { skip, only } = options;
    if (only) {
      return testFunction.only(text, callback);
    } else if (skip) {
      return testFunction.skip(text, callback);
    } else {
      return testFunction(text, callback);
    }
  };
}

export function Scenario(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  styles();
  applyStyles();
  if (Cypress.env(`url`) && !Cypress.env(`urlEach`)) {
    before(function () {
      cy.visit(Cypress.env(`url`), Cypress.env("urlOptions"));
    });
  } else if (!Cypress.env("url") && Cypress.env("urlEach")) {
    beforeEach(function () {
      cy.visit(Cypress.env(`urlEach`), Cypress.env("urlOptions"));
    });
  }
  return createTestWrapper(describe)(`sᴄᴇɴᴀʀɪᴏ - ${text}`, callback, options);
}

export function Given(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ɢɪᴠᴇɴ - ${text}`, callback, options);
}

// Repita para When, Then, etc.
export function When(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴡʜᴇɴ - ${text}`, callback, options);
}
export function And(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴀɴᴅ - ${text}`, callback, options);
}
export function Then(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴛʜᴇɴ - ${text}`, callback, options);
}

// Variantes em Português
export function Cenario(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  applyStyles();
  styles();
  if (Cypress.env(`url`) && !Cypress.env(`urlEach`)) {
    before(function () {
      cy.visit(Cypress.env(`url`), Cypress.env("urlOptions"));
    });
  } else if (!Cypress.env("url") && Cypress.env("urlEach")) {
    beforeEach(function () {
      cy.visit(Cypress.env(`urlEach`), Cypress.env("urlOptions"));
    });
  }
  return createTestWrapper(describe)(`ᴄᴇɴᴀʀɪᴏ - ${text}`, callback, options);
}

export function Dado(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴅᴀᴅᴏ - ${text}`, callback, options);
}

export function Quando(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ǫᴜᴀɴᴅᴏ - ${text}`, callback, options);
}

export function E(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴇ - ${text}`, callback, options);
}

export function Entao(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ᴇɴᴛᴀᴏ - ${text}`, callback, options);
}

// describes and its

export function describes(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  applyStyles();
  styles();
  if (Cypress.env(`url`) && !Cypress.env(`urlEach`)) {
    before(function () {
      cy.visit(Cypress.env(`url`), Cypress.env("urlOptions"));
    });
  } else if (!Cypress.env("url") && Cypress.env("urlEach")) {
    beforeEach(function () {
      cy.visit(Cypress.env(`urlEach`), Cypress.env("urlOptions"));
    });
  }
  return createTestWrapper(describe)(`ᴅᴇsᴄʀɪʙᴇs - ${text}`, callback, options);
}

export function its(text, callback, { skip = false, only = false } = {}) {
  let options = { skip: skip, only: only };
  return createTestWrapper(it)(`ɪᴛs - ${text}`, callback, options);
}
