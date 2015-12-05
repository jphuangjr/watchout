// start slingin' some d3 here.

var enemiesArr = [];
var enemiesCount = 10;
var highScore = 0;
var currScore = 0;
var gameProps = {
  width: 750,
  height: 500
}
var gameBoard = d3.selectAll('body').append('svg')
                  .attr('width', gameProps.width)
                  .attr('height', gameProps.height);


//Draw the enemies in an svg element.
var createEnemyLocation = function(enemiesCount) {
  for(var i=0; i<enemiesCount;i++) {
    enemiesArr.push({cx: Math.random()*gameProps.width, cy: Math.random()* gameProps.height, r: 10, id: i});
  }
  createBoard(enemiesArr)
}

var updateEnemyLocation = function() {
  for(var i=0; i<enemiesArr.length;i++) {
    enemiesArr[i].cx = Math.random()*gameProps.width
    enemiesArr[i].cy = Math.random()*gameProps.height
  }
}

var createBoard = function(enemiesArr){
  gameBoard.selectAll('circle').data(enemiesArr)
           .enter()
           .append('circle')
           .transition().duration(1000)
           .attr('cx', function(d) {return d.cx})
           .attr('cy', function(d) {return d.cy})
           .attr('r', function(d) {return d.r})
           .style({background: 'black'});

           
}

var updateBoard = function(enemiesArr){
  updateEnemyLocation()
  //console.log(enemiesArr[0]);
  gameBoard.selectAll('circle').data(enemiesArr)
  .transition().duration(1000)
  .attr('cx', function(d) {return d.cx})
  .attr('cy', function(d) {return d.cy})
  .attr('r', function(d) {return d.r})
  // .gameBoard.attr("class", "update")
}

createEnemyLocation(enemiesCount);

//Make it so that the enemies move to a new random location every second.

//Make a differently-colored dot to represent the player. Make it draggable.

//Detect when a enemy touches you.

//Keep track of the user's score, and display it.
var updateScore = function() {
  updateHighScore();
  d3.select('.highscore').selectAll('span').text(String(highScore));
  d3.select('.current').selectAll('span').text(String(currScore));
}

var updateHighScore = function() {
  if(currScore > highScore){
    highScore = currScore;
  }
}

setInterval(function(){updateBoard(enemiesArr)}, 1000);

