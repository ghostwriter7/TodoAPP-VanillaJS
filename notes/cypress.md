
1. `cypress open` for developers
2. `cypress run` for CI/CD, headless mode
3. select based on `[data-test="$0"]` as a good practice (instead of style selectors that might change with the design)
4. add `baseUrl` in `cypress.config.js` to avoid re-typing while navigating in specs 
5. `cy.visit('/calendar')`
