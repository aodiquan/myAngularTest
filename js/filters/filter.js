/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
// 类似于管道，之所以需要返回function，他会传text进来，然后调用这个function，实现管道的效果
angular.module('filter', [])
    .filter("reverse", function () {
        return function (text) {
            return text.split("").reverse().join("");
        }
    })
    .controller("filterCtrl", function ($scope) {
        $scope.datas = [{
            id: 1098,
            name: 'iPhone',
            price: 5288
        }, {
            id: 5420,
            name: 'iPad',
            price: 4388
        }, {
            id: 2067,
            name: 'Mac Book',
            price: 10888
        }, {
            id: 5991,
            name: 'Surface',
            price: 9288
        }]
    });

