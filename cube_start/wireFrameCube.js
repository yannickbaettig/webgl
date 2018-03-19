/* *
    2 *
    3 * Define a wire frame cube with methods for drawing it .
    4 *
    5 * @param gl the webgl context
    6 * @param color the color of the cube
    7 * @returns object with draw method
    8 * @constructor
    9 */
    function WireFrameCube ( gl , color ) {

        function defineColor ( gl ) {
            // define the vertices of the cube
            var colors = [
                //Unten
                1, 0, 0, //V0 0
                1, 0, 0, //V1 1
                1, 0, 0, //V2 2
                1, 0, 0, //V3 3

                //Vorne
                0, 1, 0, //V0 4
                0, 1, 0, //V1 5
                0, 1, 0, //V5 6
                0, 1, 0, //V4 7

                //Rechts
                0, 0, 1, //V1 8
                0, 0, 1, //V2 9
                0, 0, 1, //V6 10
                0, 0, 1, //V5 11

                //Hinten
                1, 1, 0, //V2 12
                1, 1, 0, //V3 13
                1, 1, 0, //V7 14
                1, 1, 0, //V6 15

                //Links
                0, 1, 1, //V3 16
                0, 1, 1, //V0 17
                0, 1, 1, //V4 18
                0, 1, 1, //V7 19

                //Oben
                1, 0, 1, //V4 20
                1, 0, 1, //V5 21
                1, 0, 1, //V5 22
                1, 0, 1 //V4 23
            ];
            var buffer = gl.createBuffer () ;
            gl.bindBuffer ( gl . ARRAY_BUFFER , buffer ) ;
            gl.bufferData ( gl . ARRAY_BUFFER , new Float32Array ( colors ) , gl.STATIC_DRAW ) ;
            return buffer ;

        }

        function defineVertices ( gl ) {
            // define the vertices of the cube
            var vertices = [
                //Unten
                0, 0, 0, //V0 0
                1, 0, 0, //V1 1
                1, 0, 1, //V2 2
                0, 0, 1, //V3 3

                //Vorne
                0, 0, 0, //V0 4
                1, 0, 0, //V1 5
                1, 1, 0, //V5 6
                0, 1, 0, //V4 7

                //Rechts
                1, 0, 0, //V1 8
                1, 0, 1, //V2 9
                1, 1, 1, //V6 10
                1, 1, 0, //V5 11

                //Hinten
                1, 0, 1, //V2 12
                0, 0, 1, //V3 13
                0, 1, 1, //V7 14
                1, 1, 1, //V6 15

                //Links
                0, 0, 1, //V3 16
                0, 0, 0, //V0 17
                0, 1, 0, //V4 18
                0, 1, 1, //V7 19

                //Oben
                0, 1, 0, //V4 20
                1, 1, 0, //V5 21
                1, 1, 1, //V6 22
                0, 1, 1, //V7 23
            ];

            var buffer = gl.createBuffer () ;
            gl.bindBuffer ( gl . ARRAY_BUFFER , buffer ) ;
            gl.bufferData ( gl . ARRAY_BUFFER , new Float32Array ( vertices ) , gl.STATIC_DRAW ) ;
            return buffer ;

        }

        function defineEdges ( gl ) {
            // define the edges for the cube , there are 12 edges in a cube
            var vertexIndices  = [
                0,1,2,
                2,3,0,

                4,5,6,
                6,7,4,

                8,9,10,
                10,11,8,

                12,13,14,
                14,15,12,

                16,17,18,
                18,19,16,

                20,21,22,
                22,23,20
            ];
            var buffer = gl.createBuffer () ;
            gl.bindBuffer ( gl . ELEMENT_ARRAY_BUFFER , buffer ) ;
            gl.bufferData ( gl . ELEMENT_ARRAY_BUFFER , new Uint16Array (vertexIndices) , gl.STATIC_DRAW ) ;
            return buffer ;
        }

        return {
            bufferVertices : defineVertices ( gl ) ,
            bufferEdges : defineEdges ( gl ) ,
            bufferColors: defineColor(gl),
            color : color,

            draw : function ( gl ,aVertexPositionId , aColorId ) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
                gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aVertexPositionId);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
                gl.vertexAttribPointer(aColorId, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aColorId);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);

                //gl.uniform4f(uColorId, 1, 1, 1, 1);
                gl.drawElements(gl.TRIANGLES , 36, gl.UNSIGNED_SHORT,0);
            }
         }
}