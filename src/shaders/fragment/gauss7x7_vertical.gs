#define pi 3.14159265359

uniform sampler2D tDiffuse;
uniform vec2 offset3x3[9];
uniform vec2 offset5x5[25];
uniform vec2 offset7x7[49];
uniform vec3 param;

varying vec2 texCoords;

void main() {
    vec4 texel = vec4(0.0, 0.0, 0.0, 1.0);
    float gaussSum = 0.0;
    float sigma = max(param.x / 100.0, 0.0001);
    float gaussFirstPart = 1.0 / sqrt(2.0 * pi * sigma);
    float sigmaPart = (2.0 * sigma * sigma);

    for (int i = 28; i < 35; i++)
    {
        float gaussVal = gaussFirstPart * exp(-(offset7x7[i].x * offset7x7[i].x + offset7x7[i].y * offset7x7[i].y) / sigmaPart);
        gaussSum += gaussVal;
        texel += texture2D(tDiffuse, texCoords + offset7x7[i]) * gaussVal;
    }

    gl_FragColor = texel / gaussSum;
}
