app.config(function ($routeProvider) {
    $routeProvider
    .when('/ListLocalStorage',{
        templateUrl: '/View/ListLocalStorage.htm',
        controller: 'myController'
    })
    .when('/index',{
        templateUrl: '/View/index1.htm',
        controller: 'myController'
    })
     .otherwise({
         redirectTo: '/index'
     });
     
});
