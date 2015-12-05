// start slingin' some d3 here.
// http://stackoverflow.com/questions/28647623/collision-overlap-detection-of-circles-in-a-d3-transition

var enemiesArr = [];
var enemiesCount = 10;
var highScore = 0;
var currScore = 1;
var totalCollisons = 0;
var gameProps = {
  width: 1000,
  height: 500
}
var player = [{"cx" : 10, "cy" : 10, "r": 20}]
var gameBoard = d3.selectAll('body').append('svg')
                  .attr('width', gameProps.width)
                  .attr('height', gameProps.height)
                  .classed("mainSvg", true);


//Draw the enemies in an svg element.
var createEnemyLocation = function(enemiesCount) {
  for(var i=0; i<enemiesCount;i++) {
    enemiesArr.push({cx: Math.random()*gameProps.width, cy: Math.random()* gameProps.height, r: 20, id: i});
  }
  createBoard(enemiesArr)
}

var updateEnemyLocation = function() {
  for(var i=0; i<enemiesArr.length;i++) {
    enemiesArr[i].cx = Math.random()*gameProps.width
    enemiesArr[i].cy = Math.random()*gameProps.height
  }

}

//Make a differently-colored dot to represent the player. Make it draggable.
var draggable = d3.behavior.drag();
draggable.on('dragstart', function(){/*detect collision*/});

draggable.on('drag', function(){
  player[0].cx = d3.event.x
  player[0].cy = d3.event.y
  // if(d3.event.x < gameProps.width && d3.event.y < gameProps.height){
  //   player[0].cx = d3.event.x
  //   player[0].cy = d3.event.y
  // } else {

  // }

  gameBoard.selectAll('circle.player').data(player)
           .attr('cx', d3.event.x)
           .attr('cy', d3.event.y);
})

var cursor = function(data){
  gameBoard.selectAll('circle.player').data(data)
           .enter()
           .append('circle')
           .attr('class', 'player')
           .attr('cx', function(d) {return d.cx})
           .attr('cy', function(d) {return d.cy})
           .attr('r', function(d) {return d.r})
           //.style({fill:'red'})
           .style("stroke", "black")     // displays small black dot
           .style("stroke-width", 0.25)
           .style({'fill': 'url(#image3)'})
           .call(draggable)
}


var createBoard = function(enemiesArr){
  cursor(player)
  gameBoard.selectAll('circle.enemy').data(enemiesArr)
           .enter()
           .append('circle')
           .transition().duration(200)
           .attr('class', 'enemy')
           .attr('cx', function(d) {return d.cx})
           .attr('cy', function(d) {return d.cy})
           .attr('r', function(d) {return d.r})
           .style("stroke", "black")     // displays small black dot
           .style("stroke-width", 0.25)
           .style({'fill': 'url(#image2)'});
           //.style({fill:'blue'})
  // gameBoard.selectAll('circle').data(enemiesArr)
  //          .append("svg:image")
  //          .attr("xlink:href", "zombie.png")
}

var updateBoard = function(enemiesArr){
  updateEnemyLocation()
  //console.log(enemiesArr[0]);
  gameBoard.selectAll('circle.enemy').data(enemiesArr)
  .transition().duration(1000)
  .tween("collide", function(d){
    // var lastX = parseInt(d3.select(this).attr("cx"));
    // var lastY =parseInt(d3.select(this).attr("cy"));
    // var r = parseInt(d3.select(this).attr("r"))
    //console.log(d3.select(this).attr("cx"));
    var oldThis = this;
    return function(){
      var lastX = parseInt(d3.select(oldThis).attr("cx"));
      var lastY =parseInt(d3.select(oldThis).attr("cy"));
      var r = parseInt(d3.select(oldThis).attr("r"))
      if(checkCollision(player[0], {"cx" : lastX, "cy" : lastY, "r" : r})){
        currScore = 0;
        //alert("hit!")"
        d3.selectAll("h1").style("display", "block")
        d3.select("body").classed("died", true);
      }
    }
  })
  .attr('cx', function(d) {return d.cx})
  .attr('cy', function(d) {return d.cy})
  .attr('r', function(d) {return d.r})
  // .gameBoard.attr("class", "update")
}

createEnemyLocation(enemiesCount);

//Make it so that the enemies move to a new random location every second.




//Detect when a enemy touches you.
var checkCollision = function(player, enemy){
  var dx = player.cx - enemy.cx;
  var dy = player.cy - enemy.cy;
  var distance = Math.sqrt(dx * dx + dy * dy);
  //console.log(distance)
  if(distance < player.r + enemy.r-5){
    return true;
  } else {
    return false
  }
}

var findCollision = function(){
      // console.log(player);
  for(var i=0; i<enemiesArr.length; i++){
    if(checkCollision(player[0], enemiesArr[i])){
      currScore = 0;
      totalCollisons++;
    }
  }
}

//Keep track of the user's score, and display it.
var updateScore = function() {
  updateHighScore();
  d3.select('.highscore').selectAll('span').text(String(highScore));
  d3.select('.current').selectAll('span').text(String(currScore));
  d3.select(".collisions").selectAll("span").text(String(totalCollisons))
}

var updateHighScore = function() {
  if(currScore > highScore){
    highScore = currScore;
  }
}


setInterval(function(){
  if(currScore === 0){
    totalCollisons++
    d3.selectAll("h1").style("display", "none")
    d3.select("body").classed("died", false);
  }
  updateBoard(enemiesArr);
  currScore++;
  updateScore();
}, 1000);

// setInterval(function(){
//   findCollision();
// }, 100);

