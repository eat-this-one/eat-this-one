'use strict';

describe('Dates Converter', function() {

    var datesConverter;

    var now = new Date();

    var today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    beforeEach(module('eat-this-one'));

    beforeEach(inject(function(_datesConverter_){
        datesConverter = _datesConverter_;
    }));
    
    describe('datesConverter.dayToTime()', function() {
        it('should return a timestamp', function() {
            expect(datesConverter.dayToTime('today')).toBe(today);
            expect(datesConverter.dayToTime('tomorrow')).toBe(today + datesConverter.getDaymillisecs());
            expect(datesConverter.dayToTime('aftertomorrow')).toBe(today + (2 * datesConverter.getDaymillisecs()));
        });
    });

    describe('datesConverter.timeToDay()', function() {
        it('should return today, tomorrow or aftertomorrow', function() {
            expect(datesConverter.timeToDay(today)).toBe('today');
            expect(datesConverter.timeToDay(today + datesConverter.getDaymillisecs())).toBe('tomorrow');
            expect(datesConverter.timeToDay(today + (2 * datesConverter.getDaymillisecs()))).toBe('aftertomorrow');
        });
        it('should return the current day if the provided timestamp in not one of the 3 options above', function() {
        });
    });

});
