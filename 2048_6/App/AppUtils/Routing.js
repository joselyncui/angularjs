tzfeApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/mainView");
    $stateProvider.state('mainView', {
        url: '/mainView',
        templateUrl: 'App/Common/Pages/MainView.html',
        controller: 'GameCtrl'
    });
});