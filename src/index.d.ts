/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to perform various actions based on provided parameters.
     * @param options Object with options for the action.
     * @param getOptions Cypress get command options, like timeout.
     * @example
     * cy.action({ attr: 'my-selector', text: 'Action description' }, { timeout: 10000 });
     */
    action(
      options: { attr: string; text: string },
      getOptions?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Chainable<any>;
  }
}
