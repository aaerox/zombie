const assert      = require('assert');
const Browser     = require('../src/zombie');
const { brains }  = require('./helpers');


describe('Promises', function() {
  let browser;

  before(async function() {
    browser = Browser.create();
    brains.get('/promises', function(req, res) {
      res.send('<script>document.title = "Loaded"</script>');
    });
    await brains.ready();
  });


  describe('visit', function() {
    it('should resolve when page is done loading', function(done) {
      browser.visit('/promises')
        .then(function() {
          browser.assert.text('title', 'Loaded');
          done();
        }, function() {
          done(new Error('Promise rejected'));
        });
    });
  });


  describe('error', function() {
    it('should reject with an error', function(done) {
      browser.visit('/promises/nosuch')
        .done(function() {
          done(new Error('Promise resolved'));
        }, function(error) {
          assert.equal(error.message, 'Server returned status code 404 from http://example.com/promises/nosuch');
          done();
        });
    });
  });

  after(function() {
    return browser.destroy();
  });

});
