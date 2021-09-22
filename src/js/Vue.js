import * as THREE from "./3rdLibs/three.js/three.module";
import { FBXLoader } from "./three.js-master/examples/jsm/loaders/FBXLoader"
import {
    OrbitControls
}
from "./3rdLibs/three.js/controls/OrbitControls.js"

var controls;
var data = {
    directionalLight: null,
    width: null,
    height: null,
    camera: null,
    renderer: null,
    loader: null,
    mixer: null,
    clock: new THREE.Clock(),
    scene: null
}
var vm = new Vue({
    // 选项
    el: '#vue-dom',
    data: data,
    mounted() {
        this.initThree();
        this.initCamera();
        this.initScene();
        this.initSky();
        this.initObjFBX('../Resources/模型/2021-8-24/xining_fuwudating_1/xining_fuwudating.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_chayanzhongxin_2/xining_chayanzhongxin.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_fuwudating_3/xining_fuwudating.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_guolufang_4/xining_guolufang.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_tujiankaibizhan_5/xining_tujiankaibizhan.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_xunzhengku_6/xining_xunzhengku.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_yaoxieku_7/xining_yaoxieku.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_fukakou_8/xining_fukakou.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_kakou_langan_9/xining_kakou_langan.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_zhukakou_10/xining_zhukakou.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/dimian/dimian.FBX');
        this.initObjFBX('../Resources/模型/2021-8-24/xining_bangonglou_11/xining_bangonglou.FBX');


        // this.initObjFBX('../Resources/模型/2021-8-24/mijigui/mijigui.FBX');

        this.initDirectionalLight();
        this.initAmLight();
        // this.initGrid();
        this.animate();
    },
    methods: {
        VueMain() {},
        initGrid() {
            const size = 1000;
            const divisions = 1000;
            const gridHelper = new THREE.GridHelper(size, divisions);
            this.scene.add(gridHelper);
        },
        initAmLight() {
            const Ambient_Light = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(Ambient_Light);
        },
        initDirectionalLight() {
            let _self = this;
            _self.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
            _self.directionalLight.position.set(2000, 2000, -500);
            // _self.directionalLight.castShadow = true;
            // _self.directionalLight.shadow.camera.near = 10; //产生阴影的最近距离
            // _self.directionalLight.shadow.camera.far = 10000; //产生阴影的最远距离
            // _self.directionalLight.shadow.camera.left = -10000; //产生阴影距离位置的最左边位置
            // _self.directionalLight.shadow.camera.right = 10000; //最右边
            // _self.directionalLight.shadow.camera.top = 10000; //最上边
            // _self.directionalLight.shadow.camera.bottom = -10000; //最下面
            // _self.directionalLight.shadow.mapSize.height = 10000;
            // _self.directionalLight.shadow.mapSize.width = 10000;
            this.scene.add(_self.directionalLight);
        },
        initSky() {
            var _self = this
            _self.scene.background = new THREE.CubeTextureLoader().setPath('./Resources/sky/')
                .load([
                    'px.jpg',
                    'nx.jpg',
                    'py.jpg',
                    'ny.jpg',
                    'pz.jpg',
                    'nz.jpg'
                ]);
            _self.scene.fog = new THREE.FogExp2(0x8db7fe, 0.0008);
        },
        initThree() {
            let _self = this

            _self.width = document.getElementById('sceneCanvas').clientWidth;

            _self.height = document.getElementById('sceneCanvas').clientHeight;
            _self.renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            _self.renderer.setSize(_self.width, _self.height);
            _self.renderer.autoClear = false;
            _self.renderer.shadowMap.enabled = true;
            _self.renderer.shadowMapSoft = true; //关键
            _self.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //关键
            document.getElementById('sceneCanvas').appendChild(_self.renderer.domElement);
        },
        initCamera() {
            let _self = this;
            _self.camera = new THREE.PerspectiveCamera(75, _self.width / _self.height, 0.1, 10000);
            _self.camera.position.set(-833.4807849580014, 75.71938742672248, 559.7401831704944);
            controls = new OrbitControls(_self.camera, _self.renderer.domElement);
            _self.camera.lookAt(-833.4807849580013, 75.71938742672246, 75.71938742672246);
            controls.target = new THREE.Vector3(-833.4807849580013, 75.71938742672246, 75.71938742672246)
            controls.enableKeys = true;
        },
        initScene() {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xa0a0a0);
        },
        initObjFBX(Path, type = 0) {
            var loader = new FBXLoader();
            var _self = this;
            loader.load(Path,
                function(object) {
                    object.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    console.log(object)
                    var Mesh = object.children[0];
                    Mesh.position.y += 10;
                    if (type == 0) {
                        Mesh.scale.set(0.005, 0.005, 0.005);
                    } else {
                        Mesh.scale.set(2, 2, 2);
                    }
                    // var mar = Mesh.material.clone();
                    // mar.transparent = true;
                    // mar.opacity = 1;
                    // Mesh.material = mar;
                    // Mesh.geometry.verticesNeedUpdate = true;
                    // const edges = new THREE.EdgesGeometry(Mesh.geometry);
                    // var _material = new LineMaterial({
                    //     color: 0x15c9ea,
                    //     linewidth: 0.00201
                    // });
                    // var _geometry = new LineGeometry();
                    // _geometry.setPositions(edges.attributes.position.array);
                    // var meshLine2 = new Line2(_geometry, _material);
                    // console.log(edges)
                    //     // const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x009688 }));
                    // Mesh.add(meshLine2)
                    _self.scene.add(object);
                    _self.VueMain();
                });
        },
        animate() {
            this.renderer.render(this.scene, this.camera);
            // this.update();
            requestAnimationFrame(this.animate);
        },
    }
})