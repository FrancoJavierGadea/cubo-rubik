import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { drawWorldAxis } from '@utils/world.js';
import { getStats } from '@utils/stats.js';
import { Cube2x2 } from './cube2x2.js';

class Loop {

    constructor(camera, scene, renderer){

        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;

        this.clock = new THREE.Clock();

        this.stats = getStats();

        this.animatedItems = [];
    }

    start(){
        this.renderer.setAnimationLoop(() => {

            this.stats.begin();

            this.tick();

            this.renderer.render(this.scene, this.camera);

            this.stats.end();
        });
    }

    stop(){

        this.renderer.setAnimationLoop(null);
    }

    tick(){
        const delta = this.clock.getDelta();

        for (const item of  this.animatedItems) {

            if(item.tick) item.tick(delta);
        }
    }
}

class World {

    constructor(canvas, width, height){

        //Rendered
        this.renderer = new THREE.WebGLRenderer({
    
            canvas,
        });

        this.renderer.setSize(width, height);

        //Camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        this.camera.position.set(5, 5, 10);

        //Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        //Scene
        this.scene = new THREE.Scene();

        //Animation Loop
        this.loop = new Loop(this.camera, this.scene, this.renderer);

        drawWorldAxis(this.scene);
    }

    render(){

        this.renderer.render(this.scene, this.camera);
    }

    start(){

        this.loop.start();
    }

    stop(){

        this.loop.stop();
    }
}

const canvas = document.getElementById('main-scene');
const width = window.innerWidth;
const height = window.innerHeight;

const WORLD = new World(canvas, width, height);


const cube = new Cube2x2();

WORLD.scene.add(cube);
WORLD.loop.animatedItems.push(cube);

WORLD.start();