//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
//Uniforms und Attributes von den Shadern
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    aColorId: -1,
    aVertexTextureCoordId: -1,
    uSamplerId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer : -1,
    textureBuffer: -1
};
// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObj : {}
};

/* *
* Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture ( image , textureObject ) {
    // create a new texture
    gl.bindTexture ( gl.TEXTURE_2D , textureObject ) ;
    // set parameters for the texture
    gl.pixelStorei ( gl.UNPACK_FLIP_Y_WEBGL , true ) ;
    gl.texImage2D ( gl.TEXTURE_2D , 0 , gl.RGBA , gl.RGBA , gl.UNSIGNED_BYTE , image ) ;
   // gl.texParameteri ( gl.TEXTURE_2D , gl.TEXTURE_MAG_FILTER , gl.LINEAR ) ;
    //gl.texParameteri ( gl.TEXTURE_2D , gl.TEXTURE_MIN_FILTER , gl.LINEAR_MIPMAP_NEAREST ) ;
    gl.generateMipmap ( gl.TEXTURE_2D ) ;
    // turn texture off again
    gl.bindTexture ( gl.TEXTURE_2D , null ) ;
    }
/* *
* Load an image as a texture
 */
function loadTexture () {
    var image = new Image () ;
    // create a texture object
    lennaTxt.textureObj = gl.createTexture () ;
    image.onload = function () {
        initTexture ( image , lennaTxt.textureObj ) ;
        // make sure there is a redraw after the loading of the texture
        draw () ;
    };
    // setting the src will trigger onload
    image.src = "lena512.png" ;
    }

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    //draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    gl.clearColor(1,0,0,1);
    loadTexture();
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram,"aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.aColorId = gl.getAttribLocation(ctx.shaderProgram, "aColor");
    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    rectangleObject.textureBuffer = gl.createBuffer();
    var textureCord = [
        0,0,
        1,0,
        0,1,
        1,1
    ];


    var vertices = [ // erste 2 Werte sind die Koordinaten, die nächsten 3 Werte sind RGB
        0,0,1,0,0,
        1,0,0,1,0,
        0,1,0,0,1,
        1,1,1,1,0
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCord), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 20, 0); //es müssen 20 Bytes übersprungen werden um auf die Koordinaten des nächsten Punktes zu kommen
    gl.vertexAttribPointer(ctx.aColorId, 3, gl.FLOAT, false, 20, 8); // RGB beginnt nach 8 Bytes (ersten 2 Werte werden übersprungen)
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.enableVertexAttribArray(ctx.aColorId);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
    gl.uniform1i(ctx.uSamplerId, 0);

    //gl.uniform4f(ctx.uColorId,1.0,1.0,1.0,1);
    gl.drawArrays(gl.TRIANGLE_STRIP ,0,3); // Zeichnet ein Dreieck vom 1 Wert (geht bis zur 3 Stelle)
    //gl.uniform4f(ctx.uColorId,1.0,0.5,0.5,1);
    gl.drawArrays(gl.TRIANGLE_STRIP ,1,3);

    // add drawing routines here
}