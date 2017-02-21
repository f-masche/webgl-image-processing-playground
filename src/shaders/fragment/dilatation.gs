uniform sampler2D tDiffuse;
uniform vec2 offset3x3[9];
uniform vec2 offset5x5[25];
uniform vec2 offset7x7[49];
uniform vec3 param;

varying vec2 texCoords;

void main() {
  vec4 texel = vec4(0.0, 0.0, 0.0, 1.0);

  if(param.z == 0.0){
    for (int i = 0; i < 9; i++){
      vec4 otherTexel = texture2D(tDiffuse, texCoords + offset3x3[i]);

      if(texel.x < otherTexel.x){
        texel.x = otherTexel.x;
      }
      if(texel.y < otherTexel.y){
        texel.y = otherTexel.y;
      }
      if(texel.z < otherTexel.z){
        texel.z = otherTexel.z;
      }
    }
  }

  if(param.z == 1.0){
    for (int i = 0; i < 25; i++){
      vec4 otherTexel = texture2D(tDiffuse, texCoords + offset5x5[i]);

      if(texel.x < otherTexel.x){
          texel.x = otherTexel.x;
      }
      if(texel.y < otherTexel.y){
          texel.y = otherTexel.y;
      }
      if(texel.z < otherTexel.z){
          texel.z = otherTexel.z;
      }
    }
  }

  if(param.z == 2.0){
    for (int i = 0; i < 49; i++){
      vec4 otherTexel = texture2D(tDiffuse, texCoords + offset7x7[i]);

      if(texel.x < otherTexel.x){
        texel.x = otherTexel.x;
      }
      if(texel.y < otherTexel.y){
        texel.y = otherTexel.y;
      }
      if(texel.z < otherTexel.z){
        texel.z = otherTexel.z;
      }
    }
  }

  gl_FragColor = texel;
}
