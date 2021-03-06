uniform sampler2D tDiffuse;
uniform vec2 offset3x3[9];
uniform vec2 offset5x5[25];
uniform vec2 offset7x7[49];

varying vec2 texCoords;

void main() {
  highp float gauss3x3[9];
  gauss3x3[0] = 1.0; gauss3x3[1] = 2.0; gauss3x3[2] = 1.0;
  gauss3x3[3] = 2.0; gauss3x3[4] = 4.0; gauss3x3[5] = 2.0;
  gauss3x3[6] = 1.0; gauss3x3[7] = 2.0; gauss3x3[8] = 1.0;

  vec4 texel = vec4(0.0, 0.0, 0.0, 1.0);

  for (int i = 0; i < 9; i++)
  {
    texel += texture2D(tDiffuse, texCoords + offset3x3[i])  * gauss3x3[i];
  }

  gl_FragColor = texel/16.0;
}
