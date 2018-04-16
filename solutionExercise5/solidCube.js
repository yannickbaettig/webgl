/**
 * Created by toko on 13.05.17.
 */

/**
 *
 * Define a solid cube with methods for drawing it.
 *
 * @param gl
 * @param backColor
 * @param frontColor
 * @param rightColor
 * @param leftColor
 * @param topColor
 * @param bottomColor
 * @returns object with draw method
 * @constructor
 */
function SolidCube(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
    function defineVertices(gl) {
        // define the vertices of the cube
        var vertices = [
                                    // back
            -0.5, -0.5, -0.5,       // v0
             0.5, -0.5, -0.5,       // v1
             0.5,  0.5, -0.5,       // v2
            -0.5,  0.5, -0.5,       // v3
                                    // front
            -0.5, -0.5, 0.5,        // v4
             0.5, -0.5, 0.5,        // v5
             0.5,  0.5, 0.5,        // v6
            -0.5,  0.5, 0.5,        // v7
                                    // right
             0.5, -0.5, -0.5,       // v8 = v1
             0.5,  0.5, -0.5,       // v9 = v2
             0.5,  0.5,  0.5,       // v10 = v6
             0.5, -0.5,  0.5,       // v11 = v5
                                    // left
            -0.5, -0.5, -0.5,       // v12 = v0
            -0.5,  0.5, -0.5,       // v13 = v3
            -0.5,  0.5,  0.5,       // v14 = v7
            -0.5, -0.5,  0.5,       // v15 = v4
                                    // top
            -0.5, 0.5, -0.5,        // v16 = v3
            -0.5, 0.5,  0.5,        // v17 = v7
             0.5, 0.5,  0.5,        // v18 = v6
             0.5, 0.5, -0.5,        // v19 = v2
                                    //bottom
            -0.5, -0.5, -0.5,       // v20 = v0
            -0.5, -0.5, 0.5,        // v21 = v4
             0.5, -0.5, 0.5,        // v22 = v5
             0.5, -0.5, -0.5        // v23 = v1
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineSides(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            0,2,1, // face 0 (back)
            2,0,3,
            4,5,6, // face 1 (front)
            4,6,7,
            8,9,10, // face 2 (right)
            10,11,8,
            12,15,14, // face 3 (left)
            14,13,12,
            16,17,18, // face 4 (top)
            18,19,16,
            20,23,22, // face 5 (bottom)
            22,21,20
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);

        return buffer;
    }

    function defineColors(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor) {
        // make 4 entries, one for each vertex
        var backSide = backColor.concat(backColor, backColor, backColor);
        var frontSide = frontColor.concat(frontColor, frontColor, frontColor);
        var rightSide = rightColor.concat(rightColor, rightColor, rightColor);
        var leftSide = leftColor.concat(leftColor, leftColor, leftColor);
        var topSide = topColor.concat(topColor, topColor, topColor);
        var bottomSide = bottomColor.concat(bottomColor, bottomColor, bottomColor);

        var allSides = backSide.concat(frontSide, rightSide, leftSide, topSide, bottomSide);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSides), gl.STATIC_DRAW);
        return buffer;
    }

    function defineTextureCoord(gl) {
        var textureCoords = [
            0.0,  0.0,              // back
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        return buffer;
    }


    return {
        bufferVertices: defineVertices(gl),
        bufferSides: defineSides(gl),
        bufferColors: defineColors(gl, backColor, frontColor, rightColor, leftColor, topColor, bottomColor),
        bufferTextureCoords: defineTextureCoord(gl),

        draw: function(gl, aVertexPositionId, aVertexColorId, aVertexTextureCoordId) {
            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            // color buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);

            // texture coordinates
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferTextureCoords);
            gl.vertexAttribPointer(aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexTextureCoordId);

            // bind the element array
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferSides);
            gl.drawElements(gl.TRIANGLES, 36 ,gl.UNSIGNED_SHORT, 0);
        }
    }
}



