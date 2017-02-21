uniform sampler2D tDiffuse;
uniform vec2 offset3x3[9];
uniform vec2 offset5x5[25];
uniform vec2 offset7x7[49];
uniform vec3 param;

varying vec2 texCoords;

void main() {
  vec4 texel = texture2D(tDiffuse, texCoords);

  gl_FragColor.a = texel.a;
  gl_FragColor.rgb =  (texel.rgb + param.x) * param.y;
}
