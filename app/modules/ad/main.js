angular.module('shopthatvid')
  .config(function ($stateProvider) {
  $stateProvider
    .state('ad', {
      url: '/ad',
      template: '<ui-view/>'
    })
    .state('ad.view', {
      url: '/:id',
      templateUrl: 'app/modules/ad/view-ad/view-ad.html',
      controller: 'ViewAdCtrl',
      resolve:{
        ad:function(adService, $stateParams, $state){
          return adService.getAd($stateParams.id).then(function(res){
            if(!res){
              $state.go('home');
            }
            return res;
          });
        }
      }
    });
});