import * as THREE from "./3rdLibs/three.js/three.module";
import { FBXLoader } from "./three.js-master/examples/jsm/loaders/FBXLoader"
import {
  OrbitControls
}
  from "./3rdLibs/three.js/controls/OrbitControls.js"
import { Reflector } from './three.js-master/examples/jsm/objects/Reflector';


var controls;
var directionalLight, width, height, camera, renderer, loader, mixer, scene, group = [];
var clock = new THREE.Clock()

// 选项
initThree();
initCamera();
initScene();
// initSky();
initDirectionalLight();
initAmLight();
initObJ();
animate();

function initObJ() {
  var loader = new FBXLoader();
  loader.load('../Resources/模型/iphone-12-pro-max-concept/iPhone 12 Pro Max (Concept).FBX',
    function (object) { //加载路径fbx文件
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

      });
      object.castShadow = true;
      object.receiveShadow = true;
      object.position.set(0, 10, 0);
      // object.scale.set(0.3, 0.3, 0.3);
      scene.add(object); //模型
    });
  //底部平面
  var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = - 0.5 * Math.PI;
  plane.receiveShadow = true;
  //告诉底部平面需要接收阴影
  scene.add(plane);

  var geometry = new THREE.BoxGeometry(40, 64);
  var groundMirror = new Reflector(geometry, {
    clipBias: 0.03,
    textureWidth:10000,
    textureHeight: 10000,
    color: 0xffffff
  });
  console.log(groundMirror)
  groundMirror.receiveShadow = true;
  groundMirror.position.y =0.1;
  groundMirror.rotateX(- Math.PI / 2);
  scene.add(groundMirror);

}

function initAmLight() {
  const Ambient_Light = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(Ambient_Light);
}

function initDirectionalLight() {
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(100, 100, 100);
  directionalLight.shadow.camera.near = 0.1; //产生阴影的最近距离
  directionalLight.shadow.camera.far = 1000; //产生阴影的最远距离
  directionalLight.shadow.camera.left = -1000; //产生阴影距离位置的最左边位置
  directionalLight.shadow.camera.right = 1000; //最右边
  directionalLight.shadow.camera.top = 1000; //最上边
  directionalLight.shadow.camera.bottom = -1000; //最下面
  directionalLight.shadow.mapSize.height = 10000;
  directionalLight.shadow.mapSize.width = 10000;
  directionalLight.name = '平行光'
  directionalLight.castShadow = true;

  scene.add(directionalLight);
}

function initSky() {
  scene.background = new THREE.CubeTextureLoader().setPath('./Resources/sky/')
    .load([
      'px.jpg',
      'nx.jpg',
      'py.jpg',
      'ny.jpg',
      'pz.jpg',
      'nz.jpg'
    ]);
  scene.fog = new THREE.FogExp2(0x8db7fe, 0.0008);
}

function initThree() {
  width = document.getElementById('sceneCanvas').clientWidth;

  height = document.getElementById('sceneCanvas').clientHeight;
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true; //关键
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; //关键
  document.getElementById('sceneCanvas').appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 10000);
  camera.position.set(0, 50, 50);
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', renderer);
  // camera.lookAt(0, 0, 0);
  // controls.target = new THREE.Vector3(0, 0, 0)
  // controls.enableKeys = true;


}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

}

function animate() {
  renderer.render(scene, camera);

  // update();
  requestAnimationFrame(animate);
}