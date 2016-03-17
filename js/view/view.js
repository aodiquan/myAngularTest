/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
angular.module('view', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "../pages/viewData.html",
            controller: viewCtrl,
        })
            .when('/:message', {
                templateUrl: "../pages/viewData.html",
                controller: viewCtrl
            })
            .when('/p/promise', {
                template: "2秒后显示",
                //promise的另一种做法
                resolve: {
                    testPromise: function ($q, $timeout) {
                        var defer = $q.defer();
                        $timeout(function () {
                            defer.resolve();
                        }, 2000);
                        return defer.promise;
                    }
                }
            })
            //演示promise出错以后，接收错误信息
            .when('/e/error', {
                controller: errerReportCtrl,
                resolve: {
                    loadData: loadData
                }
            })
            .otherwise({
                redirectTo: "/"
            });
    });

function viewCtrl($scope, $routeParams, $q) {
    //演示angular中promise模型的使用
    var defer = $q.defer();
    defer.promise
        .then(function (message) {
            alert(message);
            return "A resole";
        })
        .then(function (message) {
            alert(message);
            return "B resole";
        })
        .then(function (message) {
            alert(message);
        });
    defer.resolve("I want to resole some things");

    $scope.model = {
        message: $routeParams.message
    }
}

var errerReportCtrl = angular.module('view')
    .controller('errerReportCtrl', function ($scope) {
        $scope.$on("$routeChangeError", function (event, current, previous, rejection) {
            console.info(rejection);
        })
    });
function loadData($q, $timeout) {
    var defer = $q.defer();
    $timeout(function () {
        defer.reject("网络异常");
    }, 2000);
    return defer.promise;
}

//演示利用directive显示promise错误信息
angular.module('view')
    .directive('error', function ($rootScope) {
        return {
            restrict: "E",
            template: "<div ng-show='isError'>错误！</div>",
            link: function (scope) {
                $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
                    scope.isError = true;
                })
            }
        }
    });
