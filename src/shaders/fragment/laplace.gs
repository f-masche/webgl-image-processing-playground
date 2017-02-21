uniform sampler2D tDiffuse;
uniform vec2 offset3x3[9];
uniform vec2 offset5x5[25];
uniform vec2 offset7x7[49];

varying vec2 texCoords;

void main() {
  float laplace3x3[9];
  laplace3x3[0] = 0.0; laplace3x3[1] = 1.0; laplace3x3[2] = 0.0;
  laplace3x3[3] = 1.0; laplace3x3[4] = -4.0; laplace3x3[5] = 1.0;
  laplace3x3[6] = 0.0; laplace3x3[7] = 1.0; laplace3x3[8] = 0.0;

  vec4 texel = vec4(0.0, 0.0, 0.0, 1.0);

  for (int i = 0; i < 9; i++)
  {
    vec4 otherTexel = texture2D(tDiffuse, texCoords + offset3x3[i]);
    float average = (otherTexel.x + otherTexel.y + otherTexel.z) / 3.0;
    texel += vec4(average, average, average, 1.0)  * laplace3x3[i];
  }

  gl_FragColor = texel/2.0 + 0.5;
}
