'use strict';

describe('Storage', function() {

    var storage;

    beforeEach(module('eat-this-one'));

    beforeEach(inject(function(_storage_){
        storage = _storage_;
    }));

    afterEach(function() {
        localStorage.clear();
    });

    describe('storage.add()', function() {
        it('should return nothing if the item does not exist', function() {
            expect(storage.isIn('wrong', 'value')).toBe(false);
        });

        it('should init an item', function() {
            storage.add('example', 'value1');

            expect(storage.isIn('example', 'value1')).toBe(true);
            expect(storage.isIn('wrong', 'value1')).toBe(false);
            expect(storage.isIn('example', 'wrong')).toBe(false);
        });

        it('should add more values to an item', function() {
            storage.add('example', 'value1');
            storage.add('example', 'value2');

            expect(storage.isIn('example', 'value1')).toBe(true);
            expect(storage.isIn('example', 'value2')).toBe(true);
            expect(storage.isIn('wrong', 'value1')).toBe(false);
            expect(storage.isIn('wrong', 'value2')).toBe(false);
            expect(storage.isIn('example', 'wrong')).toBe(false);
        });
    });

});
