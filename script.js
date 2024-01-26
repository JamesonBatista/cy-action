const fs = require("fs");
const path = require("path");

function findProjectRoot(dir) {
  const isPackageJsonPresent = fs.existsSync(path.join(dir, "package.json"));
  const isInNodeModules = dir.includes("node_modules");

  if (isPackageJsonPresent && !isInNodeModules) {
    // Diretório raiz do projeto encontrado
    return dir;
  }

  const parentDir = path.dirname(dir);
  if (parentDir === dir) {
    // Chegamos ao diretório raiz do sistema sem encontrar o diretório do projeto
    throw new Error("Não foi possível encontrar o diretório raiz do projeto.");
  }

  // Recursivamente subir na hierarquia de diretórios
  return findProjectRoot(parentDir);
}

// Encontrar o diretório raiz do projeto a partir do diretório atual
const projectRoot = findProjectRoot(__dirname);

// Construir o caminho para o arquivo e2e.js
const supportFilePath = path.join(projectRoot, "cypress/support/e2e.js");

const contentToAdd = `
export {
  Scenario,
  Given,
  When,
  And,
  Then,
  Cenario,
  Dado,
  Quando,
  E,
  Entao,
  describes,
  its,
  actionStorage,
} from "cypress-action/src/gherkin/bdd.js";
import "cypress-plugin-steps";
require("cypress-action");
import "cypress-file-upload";
require("cypress-xpath");
export const faker = require("generate-datafaker");
import "cypress-wait-until";
import "cypress-mochawesome-reporter/register";

//hiden xhr trash in ui cypress
const app = window.top;
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style");
  style.innerHTML = \`.command-name-request, .command-name-xhr { display: none };\`;
  style.setAttribute("data-hide-command-log-request", "");
  app.document.head.appendChild(style);
}
`;

const appendToFile = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");

    // Verificar se o conteúdo já existe no arquivo
    if (!existingContent.includes(content.trim())) {
      fs.appendFileSync(filePath, content, "utf8");
    }
  }
};

appendToFile(supportFilePath, contentToAdd);
//

// Caminho para a raiz do projeto
const projectRootPath = path.resolve(__dirname, "../../");
// Caminho para a pasta .vscode
const vscodeFolderPath = path.join(projectRootPath, ".vscode");

// Caminho para o arquivo action.action-snippets dentro da pasta .vscode
const snippetsFilePath = path.join(vscodeFolderPath, "action.code-snippets");
const snippetsFilePathSave = path.join(vscodeFolderPath, "settings.json");
const contentSave = `{"editor.formatOnSave":true, "cSpell.words": ["Cenario", "datafaker", "Entao"]}`;

