module.exports = function gherkinStyles() {
  const app = window.top;

  if (!app.document.head.querySelector("[data-hover-black-cucumber]")) {
    // Criar e inserir o elemento de estilo
    const style = app.document.createElement("style");
    let scenarioSelector = `#unified-reporter > div > div > div.wrap > ul > li > div > div > div > div.collapsible-header-inner`;
    let bdd = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div > div > div.collapsible-header-inner`;
    let bddFailed = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li.test.runnable.runnable-failed `;
    style.innerHTML = `
      ${scenarioSelector} {
       background-color: #7fff008f;
    border-radius: 10px;
    margin: 10px;
      }

      ${bdd}{
        background-color:  #7fff003b;
            border-radius: 10px;
    margin: 5px;
      }

      ${bdd} > span > span > span{
        color: white;
            font-weight: bold;
    letter-spacing: 1px;
      }

      ${scenarioSelector} span > span.runnable-title{
                color: white;
            font-weight: bold;
    letter-spacing: 1.5px;
      }

      ${bddFailed} > div > div > div > div.collapsible-header-inner{
        background-color: #ff000045;
      }
    `;

    style.setAttribute("data-hover-black-cucumber", "");
    app.document.head.appendChild(style);
  }
};
