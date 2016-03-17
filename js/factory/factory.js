/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
angular.module('factory', [])
    .factory('game', function () {
        return {
            content: "factory content"
        }
    })
    .controller('factoryCtrl', function ($scope, game) {
        $scope.content = game.content;
    });