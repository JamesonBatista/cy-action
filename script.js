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
const app = window.top;
if (!app.document.head.querySelector("[data-hide-command-log-request]")) {
  const style = app.document.createElement("style");
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none };';
  style.setAttribute("data-hide-command-log-request", "");
  app.document.head.appendChild(style);
}
export { Scenario, Given, When, And, Then, Cenario, Dado, Quando, E, Entao } from "cypress-action/src/gherkin/bdd.js";
import "cypress-plugin-steps";
require("cypress-action");
import "cypress-file-upload";
require('cypress-xpath');
export const faker = require("generate-datafaker");
import 'cypress-wait-until';
`;

const appendToFile = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");

    // Verificar se o conteúdo já existe no arquivo
    if (!existingContent.includes(content.trim())) {
      fs.appendFileSync(filePath, content, "utf8");
      console.log(`add in path ${filePath}`);
    } else {
      console.log(`text exist in path ${filePath}`);
    }
  } else {
    console.error(`path not found: ${filePath}`);
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
  "Create new cy.action with ifElse": {
    "scope": "javascript,typescript",
    "prefix": "actionIf",
    "body": [
      "cy.action({ attr: '$1',text: 'action page(opcional)', ifExist: true }, ($el) => $el.type(''));",
      "$2"
    ],
    "description": "Generate new cy.action with ifElse"
  },

  "Create new cy.action": {
    "scope": "javascript,typescript",
    "prefix": "action",
    "body": ["cy.action({attr: '$1', text: 'opcional'})", "$2"],
    "description": "Generate new cy.action"
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
    "body": ["import {Given, Scenario,faker, When,And, Then} from '../support/e2e'; ",
    "Scenario('', function () {",
     "before(() => {cy.visit(''); });",
     "Given('', function () {}, {});});"],
    "description": "generate full test"
  },
   "generate test action": {
    "scope": "javascript,typescript",
    "prefix": "test_action",
    "body": ["import {faker} from '../support/e2e'; ",
     "describe('', function()  {",
    "  before(()=>{cy.visit('')})",
    " it('', function() { });});"
    ],
    "description": "generate full test"
  },
   "generate test": {
    "scope": "javascript,typescript",
    "prefix": "test_bdd_BR",
    "body": ["import {Dado, Cenario, faker, Quando,E, Entao} from '../support/e2e'; ",
     "Cenario('$1', function () {",
     "before(() => {cy.visit(''); })",
    "Dado('$2', function () {}, {});",
    "Quando('$3', function () {}, {});",
    "E('$4', function () {}, {});",
    "Entao('$5', function () {}, {});",
    "});"
    ],
    "description": "generate full test"
  }
,
  "generate elseIf": {
    "scope": "javascript,typescript",
    "prefix": "elseIf",
    "body": ["cy.elseIf('ex: input[name='name']').type('test', {force: true})", "$2"],
    "description": "generate elseIf"
  }


}`;

try {
  // Define o caminho da raiz do projeto
  const projectRootPathJsconfig = path.resolve(__dirname, "../../");
  console.log(`Caminho da raiz do projeto: ${projectRootPath}`);

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
  console.log("Arquivo jsconfig.json criado com sucesso na raiz do projeto.");
} catch (error) {
  console.error("Erro ao criar o arquivo jsconfig.json:", error);
}

if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
  console.log("Pasta .vscode criada com sucesso.");
}
fs.writeFileSync(snippetsFilePathSave, contentSave);
// Cria ou sobrescreve o arquivo action.action-snippets
fs.writeFileSync(snippetsFilePath, snippetContent);
