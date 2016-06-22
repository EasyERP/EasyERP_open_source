define([
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'jQuery',
    'Underscore',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (FilterView, FilterGroup, SavedFilter, $, _, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    return function () {
        var selectSpy;
        var debOnceStub;
        var removeFilterSpy;
        var saveFilterSpy;

        before(function() {
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            debOnceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilter.prototype, 'saveFilter');
        });

        after(function () {
            selectSpy.restore();
            debOnceStub.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
        });

        it('Test', function () {
            expect(1).to.be.equals(1);
        });
    };
});

