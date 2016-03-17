/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/**
 * ng 中对指令的解析与执行过程是这样的：

 浏览器得到 HTML 字符串内容，解析得到 DOM 结构。
 ng 引入，把 DOM 结构扔给 $compile 函数处理：
 找出 DOM 结构中有变量占位符
 匹配找出 DOM 中包含的所有指令引用
 把指令关联到 DOM
 关联到 DOM 的多个指令按权重排列
 执行指令中的 compile 函数（改变 DOM 结构，返回 link 函数）
 得到的所有 link 函数组成一个列表作为 $compile 函数的返回
 执行 link 函数（连接模板的 scope）。

 $compile 最基本的使用方式：
 var link = $compile('<p>{{ text }}</p>');
 var node = link($scope);
 console.log(node);

 所以应该把改变 DOM 结构的逻辑放在 compile 函数中做。
 */

angular.module('directive', [])
    //restrict中文意思是约束,必须大写,E->element,C->class,A->Attribute,M->comment注释
    //这里没有规定哪个必须有哪个，即需要模板就用template，需要处理元素就用link
    .directive('element', function () {
        return {
            restrict: "E",
            template: "<div>elementTest</div>"
        }
    })
    .directive('attr', function () {
        return {
            restrict: "A",
            //link前面三个参数固定
            link: function (scope, element, attrs) {
                console.info("attrs working");
            }
        }
    })
    .directive('class', function () {
        return {
            restrict: "C",
            link: function () {
                console.info("class working");
            }
        }
    })
    .directive('comment', function () {
        return {
            restrict: "M",
            link: function () {
                console.info("comment working");
            }
        }
    });

//默认是attribute
//此时只需要返回一个function即link的内容就足够了
angular.module('directive')
    .directive('enter', function () {
        return function (scope, element) {
            element.bind("mouseenter", function () {
                console.info("I'm enter");
            });
        }
    });

angular.module('directive')
    .controller("direCtrl", function ($scope) {
        $scope.myFunction = function () {
            console.info("myFunction run");
        }
    })
    .directive('diretoctrl', function () {
        return function (scope, element, attrs) {
            element.bind("mouseenter", function () {
                scope.$apply(attrs.diretoctrl)
            })
        }
    });

angular.module('directive')
    .directive('direcone', function () {
        return {
            restrict: "E",
            //directive之间通讯的关键就是这个controller属性
            controller: function () {
                this.direct1Func = function (user) {
                    console.info("调用者->" + user + "direcone direct1Func run");
                }
            }
        }
    })
    .directive('directwo', function () {
        return {
            //这个属性指定要引入哪个directive的controller，然后注入
            require: "direcone",
            link: function (scope, element, attrs, direcone) {
                element.bind("mouseenter", function () {
                    direcone.direct1Func("directwo");
                });
            }
        }
    });

//共享scope的情况
angular.module('directive')
    .directive("sharedirective1", function () {
        return {
            template: '<input type="text" ng-model="shareData"><br>{{shareData}}'
        }
    });

//不共享scope的情况
angular.module('directive')
    .directive("isolatedDirective", function () {
        return {
            scope: {},
            template: '<input type="text" ng-model="shareData"><br>{{shareData}}'
        }
    });

//注意，下面的这三种方式，都是template中指令跟scope中的属性挂钩，只是方式的不同，scope作用域不同

//@ 方式局部属性用来访问 directive 外部环境定义的字符串值，
// 居然是通过 directive 所在的标签属性绑定外部字符串值，即在html页面需要写name="{{name}}"
// 特殊在于这种绑定是单向的，即父 scope 的绑定变化，directive 中的 scope 的属性会同步变化，而隔离 scope 中的绑定变化，父 scope 是不知道的。
angular.module('directive')
    .controller("controller2", function ($scope) {
        $scope.name = "hello world";
    })
    .directive("isolatedDirective1", function () {
        return {
            scope: {
                name: "@"//这里是跟html中该directive的name属性挂钩，定义了XXX，就跟XXX属性挂钩
                //这个@等价于在link中scope.xxx=attrs.xxx
            },
            template: 'Say：{{name}} ' +
            '<br>改变隔离scope的name：' +
            '<input type="text" ng-model="name">'
        }
    });

// = 通过 directive 的 attr 属性的值在局部 scope 的属性和父 scope 属性名之间建立双向绑定。
// 也是通过html指定，但是这次必须是user="user"，user="{{user}}"失效
// 这样无论是改变父 scope 还是隔离 scope 里的属性，父 scope 和隔离 scope 都会同时更新属性值，因为它们是双向绑定的关系。
//这里的父scope，个人理解是跟html的结构有关，因为js这里改了顺序结果还是一样的，在html中isolatedDirective2在controller3的内部，因此controller3是isolatedDirective2的父scope
angular.module('directive')
    .controller("controller3", function ($scope) {
        $scope.user = {
            name: 'hello',
            id: 1
        };
    }).directive("isolatedDirective2", function () {
        return {
            scope: {
                user: "="//等价于在link中scope.xxx=父scope[attrs.xxx]
            },
            template: 'Say：{{user.name}} ' +
            '<br>改变隔离scope的name：' +
            '<input type="text" ng-model="user.name"/>'
        }
    });

// & 方式提供一种途经是 directive 能在父 scope 的上下文中执行一个表达式。此表达式可以是一个 function。
// 比如当你写了一个 directive，当用户点击按钮时，directive 想要通知 controller，controller 无法知道 directive 中发生了什么，
// 也许你可以通过使用 angular 中的 event 广播来做到，但是必须要在 controller 中增加一个事件监听方法。
// 最好的方法就是让 directive 可以通过一个父 scope 中的 function，当 directive 中有什么动作需要更新到父 scope 中的时候，可以在父 scope 上下文中执行一段代码或者一个函数。

angular.module('directive')
    .controller("controller4", function ($scope) {
        $scope.value = "hello world";
        $scope.click = function (value) {
            console.info(value);
            $scope.value = Math.random();
        };
    })
    .directive("isolatedDirective3", function () {
        return {
            scope: {
                action: "&"//等价于在link中父scope.$apply(attrs.xxx)
            },
            template: '<input type="button" value="在directive中执行父scope定义的方法" ng-click="action()"/>'
        }
    });

angular.module('directive')
    .directive("notTransclude", function () {
        return {
            restrict: "E",
            template: '<div>会被覆盖</div>'
        }
    });
angular.module('directive')
    .directive("isTransclude", function () {
        return {
            restrict: "E",
            transclude: true,
            //这个有改动？！照视频敲的'<div ng-transclude>不会被覆盖</div>'出不来，必须这样才能出来
            //这样理解，有ng-transclude属性的标签表示原始内容插入到该标签中
            template: '<div>不会被覆盖<div ng-transclude></div></div>'
        }
    });

angular.module('directive')
    .directive("zippy", function () {
        return {
            restrict: "E",
            scope: {
                title: "@"//scope将属性独立出来了，template中读取的时候，是根据这里scope的属性map获取的
            },
            //replace属性的意思是如果设置为true，那么模版将会替换当前元素，而不是作为子元素添加到当前元素中。（注：为true时，模版必须有一个根节点）
            transclude: true,
            link: function (scope) {
                scope.isContentVisible = false;
                scope.toggleContent = function () {
                    scope.isContentVisible = !scope.isContentVisible;
                }
            },
            template: '<div>' +
            '<h2 ng-click="toggleContent()">{{title}}</h2>' +
            '<div ng-show="isContentVisible" ng-transclude></div>' +
            '</div>'
        }
    });





