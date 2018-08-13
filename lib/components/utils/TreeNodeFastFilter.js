'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createFilterOptions;

var _jsSearch = require('js-search');

function createFilterOptions({
    indexes,
    indexStrategy,
    labelKey = 'label',
    options = [],
    sanitizer,
    searchIndex,
    tokenizer,
    valueKey = 'value'
}) {
    const search = new _jsSearch.Search(valueKey);
    search.searchIndex = searchIndex || new _jsSearch.UnorderedSearchIndex();
    search.indexStrategy = indexStrategy || new _jsSearch.AllSubstringsIndexStrategy();

    if (sanitizer) {
        search.sanitizer = sanitizer;
    }

    if (tokenizer) {
        search.tokenizer = tokenizer;
    }

    if (indexes) {
        indexes.forEach(index => {
            search.addIndex(index);
        });
    } else {
        search.addIndex(labelKey);
    }

    search.addDocuments(options);

    // See https://github.com/JedWatson/react-select/blob/e19bce383a8fd1694278de47b6d00a608ea99f2d/src/Select.js#L830
    // See https://github.com/JedWatson/react-select#advanced-filters
    return function filterOptions(options, filter, selectedOptions) {
        const filtered = filter ? search.search(filter) : options;

        let filteredWithParents = filtered;
        filtered.forEach(option => {
            const index = filteredWithParents.findIndex(obj => obj[valueKey] === option[valueKey]);
            let indexParent = options.findIndex(obj => obj[valueKey] === option.parent);
            while (indexParent >= 0) {
                const parent = options[indexParent];
                if (filteredWithParents.includes(parent)) break;
                filteredWithParents.splice(index, 0, parent);
                indexParent = options.findIndex(obj => obj[valueKey] === parent.parent);
            }
        });

        for (let index = 0; index < filteredWithParents.length; index++) {
            if (!filteredWithParents[index].expanded) {
                filteredWithParents = _filter(filteredWithParents, index);
            }
        }

        if (Array.isArray(selectedOptions) && selectedOptions.length) {
            const selectedValues = selectedOptions.map(option => option[valueKey]);

            return filtered.filter(option => !selectedValues.includes(option[valueKey]));
        }

        return filteredWithParents;
    };
}

function _filter(filteredWithParents, index) {
    return filteredWithParents.filter(option => {
        if (option.graph === filteredWithParents[index].graph) return true;
        return !option.graph.toString().startsWith(filteredWithParents[index].graph.toString());
    });
}