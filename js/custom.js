$(document).ready(function () {

  let game = {
    ballIndex: 0,
    squereLeft: 0,
    ballSpeed: 5,
    deletedBallsCount: 0,
    balls: {},
    size: {
      squereHeight: $(".squere").height(),
      squereWidth: $(".squere").width(),
      basketHeight: $(".basket").height(),
      basketWidth: $(".basket").width()
    },
    result: {
      got: 0,
      lost: 0
    }
  }

  let functions = {
    
    ballInterval: null,
    generateBallInterval: null,
    

    generateBall: function () {
      game.ballIndex++;
      let ball_id = `id${game.ballIndex}`;
      game.balls[ball_id] = $(`<div id="id${game.ballIndex}" class="ball"><img class="ball_pic" src="./images/ball.png" alt="ball"></div>`);
      $('.squere').append(game.balls[ball_id]);
      let ballWidth = $(".ball").width();
      let ballRendomLeft = Math.floor(Math.random() * (game.size.squereWidth - ballWidth));
      $(game.balls[ball_id]).css({ left: ballRendomLeft });
    },

    /*------move element------*/
    move: function () {
      if (Object.entries(game.balls)) {

        for (const [key, value] of Object.entries(game.balls)) {

          let ballTop = $(game.balls[key]).position().top;
          let ballHeight = $(game.balls[key]).height();
          let ballsCount = Object.keys(game.balls).length;

          $("div.count_elements").html("All balls are: " + ballsCount);

          let ballLeftPosition = $(game.balls[key]).position().left;
          let ballWidth_2 = $(game.balls[key]).width();

          if (ballTop + ballHeight >= game.size.squereHeight - game.size.basketHeight) {
            if (ballLeftPosition + ballWidth_2 >= game.squereLeft && ballLeftPosition <= game.squereLeft + game.size.basketWidth) {
              game.result.got++;
              $(game.balls[key]).remove();
              $(".got_elements").html(game.result.got);
              delete game.balls[key];
            }
          }
          if (ballTop + ballHeight >= game.size.squereHeight) {
            game.deletedBallsCount++;
            $(game.balls[key]).remove();
            delete game.balls[key];
            game.result.lost++;

            $('.deleted_elements').html(" Count of deleted balls: " + game.deletedBallsCount);
            $('.lost_elements').html("Count of lost balls: " + game.result.lost);

            $(".lost_balls li").each(function (i) {
              if (i < game.result.lost) {
                $(this).children().remove();
              }
              i++;
            });

            delete game.balls[key];
            if (game.result.lost == 5) {
              let popup = $(".popup");
              let span = $(".close")[0];
              $(".popup").css("display", "flex");

               clearInterval(functions.generateBallInterval);
               clearInterval(functions.ballInterval);
             
              $(".squere").empty();
             

              $(span).click(function () {
                $("#play").prop('disabled', false);
                $(".popup").css("display", "none");
                $("#play").text("Replay");
                $("#play").css('background-color', '#ffffff');

                if ($("#play").text("Replay")) {

                  $("#play").click(function () {
                    game.balls = {};
                    game.result = {
                      got: 0,
                      lost: 0
                    }
                    $("div.count_elements").html("All balls are: 0");
                    $('.lost_elements').html("Count of lost balls: 0");
                    $(".got_elements").html("0");
                    functions.playPause();
                    $('.squere').append(`<div class="basket_block"><img src="images/basket-white.png" alt="basket" class="basket"></div>`);
                    $(".lost_balls li").append(`<img src="images/ball.png" alt="ball">`);

                    $("#play").text("Play");
                    $("#play").css('background-color', '#d78f3e');

                  });

                }
              });

              $(window).click(function (e) {
                if (e.target == popup) {
                  $(".popup").css("display", "none");
                }
              });
            };

          } else {
            ballTop++;
            $(game.balls[key]).css({ top: ballTop + game.ballSpeed });
          }
        }
      };
      functions.mouseMoving();
      functions.checkResult();
      functions.playPause();
    },

    checkResult: function () {
      if (game.result.got === 10) {
        game.ballSpeed = 7;
      } else if (game.result.got === 20) {
        game.ballSpeed = 14;
      } else if (game.result.got === 30) {
        game.ballSpeed = 25;
      } else if (game.result.got === 50) {
        $("#particle-canvas").css("display", "block");
        $(".popup_gameOver").css("display", "flex");
        $(".close").click(function () {
          $("#play").prop('disabled', false);
          $(".popup_gameOver").css("display", "none");
          $("#particle-canvas").css("display", "none");
          $("#play").text("Replay");
          $("#play").css('background-color', '#ffffff');
        });
        
      }
    },

    mouseMoving: function () {

      $("body").on({
        mousemove: function (e) {
          let parentOffset = $(".squere").parent().offset();

          let relX = game.squereLeft = e.pageX - parentOffset.left - game.size.basketWidth / 2;

          if (relX >= game.size.squereWidth - game.size.basketWidth) {
            game.squereLeft = game.size.squereWidth - game.size.basketWidth;
          } else if (relX <= 0) {
            game.squereLeft = 0;
          } else {
            game.squereLeft = relX;
          };
          $('.basket').css({ left: game.squereLeft });
        }
      });
    },

    playPause: function () {
      

      $("#play").click(function () {
        $("#play").prop('disabled', true);
        clearInterval(functions.generateBallInterval);
        clearInterval(functions.ballInterval);
        functions.generateBallInterval = setInterval(functions.generateBall, 1000);
        functions.ballInterval = setInterval(functions.move, 10);
      });
      $("#pause").click(function () {
        $("#play").prop('disabled', false);
        clearInterval(functions.generateBallInterval);
        clearInterval(functions.ballInterval);
      });
    },
   
  }
  functions.playPause();


});