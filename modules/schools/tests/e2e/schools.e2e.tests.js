'use strict';

describe('Schools E2E Tests:', function () {
  describe('Test Schools page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/schools');
      expect(element.all(by.repeater('school in schools')).count()).toEqual(0);
    });
  });
});
