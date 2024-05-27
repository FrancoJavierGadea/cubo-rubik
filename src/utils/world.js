import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { getStats } from "./stats";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export const ORIGIN = new THREE.Vector3(0, 0, 0);

export const WORLD_AXIS = {

    X: new THREE.Vector3(1, 0, 0),
    Y: new THREE.Vector3(0, 1, 0),
    Z: new THREE.Vector3(0, 0, 1),

    minus_x: new THREE.Vector3(-1, 0, 0),
    minus_y: new THREE.Vector3(0, -1, 0),
    minus_z: new THREE.Vector3(0, 0, -1),
};

export function drawWorldAxis(scene, size = 10){

    const axesHelper = [
        new THREE.AxesHelper(-size),
        new THREE.AxesHelper(size)
    ];

    const gridHelper = new THREE.GridHelper(2 * size, 2 * size);

    gridHelper.position.y = -0.001;

    scene.add(...axesHelper);
    scene.add(gridHelper);
}

//World base 
export class Loop {

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

            //Three Animations
            this.tick();

            //TWEEN Animations
            TWEEN.update();

            this.renderer.render(this.scene, this.camera);

            this.stats.end();
        });
    }

    stop(){

        this.renderer.setAnimationLoop(null);
    }

    tick(){
        const delta = this.clock.getDelta();

        for (const item of this.animatedItems) {

            if(item.tick) item.tick(delta);
        }
    }
}

export class World {

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
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.size = 0.8;
        this.transformControls.addEventListener('dragging-changed', (e) => {

            this.orbitControls.enabled = !e.value;
        });

        //Scene
        this.scene = new THREE.Scene();

        //Animation Loop
        this.loop = new Loop(this.camera, this.scene, this.renderer);

        drawWorldAxis(this.scene);
        this.scene.add(this.transformControls);
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
