//
// DI Computer Graphics
//
// WebGL Exercises
//

// Turn Texture Mapping on and off
// Add Transformation
// Add 3D functionality

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexTextureCoordId: -1,
    uModelViewMatrixId: -1,
    uProjectionMatrixId: -1,
    uSamplerId: -1,
    uUseTextureId: -1
};

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObject0: {}
};

// parameters that define the scene
var scene = {
    eyePosition: [0, 2, -4],
    lookAtPosition: [0, 0, 0],
    upVector: [0, 1, 0],
    nearPlane: 0.1,
    farPlane: 30.0,
    fov: 40,
    rotateObjects: true,
    angle: 0,
    angularSpeed: 0.1 * 2 * Math.PI / 360.0
};

var drawingObjects = {
    wiredCube: null,
    solidCube: null
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    loadTexture();
    // Animation form is now requested after texture is loaded
    //window.requestAnimationFrame (drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    defineObjects();

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.8, 0.8, 0.8, 1);
}

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
    // create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);

    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    // turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.log("Texture initialised");
}

/**
 * Load an image as a texture
 */
function loadTexture() {
    var image = new Image();
    // create a texture object
    lennaTxt.textureObject0 = gl.createTexture();
    image.onload = function() {
        console.log("Image loaded");
        initTexture(image, lennaTxt.textureObject0);
        window.requestAnimationFrame (drawAnimated);
    };
    // setting the src will trigger onload
    image.src = "lena512.png";
}

function defineObjects() {
    drawingObjects.wiredCube = new WireFrameCube(gl, [0.0, 0.0, 0.0]);
    drawingObjects.solidCube = new SolidCube(gl,
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0],
        [0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0]);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uUseTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    console.log(ctx);
}


/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    var modelViewMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the matrices from the scene
    mat4.lookAt(viewMatrix, scene.eyePosition, scene.lookAtPosition, scene.upVector);

    mat4.perspective(projectionMatrix,
        glMatrix.toRadian(scene.fov),
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        scene.nearPlane, scene.farPlane);
    //mat4.ortho(projectionMatrix, -2.0, 2.0, -2.0, 2.0, scene.nearPlane, scene.farPlane);

    // it is same projection matrix for all drawings, so it can be set here
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

    // enable the texture mapping
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObject0);
    gl.uniform1i(ctx.uSamplerId, 0);

    // tell the fragment shader to use the texture
    //gl.uniform1i(ctx.uUseTextureId, 1);

    gl.uniform1i(ctx.uUseTextureId, 0);

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, 0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    drawingObjects.solidCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTextureCoordId);
    //drawingObjects.wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [-1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, 0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    gl.uniform1i(ctx.uUseTextureId, 1);
    drawingObjects.solidCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTextureCoordId);
    //drawingObjects.wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);
}

var first = true;
var lastTimeStamp = 0;
function drawAnimated ( timeStamp ) {
    var timeElapsed = 0;
    if (first) {
        lastTimeStamp = timeStamp;
        first = false;
    } else {
        timeElapsed = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
    }
    // calculate time since last call
    // move or change objects
    //console.log(timeElapsed);
    scene.angle += timeElapsed * scene.angularSpeed;
    if (scene.angle > 2.0*Math.PI) {
        scene.angle -= 2.0*Math.PI;
    }
    //console.log(scene.angle);
    draw ();
    // request the next frame
    window.requestAnimationFrame (drawAnimated);
}