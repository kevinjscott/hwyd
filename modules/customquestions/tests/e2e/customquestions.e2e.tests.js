'use strict';

describe('Customquestions E2E Tests:', function () {
  describe('Test Customquestions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/customquestions');
      expect(element.all(by.repeater('customquestion in customquestions')).count()).toEqual(0);
    });
  });
});
