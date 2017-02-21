uniform sampler2D tDiffuse;
uniform vec2 offset3x3[9];
uniform vec2 offset5x5[25];
uniform vec2 offset7x7[49];
uniform vec3 param;

varying vec2 texCoords;

void main() {
  vec4 texel = vec4(0.0);
  float filter[9];
  filter[0] = 0.0;    filter[1] = -1.0;   filter[2] = 0.0;
  filter[3] = -1.0;   filter[4] = 4.0;    filter[5] = -1.0;
  filter[6] = 0.0;    filter[7] = -1.0;   filter[8] = 0.0;

  for (int i = 0; i < 9; i++)
  {
    texel += texture2D(tDiffuse, texCoords + offset3x3[i]) * filter[i];
  }

  gl_FragColor = texture2D(tDiffuse, texCoords) + param.x * texel;
}
