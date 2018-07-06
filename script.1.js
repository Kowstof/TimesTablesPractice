/*global $*/

// ligh attack obj
var LightAttack = {
  name: "Light Attack",
  damage: -250,
  chance: 0.90,
}

// heav attack obj
var HeavyAttack = {
  name: "Heavy Attack",
  damage: -420,
  chance: 0.60,
}

// repai obj
var Repair = {
  name: "Repair",
  damage: 300,
  chance: 1,
}


// ship obj
function Ship(name, health) {
  this.health = health;
  this.name = name;

  this.attack = function (attack) {
    if(checkAnswer) {
      var actionChance = Math.random(); //chance of action succeeding

      if (actionChance <= attack.chance) {

        //Applies damage, updates health text
        this.health += attack.damage;
        $("#"+ this.name + "Health").text(this.health);
        $("#health").val(this.Health);

        if(attack.damage > 0) { //Adds a "+" in front of damage number if healing
          $("#"+ this.name + "FloatText").text("+"+attack.damage);
        }
        else {
          $("#"+ this.name + "FloatText").text(attack.damage);
        }

        $("#"+ this.name + "FloatText").fadeIn().delay(600).fadeOut();
        console.log(this.name + " has been attacked with a " + attack.name + " dealing " + attack.damage + " damage!");
      }
      else {
        $("#"+ this.name + "FloatText").text("Dodged!");
        $("#"+ this.name + "FloatText").fadeIn().delay(600).fadeOut();
        console.log(this.name + " had an attack fail on them");
      }
    }
    //If incorrectly answered
    else {
      $("#"+ this.name + "FloatText").text("Attack failed!");
      $("#"+ this.name + "FloatText").fadeIn().delay(600).fadeOut();
      console.log(this.name + " had an attack fail on them");
    }

    // After each attack check if ships have correct sprites
    // Also includes checking for death
    if(this.name == "player") {
      if (this.health < 1) {
        this.health = 0;
        $("#playerShipSprite").attr("src", "img/explosion.gif")
        $("#playerHealth").text(this.health);
        $("#resultPopup").css("display", "block");
        $("#resultText").text("BATTLE LOST!").css("color", "#E86253");
        $("#playerHealthText").css("display", "none");
      }
      else if (this.health < 1000) {
        $("#playerShipSprite").attr("src", "img/ship_d2.png")
      }
      else if (this.health < 2400) {
        $("#playerShipSprite").attr("src", "img/ship_d1.png")
      }
      else { //Sprite resets if they heal up back above the treshold
        $("#playerShipSprite").attr("src", "img/ship.png")
      }
    }
    else if (this.name == "enemy") {
      if (this.health < 1) {
        this.health = 0;
        this.health = 0;
        $("#enemyShipSprite").attr("src", "img/explosion.gif")
        $("#enemyHealth").text(this.health);
        $("#resultPopup").css("display", "block");
        $("#resultText").text("BATTLE WON!");
        $("#enemyHealthText").css("display", "none");
      }
      else if (this.health < 1750) {
        $("#enemyShipSprite").attr("src", "img/enemy2_d.png")
      }
      else {
        $("#enemyShipSprite").attr("src", "img/enemy2.png")
      }
    }
  }
}

// A new instance of ship for player and AI
var playerShip = new Ship("player", 3500);
var enemyShip = new Ship("enemy", 3500);

function getRandomInt(min, max) {
  min = Math.ceil(min); //Minimum - inclusive
  max = Math.floor(max + 1); //Maximum - exclusive,
  return Math.floor(Math.random() * (max - min)) + min;
}

var num1 = 0;
var num2 = 0;
var cando = true;
var toRun = false;

function generateNums() {
  num1 = getRandomInt(1, 12);
  num2 = getRandomInt(1, 12);
  $("#num1").text(num1);
  $("#num2").text(num2);
}

function checkAnswer () {
  var answer = $("#answer").val();
  if(answer == num1*num2) {
    return true;
  }
  else {
    return false;
  }
}

