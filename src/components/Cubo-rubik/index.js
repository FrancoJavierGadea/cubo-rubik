import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { sceneHelpers } from './helpers.js';
import { Cube1x1 } from "./cube1x1.js";
import { Cube2x2 } from "./cube2x2.js";
import { Cube3x3 } from "./cube3x3.js";

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
    
    canvas: document.getElementById('main-scene'),
});

renderer.setSize(width, height);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

camera.position.z = 12;

const controls = new OrbitControls(camera, renderer.domElement);

//Helpers
sceneHelpers(scene);

//
scene.add(new Cube2x2({

    position: {x: 0, y: 0, z: 0}
}))

//Render
function animate(){

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();