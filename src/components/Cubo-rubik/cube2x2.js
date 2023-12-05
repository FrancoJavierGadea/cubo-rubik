import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {ORIGIN, WORLD_AXIS} from "@utils/world.js";
import { chainTweens } from "@utils/tween.js";
import { chainThreeAnimations } from "@utils/threeAnimations.js";
import { Cube1x1 } from "./cube1x1.js";


function getCubes1x1(size, gap){

    const n = (size + gap) / 2;

    const cubesPosition = [
        { position: { x: n, y: n, z: n }, data: { type: 'corner' } },

        { position: { x: -n, y: n, z: n }, data: { type: 'corner' } },

        { position: { x: n, y: n, z: -n }, data: { type: 'corner' } },

        { position: { x: -n, y: n, z: -n }, data: { type: 'corner' } },

        { position: { x: n, y: -n, z: n }, data: { type: 'corner' } },

        { position: { x: -n, y: -n, z: n }, data: { type: 'corner' } },

        { position: { x: n, y: -n, z: -n }, data: { type: 'corner' } },

        { position: { x: -n, y: -n, z: -n }, data: { type: 'corner' } },
    ];

    return cubesPosition.map((config) => {

        return new Cube1x1({size, ...config});
    });
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

        //Axis by face
        this.#axis = {
            'top': WORLD_AXIS.Y,
            'bottom': WORLD_AXIS.Y,
            'left': WORLD_AXIS.X,
            'right': WORLD_AXIS.X,
            'front': WORLD_AXIS.Z,
            'back': WORLD_AXIS.Z
        }
        
        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.position.z = position.z || 0;

        //Animation three
        this.animationMixer = new THREE.AnimationMixer(this);

        this.tick = (delta) => {
    
            this.animationMixer.update(delta);
        }
    }


    reset(){

        this.#cubes.forEach(cube => {
            
            const position = cube.userData.position;

            cube.position.set(position.x, position.y, position.z);
            cube.rotation.set(0, 0, 0);
        });
    }

    rotateFace(face, angle, time = 1){

        if(!this.#faces[face]) return;
        
        const angle_rad = THREE.MathUtils.degToRad(angle);


        //Animacion Three 
        const three = this.createThreeAnimation(angle_rad, face);

        //Animacion Tween
        const tween = this.createTweenAnimation(angle_rad, face, time);

    

        return {
            rotate: () => {
                this.#cubes.filter(this.#faces[face]).forEach(cube => {

                    cube.rotateAround.rotate(angle_rad, this.#axis[face]);
                });
            },

            tween,

            three
        }
    }

    createTweenAnimation(angle, face, time = 1){

        const keyframes = {

            from: { angle: 0 },

            to: { angle: angle}
        }

        const tween = new TWEEN.Tween(keyframes.from).to(keyframes.to, time * 1000);

        tween.onStart((value) => {

            value.targets = this.#cubes.filter(cube => {

                const flag = this.#faces[face](cube);

                if(flag){
                    
                    cube.rotateAround.axis = this.#axis[face];
                }

                return flag;
            });
        });

        tween.onUpdate((value) => {

            const {angle, targets} = value;

            targets.forEach(cube => {

                cube.rotateAround.angle = angle;
            });
        });

        return tween;
    }

    createThreeAnimation(angle_rad, face){

        const keyframes = {
            '0': 0,
            '1': angle_rad,
        }

        const times = Object.keys(keyframes).map(key => +key);
        const values = Object.values(keyframes);

        const track = new THREE.NumberKeyframeTrack('.angle', times, values);
        const clip = new THREE.AnimationClip('rotate', -1, [track]);

        return {
            start:() => {

                const targets = this.#cubes.reduce((acc, cube) => {

                    const flag = this.#faces[face](cube);

                    if(flag){
                        
                        cube.rotateAround.axis = this.#axis[face];
                        acc.push(cube.rotateAround);
                    }
        
                    return acc;

                }, []);

                const group = new THREE.AnimationObjectGroup(...targets);

                const action = this.animationMixer.clipAction(clip, group);
        
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
        
                action.play();

                return action;
            }
        }

    }
}