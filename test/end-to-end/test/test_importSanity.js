const Nightmare = require('nightmare');
const expect = require('chai').expect;
const EditRecipePage = require('../pages/editRecipe');
const apiCall = require('../utils/apiCall');
const pageConfig = require('../config');
const sqlite3 = require('sqlite3').verbose();

describe('Imported Content Sanity Testing', function () {
  this.timeout(15000);
  const db = new sqlite3.Database(process.env.MDDB || 'metadata.db');

  before((done) => {
    // Check BDCS API and Web service first
    apiCall.serviceCheck(done);
  });

  before((done) => {
    // Create a new recipe before the first test run in this suite
    apiCall.newRecipe(pageConfig.recipe.simple, done);
  });

  after((done) => {
    // Delete added recipe after all tests completed in this sute
    apiCall.deleteRecipe(pageConfig.recipe.simple.name, done);
  });

  const editRecipePage = new EditRecipePage(pageConfig.recipe.simple.name);

  it('displayed count should match distinct count from DB', (done) => {
    db.each('SELECT name, COUNT(DISTINCT name) AS total_count FROM groups', (err, row) => {
      const expectedText = `1 - 50 of ${row.total_count}`;

      const nightmare = new Nightmare();
      nightmare
        .goto(editRecipePage.url)
        .wait(editRecipePage.totalComponentCount)
        .then(() => nightmare
          .evaluate(page => document.querySelector(page.totalComponentCount).innerText
            , editRecipePage))
        .then((element) => {
          expect(element).to.equal(expectedText);
          done();
        });
    });
  });
});