/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom action function
     * @param params Parameters for the action
     * @param options Cypress command options
     *
     * Usage Examples:
     *
     * // Example 1: Using Only `attr`
     * cy.action({ attr: '#botaoLogin' });
     *
     * // Example 2: Using `attr` and `text`
     * cy.action({ attr: '.classeElemento', text: 'Clicking on the element' });
     *
     * // Example 3: Using All Properties of `params`
     * cy.action({ attr: 'name="usuario"', text: 'Entering username', maxAttempts: 5 });
     *
     * // Example 4: Using Cypress `options`
     * cy.action({ attr: 'type="password"' }, { timeout: 10000, log: false });
     */
    action(
      params: {
        attr?: string | object;
        text?: string | null;
        maxAttempts?: number;
      },
      options?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom action function
     * @param params Parameters for the action
     * @param options Cypress command options
     *
     * Usage Examples:
     *
     * // Example 1: Using Only `attr`
     * cy.action({ attr: '#botaoLogin' });
     *
     * // Example 2: Using `attr` and `text`
     * cy.act('.classeElemento');
     *
     * // Example 3: Using All Properties of `params`
     * cy.action({ attr: 'name="usuario"', text: 'Entering username', maxAttempts: 5 })
     * .act('name="usuario"', maxAttempts: 5 });
     *
     * // Example 4: Using Cypress `options`
     * cy.action({ attr: 'type="password"' }, { timeout: 10000, log: false });
     *cy.action({ attr: selects.fillName })
      .click()
      .elseIf('input[name="name"]')
      .type("Test");
      *
      *cy.action({ attr: selects.fillName })
      .click()
      .If('input[name="name"]')
      .type("Test");
     */
    act(
      attr?: string | object,
      maxAttempts?: number,
      options?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Chainable<JQuery<HTMLElement>>;

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
     * Custom command to perform actions based on a selector.
     * If the element exists, checks for a specific option in a select element.
     * Otherwise, creates a hidden element of the specified type.
     * @param attr The CSS selector or element attribute.
     * @param optionValue The value of the option to check or add.
     * @example
     * If('select[name="example"]', 'optionValue');
     */
    /**
     * Custom command to check if an element exists based on a selector.
     * If the element does not exist, a new hidden element of the inferred type is created.
     * @param selector The CSS selector to query the element.
     * @example If('input[name="name"]')
     */
    If(
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
