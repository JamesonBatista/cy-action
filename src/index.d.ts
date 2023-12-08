/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to perform various actions based on provided parameters.
     * @param options Object with options for the action.
     * @param test Function to execute with the found element.
     * @param getOptions Cypress get command options, like timeout.
     * @example
     * cy.action({ attr: 'my-selector', text: 'Action description', ifExist: true, maxAttempts: 6 },
     *           (el) => el.click(),
     *           { timeout: 10000 });
     */
    action(
      options: {
        attr: string;
        text: string | null;
        ifExist: boolean;
        maxAttempts: number;
      },
      test: (element: Cypress.Chainable) => void,
      getOptions?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Chainable<any>;

    attributes(attributes: {
      [key: string]: string;
    }): Chainable<JQuery<HTMLElement>>;
  }
}
