"use strict";
describe('Array', () => {
	describe('#indexOf()', () => {
    context('when not present', () => {
      it('should not throw an error', () => {
        (() => {
          [1,2,3].indexOf(4);
        }).should.not.throw();
      });
      it('should return -1', () => {
        [1,2,3].indexOf(4).should.equal(-1);
      });
    });
    context('when present', () => {
      it('should return the index where the element first appears in the array', () => {
        [1,2,3].indexOf(3).should.equal(2);
      });
    });
  });
});