// Texto que será adicionado ao arquivo action.action-snippets
const snippetContent = `{
  "Create new cy.action": {
    "scope": "javascript,typescript",
    "prefix": "action",
    "body": ["cy.action({attr: '$1', text: 'opcional'})", "$2"],
    "description": "Generate new cy.action"
  },
  "Create new cy.act": {
    "scope": "javascript,typescript",
    "prefix": "act",
    "body": [".act('$1')", "$2"],
    "description": "Generate new cy.act"
  },
  "generate scenario": {
    "scope": "javascript,typescript",
    "prefix": "scenario",
    "body": ["Scenario('$1', function()  {}, {});", "$2"],
    "description": "generate scenario"
  },
  "generate given": {
    "scope": "javascript,typescript",
    "prefix": "given",
    "body": ["Given('$1', function()  {}, {});", "$2"],
    "description": "generate given"
  },
  "generate when": {
    "scope": "javascript,typescript",
    "prefix": "when",
    "body": ["when('$1', function()  {}, {});", "$2"],
    "description": "generate when"
  },
  "generate And": {
    "scope": "javascript,typescript",
    "prefix": "and",
    "body": ["And('$1', function()  {}, {});", "$2"],
    "description": "generate And"
  },
  "generate Then": {
    "scope": "javascript,typescript",
    "prefix": "then",
    "body": ["Then('$1', function()  {}, {});", "$2"],
    "description": "generate Then"
  },
  "generate cenario": {
    "scope": "javascript,typescript",
    "prefix": "cenario",
    "body": ["Cenario('$1', function()  {}, {});", "$2"],
    "description": "generate Cenario"
  },
  "generate Dado": {
    "scope": "javascript,typescript",
    "prefix": "dado",
    "body": ["Dado('$1', function()  {}, {});", "$2"],
    "description": "generate Dado"
  },
  "generate Quando": {
    "scope": "javascript,typescript",
    "prefix": "quando",
    "body": ["Quando('$1', function()  {}, {});", "$2"],
    "description": "generate Quando"
  },
  "generate E": {
    "scope": "javascript,typescript",
    "prefix": "e",
    "body": ["E('$1', function()  {}, {});", "$2"],
    "description": "generate E"
  },
  "generate Entao": {
    "scope": "javascript,typescript",
    "prefix": "entao",
    "body": ["Entao('$1', function()  {}, {});", "$2"],
    "description": "generate Entao"
  },
  "generate test bdd": {
    "scope": "javascript,typescript",
    "prefix": "test_bdd",
    "body": [
      "import {Given, Scenario,faker, When,And, Then} from '../support/e2e'; ",
      "Scenario('', function () {",
      "before(() => {cy.crudVisit(''); });",
      "Given('', function () {}, {});});"
    ],
    "description": "generate full test"
  },
  "generate test describes its": {
    "scope": "javascript,typescript",
    "prefix": "test_des_its",
    "body": [
      "import {describes, its,faker} from '../support/e2e'; ",
      "describes('', function () {",
      "its('', function () {}, {});});"
    ],
    "description": "generate full test describes its"
  },
  "generate test action": {
    "scope": "javascript,typescript",
    "prefix": "test_action",
    "body": [
      "import {faker} from '../support/e2e'; ",
      "describe('', function()  {",
      "  before(()=>{cy.crudVisit('')})",
      " it('', function() { });});"
    ],
    "description": "generate full test"
  },
  "generate test": {
    "scope": "javascript,typescript",
    "prefix": "test_bdd_BR",
    "body": [
      "import {Dado, Cenario, faker, Quando,E, Entao} from '../support/e2e'; ",
      "Cenario('$1', function () {",
      "before(() => {cy.crudVisit(''); })",
      "Dado('$2', function () {}, {});",
      "Quando('$3', function () {}, {});",
      "E('$4', function () {}, {});",
      "Entao('$5', function () {}, {});",
      "});"
    ],
    "description": "generate full test"
  },
  "generate elseIf": {
    "scope": "javascript,typescript",
    "prefix": "elseIf",
    "body": [
      "cy.elseIf('input[name=\"name\"]').type('test', {force: true})",
      "$2"
    ],
    "description": "generate elseIf"
  },
  "generate If": {
    "scope": "javascript,typescript",
    "prefix": "If",
    "body": [".If('input[name=\"name\"]')", "$2"],
    "description": "generate If"
  }
}
`;

try {
  // Define o caminho da raiz do projeto
  const projectRootPathJsconfig = path.resolve(__dirname, "../../");

  // Define o caminho para o arquivo jsconfig.json na raiz do projeto
  const jsconfigFilePath = path.join(projectRootPathJsconfig, "jsconfig.json");

  // Conteúdo para o arquivo jsconfig.json
  const contentTsConfig = `{
  "compilerOptions": {
    // "target": "ES6",
    //"module": "commonjs",
    //"lib": ["es6", "dom"],
    // "baseUrl": "./",
    // "paths": {
    //   "@/*": ["./path/to/aliases/*"]
    // },
    "types": ["cypress"]
  },
  // "include": ["**/*"],
  "exclude": ["node_modules"]
}
`;

  // Escreve o conteúdo no arquivo jsconfig.json
  fs.writeFileSync(jsconfigFilePath, contentTsConfig);
} catch (error) {
  console.error("Error create jsconfig.json:", error);
}

