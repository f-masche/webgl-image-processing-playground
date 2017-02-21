uniform sampler2D tDiffuse;

varying vec2 texCoords;

void main() {
  gl_FragColor = texture2D(tDiffuse, texCoords);
}
