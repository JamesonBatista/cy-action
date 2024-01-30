module.exports = function applyStyles() {
  const app = window.top;
  let colorBDD = Cypress.env("styles") ? Cypress.env("styles") : "#ffffff14";

  if (!app.document.head.querySelector("[data-hide-command-log-cssSelector]")) {
    const style = app.document.createElement("style");
    const titleSelector =
      "#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-cssSelector > div > span > div > span.command-info";
    const notFound =
      "#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div.collapsible-content.runnable-instruments > div > ul > li > div > div.collapsible-content.attempt-content > div > div > ul > li > div > div.collapsible-content > ul > li.command.command-name-not-cssSelector > div > span > div > span.command-info";
    let scenarioSelector = `#unified-reporter > div > div > div.wrap > ul > li > div > div > div > div.collapsible-header-inner`;
    let bdd = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li > div > div > div > div.collapsible-header-inner`;
    let bddFailed = `#unified-reporter > div > div > div.wrap > ul > li > div > div.collapsible-content.runnables-region > ul > li.test.runnable.runnable-failed `;

    style.innerHTML = `
        ${titleSelector} {
          border-radius: 5px;
          margin: 5px;
        }
        ${notFound} {
          border-radius: 5px;
          background-color: #ff000021;
          margin: 5px;
        }
    #unified-reporter .command.command-name-visit > div.command-wrapper.command-state-passed.command-type-parent.command-is-interactive > span.command-pin-target > div.command-wrapper-text > span.command-info {
    border-radius: 5px;
    background-color: #c1bed929;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
 }
   #unified-reporter .command.command-name-visit > div.command-wrapper.command-state-passed.command-type-parent.command-is-interactive > span.command-pin-target > div.command-wrapper-text > span.command-info > span.command-message{
    color: white;
 }
       .reporter .command-state-passed:not(.command-is-event, .command-type-system) .command-method {
    color: #fff;
}
       .reporter .command-state-passed:not(.command-is-event, .command-type-system) .command-method::before {content: '';}

       .reporter .command-wrapper .command-wrapper-text {
    margin: 5px 5px;
border-bottom: 1px solid #ffffff08;    
border-top: 1px solid #ffffff08;    
    
       }
     ${scenarioSelector} {
      background-color:${
        colorBDD.background ? colorBDD.background : "#ffffff14"
      };
      border-radius: 5px;
      margin: 10px;
      padding: 8px
      }
 
      ${bdd}{
        background-color:  ${
          colorBDD.background ? colorBDD.background : "#ffffff08"
        };
        border-radius: 5px;
        margin: 7px;
      }

      ${bdd} > span > span > span{
        color:${colorBDD.text ? colorBDD.text : "white"};
        letter-spacing: 1px;
      }
      ${scenarioSelector}:hover, ${bdd}:hover {
        background: #ffffff2b;
       box-shadow: 1px 1px 4px 0 white;

      }

      @keyframes gradientAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      ${scenarioSelector} span > span.runnable-title{
        color: ${colorBDD.text ? colorBDD.text : "white"};
        letter-spacing: 1px;
      }

    ${scenarioSelector}:hover span > span.runnable-title, 
    ${bdd}:hover > span > span > span {
        letter-spacing: 2px;
    }

      ${bddFailed} > div > div > div > div.collapsible-header-inner{
        background-color: #ff000029;
      }

      .bg-gray-100 {
    background-color: #1b1e2e;
  }
    .p-\\[16px\\] {
    padding: 16px;
    background: #1b1e2e;
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
    spanElement.style.letterSpacing = "2px";
    spanElement.innerText = Cypress.env("subTitle") || "🆃🅴🆂🆃🆂 🅸🅽 🅲🆈🅿🆁🅴🆂🆂";
  }

  if (spanElement2) {
    spanElement2.style.letterSpacing = "2px";

    spanElement2.innerText = Cypress.env("title") || "🅲🆈🅿🆁🅴🆂🆂-🅰🅲🆃🅸🅾🅽";
  }
};
