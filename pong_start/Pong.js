//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

var game = {
    ball: {
        ballHeight: 10,
        ballWidth: 10,
        positionXBall: 0,
        positionYBall: 0,
        velocityXBall: 0.1,
        velocityYBall: 0.1

    },
    paddle: {
        paddleHeight: 50,
        paddleWidth: 10,
        positionXPaddleRight: 0,
        positionYPaddleRight: 0,
        positionXPaddleLeft: 0,
        positionYPaddleLeft: 0,
        velocityYPaddle: 0.3
    }
};
// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatrixId: -1,
    uModelViewMatrixId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0 / gl.drawingBufferWidth, 2.0 / gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatrixId, false, projectionMat);
    game.paddle.positionXPaddleLeft = -gl.drawingBufferWidth / 2 * 0.9;
    game.paddle.positionXPaddleRight = gl.drawingBufferWidth / 2 * 0.9;
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    //console.log("Drawing");

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    drawLine();
    drawBall(game.ball.positionXBall, game.ball.positionYBall);
    drawSquare(game.paddle.positionXPaddleLeft, game.paddle.positionYPaddleLeft);
    drawSquare(game.paddle.positionXPaddleRight, game.paddle.positionYPaddleRight);
}

//function degreesToRadians(degrees){
//    return degrees * (Math.PI / 180);
//}

var first = true;
var lastTimeStamp = 0;

function drawAnimated(timestamp) {
    if (first) {
        lastTimeStamp = timestamp;
        first = false;
    } else {
        var timeElapsed = timestamp - lastTimeStamp;
        lastTimeStamp = timestamp;
        moveBall(timeElapsed);
        moveUserPaddle(timeElapsed);
        moveComputerPaddle(timeElapsed);
    }
    draw();
    window.requestAnimationFrame(drawAnimated);
}


function moveBall(timeElapsed) {

    if (game.ball.positionYBall <= -gl.drawingBufferHeight / 2 + game.ball.ballHeight / 2 || game.ball.positionYBall >= gl.drawingBufferHeight / 2 - game.ball.ballHeight / 2){
        game.ball.velocityYBall = game.ball.velocityYBall * -1;
    }
    if (collisionWithPaddleRight() || collisionWithPaddleLeft()){
        game.ball.velocityXBall += 0.05;
        game.ball.velocityYBall += 0.05;
        game.ball.velocityXBall = game.ball.velocityXBall * -1;
    }
    if (game.ball.positionXBall < -gl.drawingBufferWidth / 2 - game.ball.ballWidth / 2 || game.ball.positionXBall > gl.drawingBufferWidth / 2 + game.ball.ballWidth / 2){
        game.ball.positionXBall = 0;
        game.ball.positionYBall = 0;
        game.ball.velocityXBall = 0.1;
        game.ball.velocityYBall = 0.1;
    }
    game.ball.positionXBall += game.ball.velocityXBall * timeElapsed;
    game.ball.positionYBall += game.ball.velocityYBall * timeElapsed;

}

function collisionWithPaddleRight() {
    //console.log("Ball Position " + game.ball.positionXBall + ", " + game.ball.positionYBall);
    //console.log("Paddle Position " + game.paddle.positionXPaddleRight + ", " + game.paddle.positionYPaddleRight);
    if(game.ball.positionYBall - game.ball.ballHeight / 2 <= game.paddle.positionYPaddleRight + game.paddle.paddleHeight / 2 && game.ball.positionYBall + game.ball.ballHeight / 2  >= game.paddle.positionYPaddleRight - game.paddle.paddleHeight / 2) {
        if (game.ball.positionXBall + game.ball.ballWidth / 2 >= game.paddle.positionXPaddleRight - game.paddle.paddleWidth / 2 && game.ball.positionXBall + game.ball.ballWidth / 2 <= game.paddle.positionXPaddleRight + game.paddle.paddleWidth /2){
            return true;
        }
    }
    return false;
}


function collisionWithPaddleLeft() {
    //console.log("Ball Position " + game.ball.positionXBall + ", " + game.ball.positionYBall);
    //console.log("Paddle Position " + game.paddle.positionXPaddleRight + ", " + game.paddle.positionYPaddleRight);
    if(game.ball.positionYBall - game.ball.ballHeight / 2 <= game.paddle.positionYPaddleLeft + game.paddle.paddleHeight / 2 && game.ball.positionYBall + game.ball.ballHeight / 2 >= game.paddle.positionYPaddleLeft - game.paddle.paddleHeight / 2) {
        if (game.ball.positionXBall - game.ball.ballWidth / 2 <= game.paddle.positionXPaddleLeft + game.paddle.paddleWidth / 2 && game.ball.positionXBall - game.ball.ballWidth / 2 >= game.paddle.positionXPaddleLeft - game.paddle.paddleWidth /2){
            return true;
        }
    }
    return false;
}

function moveUserPaddle(timeElapsed) {
    if (isDown(key.DOWN)){
        if (game.paddle.positionYPaddleRight > -gl.drawingBufferHeight / 2 + game.paddle.paddleHeight / 2) {
            game.paddle.positionYPaddleRight -= game.paddle.velocityYPaddle * timeElapsed;
        }
    }
    if (isDown(key.UP)){
        if (game.paddle.positionYPaddleRight < gl.drawingBufferHeight / 2 - game.paddle.paddleHeight  / 2){
            game.paddle.positionYPaddleRight += game.paddle.velocityYPaddle * timeElapsed;
        }
    }
}

function moveComputerPaddle(timeElapsed) {
    if  (game.paddle.positionYPaddleLeft + game.paddle.paddleHeight / 2 < game.ball.positionYBall) {
        game.paddle.positionYPaddleLeft += game.paddle.velocityYPaddle * timeElapsed;
    }
    if  (game.paddle.positionYPaddleLeft - game.paddle.paddleHeight / 2 > game.ball.positionYBall) {
        game.paddle.positionYPaddleLeft -= game.paddle.velocityYPaddle * timeElapsed;
    }
    
}

function drawSquare(positionX, positionY) {
    var modelMat = mat3.create();
    mat3.fromTranslation(modelMat, [positionX,positionY]);
    mat3.scale(modelMat,modelMat, [game.paddle.paddleWidth, game.paddle.paddleHeight]);
    gl.uniformMatrix3fv(ctx.uModelViewMatrixId, false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawBall(positionX, positionY) {
    var modelMat = mat3.create();
    mat3.fromTranslation(modelMat, [positionX,positionY]);
    mat3.scale(modelMat,modelMat, [10, 10]);
    gl.uniformMatrix3fv(ctx.uModelViewMatrixId, false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

}

function drawLine() {
    var modelMat = mat3.create();
    mat3.fromScaling(modelMat, [1, gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uModelViewMatrixId, false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
