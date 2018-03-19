attribute vec3 aVertexPosition;
attribute vec3 aColor;
uniform mat4 uProjectionMat;
uniform mat4 uModelMat;
varying vec3 vColor;

void main() {
    vec4 pos = uProjectionMat * uModelMat * vec4(aVertexPosition,1);
    vColor = aColor;
    gl_Position = vec4(pos.xyz/pos[3], 1);
}