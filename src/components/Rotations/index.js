import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { testRotations } from "./rotations.js";
import { drawWorldAxis } from '@utils/axis.js';
import { getStats } from '@utils/stats.js';


const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({
    
    canvas: document.getElementById('rotation-canvas'),
});

renderer.setSize(width, height);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

camera.position.set(5, 5, 10);

const controls = new OrbitControls(camera, renderer.domElement);

//Helpers
drawWorldAxis(scene);


//
const update = testRotations(scene);



//Render
const stats = getStats();

function animate(){

    stats.begin();

    update();
    
    renderer.render(scene, camera);

    stats.end();

    requestAnimationFrame(animate);
}

animate();