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
        
        const {size = 5, gap = 0.05, position = {}} = config;

        this.#cubes = getCubes1x1(size, gap);
        
        //Faces
        this.#faces.front = this.#cubes.filter((cube) => cube.position.z > 0);
        this.#faces.back = this.#cubes.filter((cube) => cube.position.z < 0);

        this.#faces.left = this.#cubes.filter((cube) => cube.position.x < 0);
        this.#faces.right = this.#cubes.filter((cube) => cube.position.x > 0);

        this.#faces.top = this.#cubes.filter((cube) => cube.position.y > 0);
        this.#faces.bottom = this.#cubes.filter((cube) => cube.position.y < 0);

        this.add(...this.#cubes);

        this.position.x = 0 || position.x || 0;
        this.position.y = 0 || position.y || 0;
        this.position.z = 0 || position.z || 0;
        
        // this.rotateFace('front', 60);
        // this.rotateFace('back', 60);
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

            this.#faces[face].forEach(cube => {
                
                cube.position.applyAxisAngle(axis[face], angle_rad);
                cube.rotateOnWorldAxis(axis[face], angle_rad);
            });
        }

    }
}