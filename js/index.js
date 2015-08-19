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

    return function (val) {
        return getStringVal(val);
    }
    
    function getStringVal (val) {
        var str = '';
        var indent = '';
        
        for(i=0;i<depth;i++) { indent += indentStr }
        str += indent;
        
        console.log(depth, val);
        
        // SIMPLE VALUES
        if (val === undefined) str += 'Undefined';
        else if (val === null) str += 'Null';
        else if (val.constructor === String) str += '"' + val + '"';
        else if (val.constructor === Number) str += val;
        else if (val.constructor === Boolean) str += val;
        // FUNCTIONS
        else if (val.constructor === Function) {
            str += val.toString().replace(/\n(\s*)/g,'\n'+indent+'$1');
        }
        // ITERABLES
        else if (typeof val == 'object') {
            var isArray = val.constructor === Array;
            str += (isArray) ? '[\n' : '{\n';
            depth++;
            if (isArray) {        
                for(j=0;j<val.length;j++) {
                    str += getStringVal(val[j]) +',\n';
                }
            } else {
                for (var key in val) {
                    if (val.hasOwnProperty(key)) {
                        console.log(key, val[key]);
                        valStr = getStringVal(val[key]);
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
            if (val) console.log(val, val.constructor, typeof val);
            else console.log('--');
            str = 'foo';
        }
        return str;
    }
}