const projectRootPathJSON = path.resolve(__dirname, "../../cypress/e2e/");
const vscodeFolderPathJSON = path.join(projectRootPathJSON, "examples");
const payloadWithReplace = path.join(
  vscodeFolderPathJSON,
  "cy-action-examples.cy.js"
);
const contentTestAction = `
const { faker, actionStorage } = require("../../support/e2e");

describe("Describe testing", function () {
  before(() => {
    cy.crudVisit("https://walkdog.vercel.app/signup"); // using styles
    // cy.visit()  // not using styles
  });
  it("Testing in page walkdog", function () {
    cy.action({ attr: selects.fillName }).click();
    // automatic save element in actionStorage.find.element
  });

  it("select cssSelector other test, and text information", function () {
    // value get before test
    console.log(actionStorage.find.element);
    cy.action({ attr: actionStorage.find.element, text: "fill name" }).type(
      faker.generateName()
    );
  });

  it("Fill email", function () {
    cy.action({ attr: selects.fillEmail, text: "fill email" }).type(
      faker.generateEmails()
    );
  });

  it("Fill CPF using cssSelector", () => {
    cy.action({ attr: selects.fillCpf, text: "Fill CPF" }).type(
      faker.generateCPF()
    );
  });

  it("Fill CEP using xpath", () => {
    cy.action({ attr: selects.fillCEP, text: "Fill CEP" }).type(
      faker.generateCEP()
    );
  });

  it("Fill click button CEP using fullXpath", () => {
    cy.action({
      attr: selects.clickSearchCEP,
      text: "click search CEP",
    }).click();
  });
  it("Expect not empty", () => {
    cy.action({ attr: selects.expectCEP }, { timeout: 10000 })
      .invoke("val")
      .should("not.be.empty");
  });

  it("Test mixed functions", () => {
    // cy.action({ attr: selects.expectCEPNotFound })
    //   .invoke("val")
    //   .should("not.be.empty");

    cy.action({ attr: selects.fillName })
      .click()
      .If('input[name="name"]')
      .type("Test");

    cy.action({ attr: selects.fillName })
      .click()
      .elseIf('input[name="name"]')
      .type("Test");

    cy.action({
      attr: 'name="name"',
      text: "Entering username",
      maxAttempts: 5,
    }).act({ attr: 'name="name"' });
  });
  it("Test using cy.action with error, wait element max attempts 5", () => {
    cy.action({ attr: selects.expectCEPNotFound, maxAttempts: 5 })
      .invoke("val")
      .should("not.be.empty");
  });
});

let selects = {
  fillName: 'name="name"',
  fillEmail: 'name="email"',
  fillCpf:
    "#page-walker > form > fieldset:nth-child(3) > div:nth-child(3) > div:nth-child(2) > input[type=text]",
  fillCEP: '//*[@id="page-walker"]/form/fieldset[2]/div[2]/div[1]/input',
  clickSearchCEP: "/html/body/div/div/form/fieldset[2]/div[2]/div[2]/input",
  expectCEP: 'name="addressStreet"',
  expectCEPNotFound: 'name="addressStree"',
};

`;

if (!fs.existsSync(vscodeFolderPathJSON)) {
  fs.mkdirSync(vscodeFolderPathJSON);
}
// create example cy.action
fs.writeFileSync(payloadWithReplace, contentTestAction);

