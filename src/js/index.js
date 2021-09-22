import * as THREE from "./3rdLibs/three.js/three.module";
import { FBXLoader } from "./three.js-master/examples/jsm/loaders/FBXLoader"
import {
    OrbitControls
}
from "./3rdLibs/three.js/controls/OrbitControls.js"


var controls;
var directionalLight, width, height, camera, renderer, loader, mixer, scene, group = [];
var clock = new THREE.Clock()

// 选项
initThree();
initCamera();
initScene();
initSky();
initDirectionalLight();
initAmLight();
animate();
initObJ();

function initObJ() {
    var loader = new FBXLoader();
    loader.load('../Resources/模型/iphone-12-pro/source/iPhone12Pro.FBX',
        function(object) { //加载路径fbx文件
            object.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.position.set(0, 0, 0);
            // object.scale.set(0.3, 0.3, 0.3);
            scene.add(object); //模型
        });
}

function initAmLight() {
    const Ambient_Light = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(Ambient_Light);
}

function initDirectionalLight() {
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(2000, 2000, -500);
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
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.set(0, 100, 0);
    controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', renderer);
    // camera.lookAt(0, 0, 0);
    // controls.target = new THREE.Vector3(0, 0, 0)
    // controls.enableKeys = true;


}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
}

function animate() {
    renderer.render(scene, camera);
    group.forEach(element => {
        element.lookAt(camera.position);
    });
    // update();
    requestAnimationFrame(animate);
}