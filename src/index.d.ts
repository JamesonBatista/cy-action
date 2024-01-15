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

    /**
     * Custom command to perform actions based on a selector.
     * If the element exists, checks for a specific option in a select element.
     * Otherwise, creates a hidden element of the specified type.
     * @param attr The CSS selector or element attribute.
     * @param optionValue The value of the option to check or add.
     * @example
     * cy.ElseIf('select[name="example"]', 'optionValue');
     */
    /**
     * Custom command to check if an element exists based on a selector.
     * If the element does not exist, a new hidden element of the inferred type is created.
     * @param selector The CSS selector to query the element.
     * @example cy.elseIf('input[name="name"]')
     */
    elseIf(
      selector: string,
      options?: { text?: string; error?: boolean }
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to add a value to a select or button element.
     * It is chainable after the elseIf command.
     * @param value The value to add as an option.
     * @example cy.elseIf('select[name="gender"]').value('female')
     */
    value(value: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom Cypress command to perform a CRUD operation visit.
     *
     * @param url The URL to visit.
     * @param options Visit options.
     * @example
     * cy.crudVisit('https://example.com', { timeout: 5000 })
     */
    crudVisit(
      url?: string,
      options?: Partial<cy.VisitOptions>
    ): Chainable<Window>;
  }
}
