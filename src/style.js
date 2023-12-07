module.exports = function applyStyles() {
  const app = window.top;
  if (!app.document.head.querySelector("[data-hide-command-log-cssSelector]")) {
    const style = app.document.createElement("style");
    const titleSelector =
      "#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-cssSelector > div > span > div > span.command-info";
    const notFound =
      "#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-not-cssSelector > div > span > div > span.command-info";
    style.innerHTML = `
        ${titleSelector} {
          border-radius: 5px;
          background-color: #15ff0029;
          margin: 5px;
        }
        ${notFound} {
          border-radius: 5px;
          background-color: #ff000021;
          margin: 5px;
        }
    #unified-reporter .command.command-name-visit > div.command-wrapper.command-state-passed.command-type-parent.command-is-interactive > span.command-pin-target > div.command-wrapper-text > span.command-info {
    border-radius: 5px;
    background-color: #c1bed9a8;
 }
   #unified-reporter .command.command-name-visit > div.command-wrapper.command-state-passed.command-type-parent.command-is-interactive > span.command-pin-target > div.command-wrapper-text > span.command-info > span.command-message{
    color: white;
 }
    `;
    style.setAttribute("data-hide-command-log-cssSelector", "");
    app.document.head.appendChild(style);
  }

  const spanElement = app.document.querySelector(
    "#unified-reporter > div > div > div.runnable-header > span"
  );
  const spanElement2 = app.document.querySelector(
    "#unified-reporter > div > header > span > button > span"
  );

  if (spanElement) {
    spanElement.innerText = Cypress.env("subTitle")
      ? Cypress.env("subTitle")
      : "Tests";
  }

  if (spanElement2) {
    spanElement2.innerText = Cypress.env("title")
      ? Cypress.env("title")
      : "Cypress";
  }
};
