attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aVertexTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1);
    vColor = vec4(aVertexColor, 1.0);
    vTextureCoord = aVertexTextureCoord;
}