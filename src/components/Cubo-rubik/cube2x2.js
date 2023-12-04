import * as THREE from "three";
import { Cube1x1 } from "./cube1x1.js";

const WorldAxis = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
};

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
        
        this.position.x = 0 || position.x || 0;
        this.position.y = 0 || position.y || 0;
        this.position.z = 0 || position.z || 0;
        
        this.rotateFace('front', 90);
        this.rotateFace('top', 90);
        this.rotateFace('left', 90);
    }

    rotateFace(face, angle){

        const angle_rad = angle * Math.PI / 180;

        const axis = {
            'top': WorldAxis.y,
            'bottom': WorldAxis.y,
            'left': WorldAxis.x,
            'right': WorldAxis.x,
            'front': WorldAxis.z,
            'back': WorldAxis.z
        }

        if(this.#faces[face]){

            this.#cubes.filter(this.#faces[face]).forEach(cube => {
                
                cube.position.applyAxisAngle(axis[face], angle_rad);

                cube.rotateOnWorldAxis(axis[face], angle_rad);
            });
        }

    }
}