varying vec2 texCoords;

void main() {
  texCoords = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
