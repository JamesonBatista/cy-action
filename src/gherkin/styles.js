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
       background-color: #7fff0025;
    border-radius: 10px;
    margin: 10px;
      }
 
      ${bdd}{
        background-color:  #7fff0018;
        border-radius: 10px;
        margin: 5px;
      }

      ${bdd} > span > span > span{
        color: white;
        font-weight: bold;
        letter-spacing: 1px;
      }

    ${scenarioSelector}:hover, ${bdd}:hover {
        background: linear-gradient(to right, #7fff0020, #ffffff80);
      box-shadow: 0px 4px 8px rgba(128, 128, 128, 0.2);

      }
      ${scenarioSelector} span > span.runnable-title{
                color: white;
            font-weight: bold;
    letter-spacing: 1.5px;
      }

      ${bddFailed} > div > div > div > div.collapsible-header-inner{
        background-color: #ff000029;
      }

    `;

    style.setAttribute("data-hover-black-cucumber", "");
    app.document.head.appendChild(style);
  }
};
