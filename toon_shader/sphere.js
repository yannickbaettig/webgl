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
    aVertexColorId: -1,
    aVertexNormalId: -1,
    uColorId: -1,
    uEnableTextureId: -1,
    uEnableLightingId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
    uProjectionMatrixId: -1,
    uModelViewMatrixId: -1,
    uNormalMatrixId: -1
};


var wiredCube;
var rotationY = 0;
var sphere;

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
    gl.uniform1i(ctx.uEnableLightingId,1);
    gl.uniform1i(ctx.uEnableTextureId,0);
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
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");

}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    wiredCube = new Cube( gl , [1.0 , 1.0 , 1.0 , 0.5]) ;
    sphere = new SolidSphere (gl , 30,30);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.uniform3fv(ctx.uLightPositionId, [0, 3, 0]);
    gl.uniform3fv(ctx.uLightColorId, [1.0,1.0,1.0]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl . DEPTH_BUFFER_BIT);

    var modelViewMatrix = mat4.create();
    var normalMatrix = mat3.create();
    var projectionMatrix = mat4.create();

    mat4.lookAt(modelViewMatrix, [0, 2, -4], [0,0,0], [0,1,0]);

    mat4.perspective(projectionMatrix, 1.745, gl.drawingBufferWidth / gl.drawingBufferHeight , 1, 20);
    gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, 0]);
    mat4.rotateY(modelViewMatrix,modelViewMatrix, rotationY);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix );
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);

    mat4.translate(modelViewMatrix, modelViewMatrix, [-1, 0, 0]);
    mat4.rotateY(modelViewMatrix,modelViewMatrix, rotationY);

    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix );
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    sphere.drawWithColor(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId, [1,0,0]);

    rotationY += 0.01;

    requestAnimationFrame(draw);
}

