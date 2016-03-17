angular.module('factory', [])
    .factory('game', function () {
        return {
            content: "factory content"
        }
    })
    .controller('factoryCtrl', function ($scope, game) {
        $scope.content = game.content;
    });