'use strict';
/* global angular */

(function () {
    angular
        .module('prettyjsdebug',[])
        .directive('debug',debugDirective)
        .filter('debug',debugFilter);

    function debugDirective () {
        return {
            restrict: 'E',
            template: templateFn,
            scope: {var: '='}
        };
        function templateFn (tElement, tAttrs) {
            var depth = tAttrs.depth || false;
            return '<pre>{{ var | debug : ' + depth +' }}</pre>';
        }
    }
    function debugFilter () {
        var depth, maxDepth;
        var indentStr = '  ';
        var depthDefault = 3;

        return function (val, max) {
            depth = 0;
            maxDepth = (max && parseInt(max)) ?
                max :
                depthDefault;
            return getStringVal(val);
        };
        
        function getStringVal (val) {
            var str = '';
            var indent = '';
            
            for(var i=0; i<depth; i++) { indent += indentStr; }
            str += indent;

            // SIMPLE VALUES
            if (val === undefined) str += 'Undefined';
            else if (val === null) str += 'Null';
            else if (val.constructor === String) str += '"' + val + '"';
            else if (val.constructor === Number || val.constructor === Boolean) str += val;
            else if (val.constructor === Date || val.constructor === RegExp) str += val.toString();
            // FUNCTIONS
            else if (val.constructor === Function) {
                var match = val.toString().match(/function (\w+)/);
                str += (match) ? 
                    '<< Function "' + match[1] + '" >>' :
                    '<< Anon Function >>';
            }
            // ITERABLES
            else if (typeof val == 'object') {
                var isArray = val.constructor === Array;
                if (depth >= maxDepth) {
                    str += '<< ';
                    str += isArray ?
                        'Array (' + val.length + ')' :
                        'Object';
                    str += ' >>';
                    return str;
                }

                str += isArray ? '[\n' : '{\n';
                depth++;
                if (isArray) {
                    for(var j=0;j<val.length;j++) {
                        str += getStringVal(val[j]) +',\n';
                    }
                } else {
                    for (var key in val) {
                        if (val.hasOwnProperty(key)) {
                            var valStr = getStringVal(val[key]);
                            valStr = valStr.replace(/^\s+/,'');
                            str += indent + indentStr + key + ': ' + valStr +',\n';
                        }
                    }
                }
                depth--;
                str += indent;
                str += (isArray) ? ']' : '}';
            }
            else {
                str = val.toString();
            }
            return str;
        }
    }
})();