//Randomly chooses an attack for enemy to do
function EnemyTurn() {
  setTimeout(function() {
    var actionChoice = Math.random();

    if (actionChoice <= 0.40) {
      var success = Math.random();
      if (0.90 > success) {
        playerShip.attack(LightAttack);
      }
      else {
        $("#playerFloatText").text("Dodged!").fadeIn().delay(600).fadeOut();
      }
    }
    else if (actionChoice > 0.40 && actionChoice <= 0.70) {
      var success = Math.random();
      if (0.60 > success) {
        playerShip.attack(HeavyAttack);
      }
      else {
        $("#playerFloatText").text("Dodged!").fadeIn().delay(600).fadeOut();
      }
    }
    else {
      enemyShip.attack(Repair);
    }

    $(".action").css("background", "red");
    cando = true;
    }, 1000);
}


//woo all the interaction stuff
$(document).ready(function(){

  //Resetting values once battle complete
  $("#resultButton, #retreatButton").click(function() {
    playerShip.health = 3500;
    enemyShip.health = 3500;
    $("#enemyHealth").text(enemyShip.health);
    $("#playerHealth").text(playerShip.health);
    $("#popup").css("display", "none");
    $("#resultPopup").css("display", "none");
    $("#enemyShipSprite").attr("src", "img/enemy2.png");
    $("#playerShipSprite").attr("src", "img/ship.png");
    $("#startScreen").css("display", "grid");
    $("#playerHealthText").css("display", "inherit");
    $("#enemyHealthText").css("display", "inherit");
  });

  $("#answer").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
             // Allow: Ctrl/cmd+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: Ctrl/cmd+C
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: Ctrl/cmd+X
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });



  //Setting initial values
  $("#enemyHealth").text(enemyShip.health);
  $("#playerHealth").text(playerShip.health);
  $("#playerFloatText").hide();
  $("#enemyFloatText").hide();

  //Mute buttton
  $("#muteButton").click(function() {
    if ($("#bgMusic").get(0).paused == false) {
      $("#bgMusic").get(0).pause();
      $("#muteIcon").attr("src", "https://png.icons8.com/small/64/2FA6CF/no-audio.png");
    }
    else {
      $("#bgMusic").get(0).play();
      $("#muteIcon").attr("src", "https://png.icons8.com/small/64/2FA6CF/speaker.png");
    }
  });

  //Hovering over the actions
  $("#action1").mouseenter(function(){
    $("#tooltip1").css("visibility", "visible");
  });
  $("#action1").mouseleave(function(){
    $("#tooltip1").css("visibility", "hidden");
  });

  $("#action2").mouseenter(function(){
    $("#tooltip2").css("visibility", "visible");
  });
  $("#action2").mouseleave(function(){
    $("#tooltip2").css("visibility", "hidden");
  });

  $("#action3").mouseenter(function(){
    $("#tooltip3").css("visibility", "visible");
  });
  $("#action3").mouseleave(function(){
    $("#tooltip3").css("visibility", "hidden");
  });

  //Generates nums on clicked
  $("#action1").click(function(){
    if(cando) {
      generateNums();
      $("#popup").css("display", "block"); //displays popup
      toRun = 1; //attak select
      cando = false; //disables attacks while answering
    }
  });

  $("#action2").click(function(){
    if(cando) {
      generateNums();
      $("#popup").css("display", "block");
      toRun = 2;
      cando = false;
    }
  });

  $("#action3").click(function(){
    if(cando) {
      generateNums();
      $("#popup").css("display", "block");
      toRun = 3;
      cando = false;
    }
  });

  $(".action").click(function(){
    $("#answer").focus();
  })

  //first checks if answer is correct, if yes, runs appropriate attack
  $("#check").click(function(){
    $("#popup").css("display", "none");

    if (checkAnswer()) {
      if (toRun == 1) {
        enemyShip.attack(LightAttack);
      }
      else if (toRun == 2) {
        enemyShip.attack(HeavyAttack);
      }
      else if (toRun == 3) { //WHATS THE PURPOSE OF THIS?
        playerShip.attack(Repair);
      }
    }
    else {
      $("#enemyFloatText").text("Attack Failed!").fadeIn().delay(500).fadeOut();
    }
    $("#answer").val(""); // resets answer
    EnemyTurn();
  });


  //Allows the use of Enter instead of clicking "answer"
  $(document).keypress(function(e) {
    var select = "#answer"
    if(e.which == 13 && $(select).is(":focus") && $(select).val() != "" && !isNaN($(select).val())) {
      $("#check").click();
    }
  });

  //Hides start screen
  $("#startButton").click(function() {
    $("#startScreen").css("display", "none");
  });
});
