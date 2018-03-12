attribute vec2 aVertexPosition;
attribute vec3 aColor;
attribute vec2 aVertexTextureCoord;
varying vec3 vColor;
varying vec2 vTextureCoord;

void main() {
    gl_Position = vec4(aVertexPosition,0,1);

    // varyings können dann vom FragmentShader verwendet werden
    vColor = aColor;
    vTextureCoord = aVertexTextureCoord;

}