/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
angular.module('controllerAs', ['ngRoute'])
    .controller('controllerAsCtrl', function () {
        this.content = "这是controllerAs的内容";
    });