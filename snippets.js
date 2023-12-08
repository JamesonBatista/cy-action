const fs = require("fs");
const path = require("path");

// Função para encontrar a raiz do projeto (onde o package.json está localizado)
function findProjectRoot(currentDir) {
  if (fs.existsSync(path.join(currentDir, "package.json"))) {
    return currentDir;
  }
  const parentDir = path.resolve(currentDir, "..");
  if (parentDir === currentDir) {
    throw new Error("Não foi possível encontrar a raiz do projeto.");
  }
  return findProjectRoot(parentDir);
}

// Caminho para a raiz do projeto
const projectRootPath = findProjectRoot(__dirname);

// Caminho para a pasta .vscode
const vscodeFolderPath = path.join(projectRootPath, ".vscode");

// Caminho para o arquivo action.action-snippets dentro da pasta .vscode
const snippetsFilePath = path.join(vscodeFolderPath, "action.code-snippets");

// Texto que será adicionado ao arquivo action.action-snippets
const snippetContent = `{ 
  "Create new cy.action with ifElse": {
    "scope": "javascript,typescript",
    "prefix": "actionIf",
    "body": [
      "action({ attr: '$1',text: 'action page(opcional)', ifExist: true }, ($el) => $el.type(''));",
      "$2"
    ],
    "description": "Generate new cy.action with ifElse"
  },

  "Create new cy.action": {
    "scope": "javascript,typescript",
    "prefix": "action",
    "body": ["cy.action({attr: '$1', text: 'opcional'})", "$2"],
    "description": "Generate new cy.action"
  }
}`;

// Cria a pasta .vscode se ela não existir
if (!fs.existsSync(vscodeFolderPath)) {
  fs.mkdirSync(vscodeFolderPath);
  console.log("Pasta .vscode criada com sucesso.");
}

// Cria ou sobrescreve o arquivo action.action-snippets
fs.writeFileSync(snippetsFilePath, snippetContent);
