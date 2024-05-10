describe('Hacker Stories', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'React',
        page: '0'
      }
    }).as('getStories')

    cy.visit('/')
    cy.wait('@getStories')

  })

  it('shows the footer', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('List of stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it.skip('shows the right data for all rendered stories', () => {})

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: 'React',
          page: '1'
        }
      }).as('getMore')

      cy.get('.item').should('have.length', 20)

      cy.contains('More').click()

      cy.wait('@getMore')

      cy.get('.item').should('have.length', 40)
    })

    it('shows only nineteen stories after dimissing the first story', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    })

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.intercept(
        'GET',
        `**/search?query=${newTerm}&page=0`
      ).as('novoTermoEnter')

      cy.get('#search')
        .clear()
    })

    it('types and hits ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)
      
        cy.wait('@novoTermoEnter')
      
      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {

      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      cy.wait('@novoTermoEnter')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })
/*
    it('types and submits the form directly', () => {
      cy.get('form input[type="text"]')
        .should('be.visible')
        .clear()
        .type('Cypress')
        
      cy.get('form').submit()

      cy.wait('@novoTermoEnter')

      cy.get('.item').should('have.length', 20)
    
      // Assertion here
    })
*/

    context('Last searches', () => {
      it('searches via the last searched term', () => {

        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.wait('@novoTermoEnter')

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

          cy.wait('@getStories')

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })


      Cypress._.times(3,()=>{
        it('shows a max of 5 buttons for the last searched terms', () => {
          const faker = require('faker')

          Cypress._.times(6, () => {
            const word = faker.random.word()
            
            cy.intercept({
              method:'GET',
              pathname:'**/search',
              query:{
                query: `${word}`,
                page:'0'
              }
            }).as('randomWord')

            cy.get('#search')
              .clear()
              .type(`${word}{enter}`)
            
            cy.wait('@randomWord')
          })
          
          cy.get('.last-searches button')
            .should('have.length', 5)
        })
      })
        
    })
  })
  context('Errors', () => {
    const msgErro = 'Something went wrong ...'
  
    it('shows "Something went wrong ..." in case of a server error', () => {
      cy.intercept(
        'GET',
        `**/search?query=React&page=0`,
        { statusCode: 500 },
      ).as('serverError')
  
      cy.get('#search')
        .clear()
        .type(`React{enter}`)
      cy.wait('@serverError')
  
      cy.contains(msgErro)
        .should('be.visible')
    })
  
    it('shows "Something went wrong ..." in case of a network error', () => {
      cy.intercept(
        'GET',
        `**/search?query=Cypress&page=0`,
        { forceNetworkError: true },
      ).as('networkError')
  
      cy.get('#search')
        .clear()
        .type(`Cypress{enter}`)
      cy.wait('@networkError')
  
      cy.contains(msgErro)
        .should('be.visible')
    })
  })

})


