tzfeCommon.controller('GameCtrl', ['$scope', '$timeout', 'bestScore', 'GameService', function ($scope, $timeout, bestScore, gameService) {
    $scope.bestScore = bestScore;
    $scope.currentScore = gameService.currentScore();
    $scope.grid = gameService.initGame();
    $scope.gameInfo = gameService.getGameInfo();

    $scope.initGame = function() {
        $scope.currentScore = 0;
        $scope.grid = gameService.initGame();
        $scope.newScore = 0;
        $scope.gameInfo = gameService.getGameInfo();
    }
	
	
	var updateScore = function(){
		$scope.isAdd = true;
		$timeout(function(){
			$scope.isAdd = false;
		},650);
	}
	
	var move = function(keyCode) {
		$timeout(function(){
			if(keyCode >= 37 && keyCode <= 40) {
				var result = gameService.move(keyCode);
				$scope.newScore = gameService.currentScore()-$scope.currentScore;
				if ( $scope.newScore > 0) {
					updateScore();
				}
				$scope.currentScore = gameService.currentScore();

				if($scope.bestScore < $scope.currentScore) {
					$scope.bestScore = $scope.currentScore;
				}
			}
		}, true)
	}

    $(document).keydown(function(event){
        //37: 左
        //38：上
        //39： 右
        //40： 下
        var keyCode = event.keyCode;
		 move(keyCode);    
    });
	
	$("body").on('swipeleft', function (evt) {
        var keyCode = 37;
        move(keyCode);
    });

    $("body").on('swiperight', function (evt) {
        var keyCode = 39;
        move(keyCode);
    });

    $("body").on('swipeup', function (evt) {
        var keyCode = 38;
        move(keyCode);
    });

    $("body").on('swipedown', function (evt) {
        var keyCode = 40;
        move(keyCode);
    });

}]);