const exampleElseIf = path.join(
  vscodeFolderPathJSON,
  "cy-elseif-examples.cy.js"
);
const contentElseIf = `
const { faker } = require("../../support/e2e");

describe("Test using ElseIf function", function () {
  before(() => {
    cy.crudVisit("https://walkdog.vercel.app/signup"); // using styles
    // cy.visit("https://walkdog.vercel.app/signup"); // not using styles
  });
  it("Test else if in cy.action framework", () => {
    cy.elseIf(select.fillName).type(faker.generateName(), { force: true });
    cy.elseIf(select.fillNameError).type(faker.generateName(), {
      force: true,
    });
  });
  it("Test else if in cy.action framework whit text description", () => {
    cy.elseIf(select.fillName, { text: "description action elseIf" }).type(
      faker.generateName(),
      {
        force: true,
      }
    );
  });

  it("Test click elseIf", () => {
    cy.elseIf(select.fillName).click({ force: true });
  });
  it("Test else if in cy.action framework  cssSelector error", () => {
    cy.elseIf(select.fillNameError).type(faker.generateName(), { force: true });
    // cy.elseIf('select[name="email"]').value("1").select("1", { force: true });
    // cy.elseIf('button[name="name"]').value("Salvar").click({ force: true });
  });
});

let select = {
  fillName: 'input[name="name"]',
  fillNameError: 'input[name="nam"]',
  //   fillNameError: 'select[name="nam"]',
  //   fillNameError: 'button[name="nam"]',
  //  a[href]
  //   area[href]
  //   input
  //   select
  //   textarea
  //   button
  //   iframe
  //   [tabindex]
  //   [contenteditable],
};
`;
fs.writeFileSync(exampleElseIf, contentElseIf);

//gol exmaple
const exampleGolMixedFunctions = path.join(
  vscodeFolderPathJSON,
  "cy-mixed-examples.cy.js"
);

const contentMixed = `
describe("Tests in page Gol", function () {
  before(() => {
    cy.crudVisit("https://www.voegol.com.br/");
  });
  it("Gol buy ticket ar lines", function () {
    cy.action({ attr: 'id="select2-edit-origin-container"' })
      .click()
      .act('aria-controls="select2-edit-origin-results"')
      .type("REC")
      .act('role="option"')
      .contains("Recife - REC")
      .click();

    cy.action({
      attr: 'id="select2-edit-destiny-container"',
      text: "select GRU",
    })
      .click()
      .act('aria-controls="select2-edit-destiny-results"')
      .type("GRU")
      .act('role="option"')
      .contains("São Paulo - Guarulhos - GRU")
      .click();
    //   .If('[id="onetrust-accept-btn-handler"]')
    //   .click({ force: true });
  });
});

`;

fs.writeFileSync(exampleGolMixedFunctions, contentMixed);

if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
}

fs.writeFileSync(snippetsFilePathSave, contentSave);
// Cria ou sobrescreve o arquivo action.action-snippets
fs.writeFileSync(snippetsFilePath, snippetContent);

const configPath = path.resolve(__dirname, "../../");
const jsconfigFilePath = path.join(configPath, "cypress.config.js");

const contentLog = `
      //reporter: "cypress-mochawesome-reporter",  // insert out e2e
      require("cypress-mochawesome-reporter/plugin")(on);
  //       e2e: {
  //   setupNodeEvents(on, config) {
  //     //reporter: "cypress-mochawesome-reporter",  // insert out e2e
  //     require("cypress-mochawesome-reporter/plugin")(on);

  //     // implement node event listeners here
  //   },
  //   testIsolation: false,
  //   experimentalRunAllSpecs: true,
  // },

`;

fs.readFile(jsconfigFilePath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const setupNodeEventsMatch = data.match(
    /setupNodeEvents\(on, config\) {([\s\S]*?)}/
  );
  if (setupNodeEventsMatch && setupNodeEventsMatch[1]) {
    // Verificar se o conteúdo já existe dentro da função
    if (setupNodeEventsMatch[1].includes(contentLog.trim())) {
      return;
    }
  }

  const updateNode = data.replace(
    /(setupNodeEvents\(on, config\) {\s*)/,
    `$1${contentLog}`
  );

  fs.writeFile(jsconfigFilePath, updateNode, "utf8", (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});
