document.addEventListener('DOMContentLoaded', function() {
  var WIDTH = 800;
  var HEIGHT = 600;
  var TEXTURE_PATH = 'textures';
  var TEXTURES = ['calculator32b.jpg'];
  var SHADER_PATH = 'shaders';
  var FRAGMENT_SHADER_FILES = [
    'passthrough.gl',

    // 'brightness_contrast.gl',
    // 'moving_average.gl',
    'gauss3x3.gl',
    'gauss5x5.gl',
    'gauss7x7.gl',
    'gauss7x7_vertical.gl',
    'gauss7x7_horizontal.gl',
    'dilatation.gl',
    'erosion.gl',
    'sharpen.gl',
    'laplace.gl',
    'sobel.gl'
  ];

  VERTEX_SHADER = [
    'varying vec2 texCoords;',
    'void main() {',
    'texCoords = uv;',
    'gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);',
    '}'
  ].join('\n');

  var gui = new dat.GUI();
  var stats = new Stats();

  var container = document.body;
  var renderer = new THREE.WebGLRenderer();
  var composer = new THREE.EffectComposer(renderer);

  var camera = new THREE.OrthographicCamera(WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 100);
  var scene = new THREE.Scene();
  var mesh = null;
  var shaders = {};
  var shaderPasses = [];

  var guiModel = {
    shader1: null,
    shader2: null,
    shader3: null,
    param: new THREE.Vector3(1.0, 1.0, 0.0),
    shaders: ['none'],
    textures: TEXTURES,
    numberOfPasses: 1
  };

  function setupScene(textureId) {
    scene.remove(mesh);
    var texture = THREE.ImageUtils.loadTexture(TEXTURE_PATH + '/' + textureId, {}, function() {
      var plane = new THREE.PlaneGeometry(WIDTH, HEIGHT);
      var shaderMaterial = new THREE.MeshBasicMaterial({
        map: texture
      });

      mesh = new THREE.Mesh(plane, shaderMaterial);
      scene.add(camera);
      scene.add(mesh);
    });

  }

  function refreshShaderPasses() {
    var i;
    var j;
    var shaderPass;

    composer.passes.splice(0, composer.passes.length);
    shaderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(shaderPass);

    for (i = 0; i < shaderPasses.length; i++) {
      if (!shaderPasses[i]) {
        continue;
      }

      for (j = 0; j < guiModel.numberOfPasses; j++) {
        shaderPass = new THREE.ShaderPass(shaderPasses[i]);
        composer.addPass(shaderPass);
      }
    }

    shaderPass.renderToScreen = true;
  }

  function initGui() {

    gui.add(guiModel, 'shader1', guiModel.shaders).onChange(function(shaderName) {
      shaderPasses[0] = shaders[shaderName];
      refreshShaderPasses();
    });

    gui.add(guiModel, 'shader2', guiModel.shaders).onChange(function(shaderName) {
      shaderPasses[1] = shaders[shaderName];
      refreshShaderPasses();
    });

    gui.add(guiModel, 'shader3', guiModel.shaders).onChange(function(shaderName) {
      shaderPasses[2] = shaders[shaderName];
      refreshShaderPasses();
    });

    gui.add(guiModel, 'textures', guiModel.textures).onChange(function(textureId) {
      setupScene(textureId);
    });

    gui.add(guiModel, 'numberOfPasses', 1, 5).step(1).onChange(refreshShaderPasses);
    gui.add(guiModel.param, 'x', -5, 5).onChange(refreshShaderPasses);
    gui.add(guiModel.param, 'y', -5, 5).onChange(refreshShaderPasses);
    gui.add(guiModel.param, 'z', 0, 10).step(1).onChange(refreshShaderPasses);

    //bugfix
    //Array.prototype.forEach.call(gui.domElement.querySelectorAll('select'), function().css('width', '100%');

    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    container.appendChild(stats.domElement);
  }

  function loadShaders(callback) {
    var requests = [];
    var count = FRAGMENT_SHADER_FILES.length;
    var i;

    function onLoad(key, index) {
      return function(event) {
        var data = event.srcElement.textContent;
        guiModel.shaders.push(key);
        shaders[key] = createTHREEShader(VERTEX_SHADER, data);
        --count === 0 && typeof callback === 'function' && callback(shaders);
      };
    }

    for (i = 0; i < FRAGMENT_SHADER_FILES.length; i++) {
      var request = new XMLHttpRequest();
      request.open('GET', SHADER_PATH + '/' + FRAGMENT_SHADER_FILES[i])
      request.send();
      request.addEventListener("load", onLoad(FRAGMENT_SHADER_FILES[i], i));
    }
  }

  function calcTextureOffsets(width, height, size) {
    var deltaX = 1.0 / width;
    var deltaY = 1.0 / height;
    var distance = Math.floor(size / 2);
    var offsets = [];
    var i;
    var j;

    for (i = -distance; i <= distance; i++) {
      for (j = -distance; j <= distance; j++) {
        offsets.push(new THREE.Vector2(i * deltaX, j * deltaY));
      }
    }

    return offsets;
  }

  function createTHREEShader(vertex, fragment) {
    return {
      vertexShader: vertex,

      fragmentShader: fragment,

      uniforms: {

        tDiffuse: {
          type: 't',
          value: null
        },
        offset3x3: {
          type: 'v2v',
          value: calcTextureOffsets(WIDTH, HEIGHT, 3)
        },
        offset5x5: {
          type: 'v2v',
          value: calcTextureOffsets(WIDTH, HEIGHT, 5)
        },
        offset7x7: {
          type: 'v2v',
          value: calcTextureOffsets(WIDTH, HEIGHT, 7)
        },
        param: {
          type: 'v3',
          value: guiModel.param
        }
      }
    };
  }

  function render() {
    stats.begin();
    composer.render();
    stats.end();
    requestAnimationFrame(render);
  }

  camera.position.z = 10;
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);

  setupScene(TEXTURES[0]);
  loadShaders(initGui);
  refreshShaderPasses();
  render();
});
