const getIframeDocument = () => {
    return cy
    .get('iframe[id="mfs-container-iframe"]')
    // Cypress yields jQuery element, which has the real
    // DOM element under property "0".
    // From the real DOM iframe element we can get
    // the "document" element, it is stored in "contentDocument" property
    // Cypress "its" command can access deep properties using dot notation
    // https://on.cypress.io/its
    .its('0.contentDocument').should('exist')
  }
  
  const getIframeBody = () => {
    // get the document
    return getIframeDocument()
    // automatically retries until body is loaded
    .its('body').should('not.be.undefined')
    // wraps "body" DOM element to allow
    // chaining more Cypress commands, like ".find(...)"
    .then(cy.wrap)
  }
  

describe('Login Test', function() {
    it('Login into MVISION', function() {

    Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
    })

      cy.viewport(Cypress.config('viewportHeight'), Cypress.config('viewportWidth'))
      cy.visit('https://mvision.mcafee.com')
      cy.contains('Sign up now')
      cy.get('input[id=login_hint]')
        .type(Cypress.config('email'))

      cy.get('input[id=okta-signin-submit]').click()

      cy.get('input[id=okta-signin-password]')
        .type(Cypress.config('password'))

    cy.get('h2').should('contain','Sign In')

    cy.get('input[id=okta-signin-submit]').click()
   
    cy.url({timeout: 60000})                      
    .should('include', '/ProtectionWorkspace/html/index.html') 

    getIframeBody().find('div[class=dashboard-header]').should('contain','Protection Workspace')
    getIframeBody().find('button[id=update-now]').click()

    getIframeBody().find('div[class="number ng-tns-c25-4 ng-star-inserted"]').should('contain','16')

    cy.get('#mfsUHM').click()
    cy.get('div[id="ui.nav.button.logout"]').click()

    })

  })

