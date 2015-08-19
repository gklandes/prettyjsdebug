(function () {
    var myapp = angular.module('MyApp',[])
    .controller('MyCtrl',MyCtrl)
    .directive('debug',debugDirective)
    .filter('debug',debugFilter);

    function MyCtrl () {
        var vm = this;
        vm.tests = {
            String: 'It\'s working!',
            Number: 1234,
            Bool: false,
            Null: null,
            Undef: undefined,
            NotNum: NaN,
            Fxn: myFn,
            Complex: ['one',2,['a','b'],{foo: 'bar'},myFn],
            Array: [1,2,'three'],
            Object: {foo: 'bar', fizz: 'baz'},
            DeepNest: { outer : [ 'a',1,false,{ inner: 'foo', inner2: 'bar' },[2,[3,[4, myFn ]]]]}
        };

        function myFn (arg) { return arg; }
    }
    debugDirective.$inject = ['$filter'];
    function debugDirective ($filter) {
        return {
            restrict: 'E',
            template: '<pre>{{ var | debug }}</pre>',
            scope: {var: '='}
        }
    }
    function debugFilter () {
        var depth = 0;
        var indentStr = '  ';
        var maxDepth = 3;

        return function (val, max) {
            if (max && parseInt(max)) maxDepth = max;
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
            else if (val.constructor === Number) str += val;
            else if (val.constructor === Boolean) str += val;
            // FUNCTIONS
            else if (val.constructor === Function) {
                var match = val.toString().match(/function (\w+)/);
                str += (match) ? 
                    '<< Function "' + match[1] + '" >>' :
                    '<< Anon Function >>'; //val.toString().replace(/\n(\s*)/g,'\n'+indent+'$1');
            }
            // ITERABLES
            else if (typeof val == 'object') {
                if (depth >= maxDepth) {
                    str += indent + indentStr + '<< ';
                    str += val.constructor === Array ?
                        'Array (' + val.length + ')' :
                        'Object';
                    str += ' >>';
                    return str;
                }

                var isArray = val.constructor === Array;
                str += (isArray) ? '[\n' : '{\n';
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
