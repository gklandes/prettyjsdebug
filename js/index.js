'use strict';
/* global angular */

(function () {
    angular.module('MyApp',['prettyjsdebug'])
        .controller('MyCtrl',MyCtrl);

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

})();