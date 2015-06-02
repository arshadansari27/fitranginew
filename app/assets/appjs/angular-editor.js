/**
 * Created by arshad on 30/5/15.
 */

function ProfileFollowCtrl($scope) {

    var selector = '[data-model-id="' + $scope.model + '"]';
    var user_id = $(selecter).attr('data-user-id');
    $scope.title = '';
    $scope.color = '';

    console.log('[*][ProfileFollowCtrl]: ' + $scope.model);
    console.log('[*][ProfileFollowCtrl]: ' + user_id);
}

