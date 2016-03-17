/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
//一种组织的方式
//好处是按CTRL+F12的时候可以清晰地看到整个app的结构
var app = augular.module("myApp", []);

var myAppStuff = {};

myAppStuff.controllers = {};
myAppStuff.controllers.AppCtrl = function ($scope) {
    this.sayHi1 = function () {
        alert("hi1");
    };
    return $scope.dtctrl = this;
};

myAppStuff.directives={};
myAppStuff.directives.panel=function(){
    return {
        restrict:"E"
    }
};

app.controller(myAppStuff.controllers);
app.directive(myAppStuff.directives);

