import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import Stats from 'stats.js';
import dat from 'dat-gui';
import shaders from './shaders/fragment';
import vertexShaders from './shaders/vertex';
import textures from './textures';
import './styles/styles.less';

console.log(vertexShaders)

document.addEventListener('DOMContentLoaded', () => {
  const gui = new dat.GUI();
  const stats = new Stats();
  const container = document.createElement('div');
  const renderer = new THREE.WebGLRenderer();
  const composer = new EffectComposer(renderer);
  const scene = new THREE.Scene();
  let mesh;
  const shaderPasses = [];
  const guiModel = {
    shader1: 'none',
    shader2: 'none',
    shader3: 'none',
    param: new THREE.Vector3(1.0, 1.0, 0.0),
    shaders: ['none'],
    texture: textures[0],
    textures: textures,
    numberOfPasses: 1
  };

  container.classList.add('container');
  document.body.appendChild(container);
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    100
  );

  function setupScene(textureId) {
    scene.remove(mesh);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/textures/' + textureId, texture => {
      const plane = new THREE.PlaneGeometry(width, height);
      const shaderMaterial = new THREE.MeshBasicMaterial({
        map: texture
      });

      mesh = new THREE.Mesh(plane, shaderMaterial);
      scene.add(camera);
      scene.add(mesh);
    });
  }

  function refreshShaderPasses() {
    let shaderPass;

    composer.passes.splice(0, composer.passes.length);
    shaderPass = new RenderPass(scene, camera);
    composer.addPass(shaderPass);

    for (let i = 0; i < shaderPasses.length; i++) {
      if (!shaderPasses[i]) {
        continue;
      }

      for (let j = 0; j < guiModel.numberOfPasses; j++) {
        shaderPass = new ShaderPass(shaderPasses[i]);
        composer.addPass(shaderPass);
      }
    }

    shaderPass.renderToScreen = true;
  }

  function initGui() {
    [1, 2, 3].forEach((number) => {
      gui.add(guiModel, 'shader' + number, guiModel.shaders)
        .onChange(shaderName => {
          shaderPasses[number] = shaders[shaderName];
          refreshShaderPasses();
        });
    });

    gui.add(guiModel, 'texture', guiModel.textures).onChange(textureId => {
      setupScene(textureId);
    });

    gui.add(guiModel, 'numberOfPasses', 1, 5).step(1).onChange(refreshShaderPasses);
    gui.add(guiModel.param, 'x', -2, 2).onChange(refreshShaderPasses);
    gui.add(guiModel.param, 'y', -2, 2).onChange(refreshShaderPasses);
    gui.add(guiModel.param, 'z', 0, 5).step(1).onChange(refreshShaderPasses);

    stats.setMode(0);
    stats.domElement.classList.add('stats');
    container.appendChild(stats.domElement);
  }

  function loadShaders() {
    shaders.forEach((shader) => {
      guiModel.shaders.push(shader.key);
      shaders[shader.key] = createTHREEShader(
        vertexShaders[0].code,
        shader.code
      );
    });
    guiModel.shader1 = './passthrough.gs';
    shaderPasses[0] = shaders['./passthrough.gs'];
  }

  function calcTextureOffsets(width, height, size) {
    const deltaX = 1.0 / width;
    const deltaY = 1.0 / height;
    const distance = Math.floor(size / 2);
    const offsets = [];

    for (let i = -distance; i <= distance; i++) {
      for (let j = -distance; j <= distance; j++) {
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
          value: calcTextureOffsets(width, height, 3)
        },
        offset5x5: {
          type: 'v2v',
          value: calcTextureOffsets(width, height, 5)
        },
        offset7x7: {
          type: 'v2v',
          value: calcTextureOffsets(width, height, 7)
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
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  setupScene(textures[0]);
  loadShaders();
  initGui();
  refreshShaderPasses();
  render();
});
