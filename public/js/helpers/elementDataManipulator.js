define([], function () {
    'use strict';
    return function ($targetEl) {
        function getValue(val, key) {
            var valObject = $targetEl.data(val) || {};
            
            return key ? valObject[key] : valObject;
        }
        function setValue(val, attr, attrValue) {
            var valObject = getValue(val);

            valObject[attr] = attrValue;
            $targetEl.data(val, valObject);
        }

        return {
            set: setValue,
            get: getValue
        };
    };
});
