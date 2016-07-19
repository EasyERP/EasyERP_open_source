define([
    'jQuery',
    'Underscore',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'constants/filters'
], function ($, _, chai, chaiJquery, sinonChai, FilterView, FilterGroup, SavedFilters, FILTER_CONSTANTS) {
    return function (filterOptions) {
        var server = sinon.fakeServer.create();
        var selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
        var removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
        var saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
        var removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
        var debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
            return debFunction;
        });
        var url = filterOptions.url;
        var contentType = filterOptions.contentType;

        chai.use(chaiJquery);
        chai.use(sinonChai);
        expect = chai.expect;

        function select2FiltersAndremove1(firstValue, secondValue, viewType, ajaxSpy, fakeData) {
            var $searchContainer = $('#searchContainer');
            var $thisEl = $('#content-holder');
            var $searchArrow = $searchContainer.find('.search-content');
            var contentUrl = new RegExp(url, 'i');
            var $firstContainer = '#' + firstValue + 'FullContainer .groupName';
            var $firstSelector = '#' + firstValue + 'Ul > li:nth-child(1)';
            var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
            var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
            var elementQuery = (viewType === 'listView') ? '#listTable > tr' : '.thumbnailElement';
            var $firstGroup;
            var $secondGroup;
            var elementsCount;
            var $selectedItem;
            var ajaxResponse;
            var filterObject;
            server = sinon.fakeServer.create();
            selectSpy.reset();

            // open filter dropdown
            $searchArrow.click();
            expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

            // select firstGroup filter
            ajaxSpy.reset();
            $firstGroup = $searchContainer.find($firstContainer);
            $firstGroup.click();

            $selectedItem = $searchContainer.find($firstSelector);

            server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeData)]);
            $selectedItem.click();
            server.respond();

            expect(selectSpy.calledOnce).to.be.true;
            expect($thisEl.find('#searchContainer')).to.exist;
            //expect($thisEl.find('#startLetter')).to.exist;
            expect($searchContainer.find('#searchFilterContainer>div')).to.have.lengthOf(1);
            expect($searchContainer.find($firstSelector)).to.have.class('checkedValue');
            elementsCount = $thisEl.find(elementQuery).length;
            expect(elementsCount).to.be.not.equals(0);

            expect(ajaxSpy.calledOnce).to.be.true;

            ajaxResponse = ajaxSpy.args[0][0];
            expect(ajaxResponse).to.have.property('url', url);
            expect(ajaxResponse).to.have.property('type', 'GET');
            expect(ajaxResponse.data).to.have.property('filter');
            filterObject = ajaxResponse.data.filter;

            expect(filterObject[firstValue]).to.exist;
            expect(filterObject[firstValue]).to.have.property('key', FILTER_CONSTANTS[contentType][firstValue].backend);
            expect(filterObject[firstValue]).to.have.property('value');
            expect(filterObject[firstValue].value)
                .to.be.instanceof(Array)
                .and
                .to.have.lengthOf(1);

            // select secondGroup filter
            ajaxSpy.reset();

            $secondGroup = $thisEl.find($secondContainer);
            $secondGroup.click();
            $selectedItem = $searchContainer.find($secondSelector);
            $selectedItem.click();
            server.respond();

            expect(selectSpy.calledTwice).to.be.true;
            expect($thisEl.find('#searchContainer')).to.exist;
            //expect($thisEl.find('#startLetter')).to.exist;
            expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(2);
            expect($searchContainer.find($secondSelector)).to.have.class('checkedValue');
            elementsCount = $thisEl.find(elementQuery).length;
            expect(elementsCount).to.be.not.equals(0);

            ajaxResponse = ajaxSpy.args[0][0];
            expect(ajaxResponse).to.have.property('url', url);
            expect(ajaxResponse).to.have.property('type', 'GET');
            expect(ajaxResponse.data).to.have.property('filter');
            filterObject = ajaxResponse.data.filter;

            expect(filterObject[firstValue]).to.exist;
            expect(filterObject[secondValue]).to.exist;
            expect(filterObject[secondValue]).to.have.property('key', FILTER_CONSTANTS[contentType][secondValue].backend);
            expect(filterObject[secondValue]).to.have.property('value');
            expect(filterObject[secondValue].value)
                .to.be.instanceof(Array)
                .and
                .to.have.lengthOf(1);

            // unselect secondGroup filter
            $selectedItem = $searchContainer.find($secondSelector);
            $selectedItem.click();
            server.respond();

            expect(selectSpy.calledThrice).to.be.true;
            expect($thisEl.find('#searchContainer')).to.exist;
            //expect($thisEl.find('#startLetter')).to.exist;
            expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
            expect($searchContainer.find($secondSelector)).to.have.not.class('checkedValue');
            elementsCount = $thisEl.find(elementQuery).length;
            expect(elementsCount).to.be.not.equals(0);

            ajaxResponse = ajaxSpy.args[0][0];
            expect(ajaxResponse).to.have.property('url', url);
            expect(ajaxResponse).to.have.property('type', 'GET');
            expect(ajaxResponse.data).to.have.property('filter');
            filterObject = ajaxResponse.data.filter;

            expect(filterObject[firstValue]).to.exist;
            expect(filterObject[secondValue]).to.not.exist;

        }

        function saveFilter(responseForSaveFilter) {
            var $searchContainer = $('#searchContainer');
            var userUrl = new RegExp('\/users\/', 'i');
            var $searchArrow = $searchContainer.find('.search-content');
            var $favoritesBtn;
            var $filterNameInput;
            var $saveFilterBtn;

            saveFilterSpy.reset();

            $searchArrow.click();
            expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

            $favoritesBtn = $searchContainer.find('.filter-dialog-tabs > li:nth-child(2)');
            $favoritesBtn.click();
            expect($searchContainer.find('#filtersContent')).to.have.class('hidden');

            $filterNameInput = $searchContainer.find('#forFilterName');
            $filterNameInput.val('TestFilter');
            $saveFilterBtn = $searchContainer.find('#saveFilterButton');
            server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(responseForSaveFilter)]);
            $saveFilterBtn.click();
            server.respond();
            expect(saveFilterSpy.called).to.be.true;
            expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(1);
            expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
        }

        function removeSavedFilter() {
            var $searchContainer = $('#searchContainer');
            var $deleteSavedFilterBtn = $searchContainer.find('#savedFiltersElements > li:nth-child(1) > button.removeSavedFilter');
            var userUrl = new RegExp('\/users\/', 'i');

            removedFromDBSpy.reset();

            server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
            $deleteSavedFilterBtn.click();
            server.respond();

            expect(removedFromDBSpy.calledOnce).to.be.true;
            expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
            expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
        }

        function removeFilter(secondValue, ajaxSpy) {
            var $searchContainer = $('#searchContainer');
            var $searchArrow = $searchContainer.find('.search-content');
            var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
            var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
            var $thisEl = $('#content-holder');
            var $secondGroup;
            var $selectedItem;
            var $removeBtn;

            $searchArrow.click();

            $secondGroup = $thisEl.find($secondContainer);
            $secondGroup.click();
            $selectedItem = $searchContainer.find($secondSelector);
            $selectedItem.click();
            server.respond();

            // remove firstGroupFilter
            ajaxSpy.reset();
            removeFilterSpy.reset();

            $removeBtn = $searchContainer.find('.removeValues');
            $removeBtn.click();
            server.respond();

            expect(removeFilterSpy.calledOnce).to.be.true;
            expect(ajaxSpy.calledOnce).to.be.true;
        }

        return {
            select2FiltersAndremove1: select2FiltersAndremove1,
            saveFilter              : saveFilter,
            removeSavedFilter       : removeSavedFilter,
            removeFilter            : removeFilter
        };
    };
});
