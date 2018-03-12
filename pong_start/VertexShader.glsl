attribute vec2 aVertexPosition;
uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    vec3 pos3 = uProjectionMat * uModelMat * vec3(aVertexPosition,1);
    gl_Position = vec4(pos3.xy/pos3[2],0, 1);
}