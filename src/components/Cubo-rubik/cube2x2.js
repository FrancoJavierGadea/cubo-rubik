import * as THREE from "three";
import {ORIGIN, WORLD_AXIS} from "@utils/world.js";
import { Cube1x1 } from "./cube1x1.js";


function getCubes1x1(size, gap){

    const n = (size + gap) / 2;

    return [
        new Cube1x1({ size, position: { x: n, y: n, z: n } }),

        new Cube1x1({ size, position: { x: -n, y: n, z: n } }),

        new Cube1x1({ size, position: { x: n, y: n, z: -n } }),

        new Cube1x1({ size, position: { x: -n, y: n, z: -n } }),

        new Cube1x1({ size, position: { x: n, y: -n, z: n } }),

        new Cube1x1({ size, position: { x: -n, y: -n, z: n } }),

        new Cube1x1({ size, position: { x: n, y: -n, z: -n } }),

        new Cube1x1({ size, position: { x: -n, y: -n, z: -n } }),
    ];
}

export class Cube2x2 extends THREE.Group {

    #cubes = [];
    #faces = {};
    #axis = {};

    constructor(config = {}){

        super();
        
        const {size = 1, gap = 0.05, position = {}} = config;

        this.#cubes = getCubes1x1(size, gap);
        
        this.add(...this.#cubes);

        //Faces
        this.#faces = {

            front: (cube) => (cube.position.z > 0),
            back: (cube) => (cube.position.z < 0),

            left: (cube) => (cube.position.x < 0),
            right: (cube) => (cube.position.x > 0),

            top: (cube) => (cube.position.y > 0),
            bottom: (cube) => (cube.position.y < 0),
        };

        this.#axis = {
            'top': WORLD_AXIS.Y,
            'bottom': WORLD_AXIS.Y,
            'left': WORLD_AXIS.X,
            'right': WORLD_AXIS.X,
            'front': WORLD_AXIS.Z,
            'back': WORLD_AXIS.Z
        }
        
        this.position.x = 0 || position.x || 0;
        this.position.y = 0 || position.y || 0;
        this.position.z = 0 || position.z || 0;
        
        this.animationMixer = new THREE.AnimationMixer(this);

        this.tick = (delta) => {

            this.animationMixer.update(delta);
        }

        // this.rotateFace('front', 90);
        // this.rotateFace('top', 90);
        this.rotateFace('top', 90).action.play();
    }



    rotateFace(face, angle){

        
        if(!this.#faces[face]) return;
        
        const angle_rad = angle * Math.PI / 180;

        const targets = this.#cubes.filter(this.#faces[face]);

    
        //Animacion 
        const keyframes = {
            '0': 0,
            '1': angle_rad,
        }

        const times = Object.keys(keyframes).map(key => +key);
        const values = Object.values(keyframes);

        //const track = new THREE.NumberKeyframeTrack('._rotate_around_angle', times, values);
        const track = new THREE.NumberKeyframeTrack('.angle', times, values);
        const clip = new THREE.AnimationClip('rotate', -1, [track]);

        const group = new THREE.AnimationObjectGroup(...targets.map(cube => {

            cube.rotateAround.axis = this.#axis[face];

            return cube.rotateAround;
        }));

        const action = this.animationMixer.clipAction(clip, group);

        action.setLoop(THREE.LoopOnce);
        //action.clampWhenFinished = true;


        return {
            action,
            rotate: () => {
                targets.forEach(cube => {

                    cube.rotateAround.rotate(angle_rad, this.#axis[face]);
                });
            }
        }
    }


}