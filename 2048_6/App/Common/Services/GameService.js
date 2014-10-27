tzfeApp.service("GameService",function($timeout) {


    var tiles = new Array();
    var vector = new Array();
    var combinedArr = new Array();
    var maxNum = 0;
    var moveCount = 0;
    var gameover = false;
    var currentScore = 0;

    var gameInfo = {
        "isGameOver" : false,
        "isGameWin":false
    };

    var grids = new Array();

    var getGameInfo = function(){
        return gameInfo;
    }

    // 0-n random
    var getRandom = function(n) {
        return Math.floor(Math.random()*n+1);
    }

    var getTileByXY = function(x, y) {
        for(var i=0; i<grids.length; i++) {
            if(grids[i].x == x && grids[i].y == y && grids[i].isCopy!=true) {
                return grids[i];
            }
        }
    }

    function tile(value, x, y) {
        var tile = new Object();
        tile.value = value;
        tile.combined = false;
        tile.merged=false;
        tile.inMove = false;

        tile.x = x;
        tile.y = y;

        tile.changeValue = function(value) {
            tile.value = value;
        }
        tile.changePosition = function(x, y) {
        }
        tile.exchange = function(targetTile){
            if(targetTile.x != tile.x || targetTile.y != tile.y) {
                moveCount += 1;
                var tempX = targetTile.x;
                var tempY = targetTile.y;
                targetTile.updatePosition(tile.x, tile.y);
                tile.updatePosition(tempX, tempY);
            }
        }

        tile.updatePosition = function(x,y){
            tile.x = x;
            tile.y = y;
        }
        tile.clear = function() {
            tile.value = -1;
            tile.combined = false;
            tile.merged = false;
        }
        return tile;
    }

    var initDirection = function() {
        vector[38] = {'x':0, 'y': -1};
        vector[40] = {'x':0, 'y': 1};
        vector[37] = {'x':-1, 'y': 0};
        vector[39] = {'x':1, 'y': 0};
    }

    var initGrid = function() {
        grids.length = 0;
        for(var i=0; i<16; i++) {
            var rowA = Math.floor(i / 4);
            var colA = i % 4;
            grids.push(new tile(-1,rowA, colA ));
        }
    }

    var getInitValue = function() {
        var ran = getRandom(16);
        if(ran % 4 == 0) {
            return 4;
        }
        return 2;
    }
	
	var addNewAnim = function(tile){
		tile.isNew = true;
		$timeout(function(){
			tile.isNew = false;
		},201);
	}

    var initGame = function() {
        initDirection();
        initGrid();
        currentScore = 0;
		maxNum = 0;
        tiles.length = 0;
        gameInfo.isGameOver = false;
        gameInfo.isGameWin= false;

        var ranA = getRandom(15);
        var ranB = getRandom(15);
        while(ranA == ranB) {
            ranB = getRandom(15);
        }
        grids[ranA].value = getInitValue();
		
        if(grids[ranA].value == 4) {
            grids[ranB].value = 2;
        } else {
            grids[ranB].value = getInitValue();
        }
		
		//animation
		addNewAnim(grids[ranA]);
		addNewAnim(grids[ranB]);
		
        return grids;
    }

    var isWin = function() {
		return maxNum >= 2048;
		
    }

    var traversalDirections = function(keyCode) {
        var positions = {x: [], y: []};
        for (var x = 0; x < 4; x++) {
            positions.x.push(x);
            positions.y.push(x);
        }
        if (keyCode == 39) {
            positions.x = positions.x.reverse();
        }
        if (keyCode == 40) {
            positions.y = positions.y.reverse();
        }
        return positions;
    };

    var moveCellToPosition = function(tile, x, y) {
        tile.exchange(getTileByXY(x, y));
    }


    var removeTile = function(arrs, tile){
        for (i=0; i < arrs.length; i ++ ){
            var temp = arrs[i];
            if (temp.x==tile.x && temp.y == tile.y && temp.isCopy == tile.isCopy){
                arrs.splice(i,1);
            }
        }
    }

    var merge = function(oriTile, newTile) {
        moveCount += 1;

        var copyTile = new tile(oriTile.value, oriTile.x, oriTile.y);//copy oritile
        copyTile.isCopy = true;
        grids.push(copyTile);
        oriTile.clear();

        $timeout(function(){
            copyTile.x = newTile.x;
            copyTile.y = newTile.y;
        },10);

        $timeout(function(){
            newTile.changeValue(newTile.value * 2);
			removeTile(grids, copyTile);
			newTile.merged = true;
			
			if(newTile.value > maxNum) {
				maxNum = newTile.value;
			}
			gameInfo.isGameWin = isWin();
			currentScore += newTile.value;
			
        },100);
  
        newTile.combined = true;
        combinedArr.push(newTile);
    }


    var moveToNext = function(tile, x, y, xLength, yLength, vector) {
        var preTile = getTileByXY(x, y);
        x += vector.x;
        y += vector.y;
		
        var nextTile = null;
        if(x < 0 || x>=xLength || y<0 || y>=yLength) {
            moveCellToPosition(tile, preTile.x, preTile.y);
            return;
        } else if(getTileByXY(x, y).value != -1) {
            nextTile = getTileByXY(x, y);
            if(tile.value == nextTile.value && !nextTile.combined) {
                merge(tile, nextTile);
            } else {
                moveCellToPosition(tile, preTile.x, preTile.y);
            }
            return;
        }
        moveToNext(tile, x, y, xLength, yLength, vector);
    }


	var getEmptyCell = function(grids){
		var arrs = new Array();
        for(var i=0; i<grids.length; i++) {
            if(grids[i].value == -1&& !grids[i].isCopy) {
                arrs.push(grids[i]);
            }
        }
		return arrs;
	}
	
    var addATile = function() {
        var arrs = getEmptyCell(grids);
        var ran = getRandom(arrs.length - 1);
		
        if(arrs.length <= 1) {
            arrs[0].changeValue(getInitValue());
			gameInfo.isGameOver = isGameOver();
            
        } else {
            arrs[ran].changeValue(getInitValue());
			
            //animate
			addNewAnim(arrs[ran]);
        }
    }

    var isGameOver = function() {
		return !checkCanMove();
    }

    var checkCanMove = function() {
        for(var i=0; i<=3; i++) {
            for(var j=0; j<=3; j++) {
                var currentValue = getTileByXY(i, j).value;
				
                if (i + 1 < 4 && currentValue == getTileByXY(i + 1,j).value || 
						j+1<4 && currentValue == getTileByXY(i, j+1).value ) {
                    return true;
                }
            }
        }
        return false;
    }

    var clearCombined = function() {
        for(var i=0; i<combinedArr.length; i++) {
            combinedArr[i].combined = false;
        }
    }


    var removeCopy = function(arrs){
        for (var i=0; i < arrs.length; i++) {
            if (arrs[i].isCopy) {
                arrs.splice(i,1);
            }
        }
    }
	
	var exsitCopy = function(arrs){
		for (i=0; i < arrs.length; i ++ ){
            if (arrs[i].isCopy){
				return true;
			}
        }
	}
	
	var clearMerged = function(arrs){
		for (i=0; i < arrs.length; i ++ ){
            arrs[i].merged = false;
        }
	}
	
    var move = function(keyCode) {
		clearMerged(grids);
		if (!exsitCopy(grids)){
			var positions = traversalDirections(keyCode);
			
        for(var i=0; i<positions.x.length; i++) {
            for(var j=0; j<positions.y.length; j++) {
                x = parseInt(positions.x[i]);
                y = parseInt(positions.y[j]);
                var orignTile = getTileByXY(x, y);
                if(orignTile.value == -1) {
                    continue;
                }
                moveToNext(orignTile, x, y, positions.x.length, positions.y.length, vector[keyCode]);
            }
        }
		
        if(moveCount > 0) {
            moveCount = 0;
            clearCombined();
            $timeout(function(){
                addATile();
            }, 100);
        }
		}
        
        return "nor";
    }

    return {
        initGame: initGame,
        move: move,
        currentScore: function(){return currentScore;},
        getGameInfo:getGameInfo
    }

});