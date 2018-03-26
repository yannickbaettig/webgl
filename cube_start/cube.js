//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatrixId: -1,
    uModelViewMatrixId: -1,
    aVertexColorId: -1
};

// we keep all the parameters for drawing a specific object together
var wireFrameObject = {
    vertexBuffer: -1,
    edgeBuffer: -1
};

var wiredCube;
var rotationY = 0;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

/*    gl . frontFace ( gl . CCW ) ; // defines how the front face is drawn
    gl . cullFace ( gl . BACK ) ; // defines which face should be culled
    gl . enable ( gl . CULL_FACE ) ; // enables culling
     */
    gl.enable ( gl . DEPTH_TEST ) ;
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aColor");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    wiredCube = new WireFrameCube ( gl , [1.0 , 1.0 , 1.0 , 0.5]) ;

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT | gl . DEPTH_BUFFER_BIT);

    var modelView = mat4.create();
    mat4.lookAt(modelView, [0,2,3], [0.5,0.5,0.5],[0,1,0]);
    mat4.rotateY(modelView,modelView, rotationY);
    mat4.translate(modelView, modelView, [-0.5,-0.5,-0.5]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelView );

    var projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix,1.745, gl.drawingBufferWidth / gl.drawingBufferHeight ,1,20);
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

    wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);

    rotationY += 0.01;

    requestAnimationFrame(draw);
}

