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
    aVertexNormalId: -1,
    uModelViewMatrixId: -1,
    uProjectionMatrixId: -1,
    uNormalMatrixId: -1,
    uSamplerId: -1,
    uUseTextureId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
    uEnableLightingId: -1
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
    lightPosition: [0, 3, 0],
    lightColor: [1, 1, 1],
    rotateObjects: true,
    angle: 0,
    angularSpeed: 0.1 * 2 * Math.PI / 360.0
};

var drawingObjects = {
    wiredCube: null,
    solidCube: null,
    solidSphere: null,
    meshes: null
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
    loadMeshes();
    // Animation form is now requested after texture is loaded
    //window.requestAnimationFrame (drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    //ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShaderToon.glsl');

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

function loadMeshes(){
    OBJ.downloadMeshes({
        'suzanne': 'models/suzanne.obj', // located in the models folder on the server
        'elephant': 'models/elephant2.obj', // located in the models folder on the server
        //'sphere': 'models/sphere.obj'
    }, initMeshes);
}

function initMeshes(meshes){
    console.log("init meshes");
    drawingObjects.meshes = meshes;
    // initialize the VBOs
    OBJ.initMeshBuffers(gl, drawingObjects.meshes.suzanne);
    OBJ.initMeshBuffers(gl, drawingObjects.meshes.elephant);
    //OBJ.initMeshBuffers(gl, drawingObjects.meshes.sphere);

}

function drawMesh(mesh, aVertexPositionId, aVertexColorId, aVertexTextureCoordId,  aVertexNormalId, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
    gl.vertexAttribPointer(aVertexPositionId, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);

    gl.disableVertexAttribArray(aVertexColorId);
    gl.vertexAttrib3f(aVertexColorId, color[0], color[1], color[2]);


    if(!mesh.textures.length){
        gl.disableVertexAttribArray(aVertexTextureCoordId);
    }
    else{
        // if the texture vertexAttribArray has been previously
        // disabled, then it needs to be re-enabled
        gl.enableVertexAttribArray(aVertexTextureCoordId);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
        gl.vertexAttribPointer(aVertexTextureCoordId, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
    gl.vertexAttribPointer(aVertexNormalId, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexNormalId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

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
    drawingObjects.solidSphere = new SolidSphere(gl, 40, 40);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");

    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uProjectionMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uUseTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");

    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
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
    var normalMatrix = mat3.create();

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

    // set the light
    gl.uniform1i(ctx.uEnableLightingId, 0);
    gl.uniform3fv(ctx.uLightPositionId, scene.lightPosition);
    gl.uniform3fv(ctx.uLightColorId, scene.lightColor);

    // tell the fragment shader to use the texture
    //gl.uniform1i(ctx.uUseTextureId, 1);

    gl.uniform1i(ctx.uUseTextureId, 0);

    // translate and rotate objects
    mat4.translate(modelViewMatrix, viewMatrix, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, 0]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    gl.uniform1i(ctx.uEnableLightingId, 1);
    drawingObjects.solidCube.draw(gl,
        ctx.aVertexPositionId,
        ctx.aVertexColorId,
        ctx.aVertexTextureCoordId,
        ctx.aVertexNormalId);


    // translate and rotate objects
    // mat4.translate(modelViewMatrix, viewMatrix, [-1, 0, 0]);
    // mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, 0]);
    // gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    // mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    // gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
    //
    // gl.uniform1i(ctx.uEnableLightingId, 1);
    //
    // gl.uniform1i(ctx.uUseTextureId, 1);
    //
    // drawingObjects.solidCube.draw(gl,
    //     ctx.aVertexPositionId,
    //     ctx.aVertexColorId,
    //     ctx.aVertexTextureCoordId,
    //     ctx.aVertexNormalId);

    mat4.translate(modelViewMatrix, viewMatrix, [-1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);

    gl.uniform1i(ctx.uUseTextureId, 0);
    gl.uniform1i(ctx.uEnableLightingId, 1);

    drawingObjects.solidSphere.drawWithColor(gl,
        ctx.aVertexPositionId,
        ctx.aVertexColorId,
        ctx.aVertexNormalId,
        [0,0,1]);

    mat4.translate(modelViewMatrix, viewMatrix, [0, 0, -1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [0, 1, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.001, 0.001, 0.001]);
    gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
    mat3.normalFromMat4(normalMatrix, modelViewMatrix);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);

    gl.uniform1i(ctx.uUseTextureId, 0);
    gl.uniform1i(ctx.uEnableLightingId, 1);

    if (drawingObjects.meshes) {
        drawMesh(drawingObjects.meshes.elephant,
            ctx.aVertexPositionId, ctx.aVertexColorId,
            ctx.aVertexTextureCoordId, ctx.aVertexNormalId, [0.5, 0.5, 0.5])
    }
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