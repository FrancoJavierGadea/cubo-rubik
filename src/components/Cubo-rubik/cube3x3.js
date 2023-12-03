import * as THREE from "three";
import { Cube1x1 } from "./cube1x1.js";

const WorldAxis = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1)
};

function getCubes1x1(size, gap){

    const n = (size + gap);

    return [
        //Corners
        new Cube1x1({ size, position: { x: n, y: n, z: n } }),
        new Cube1x1({ size, position: { x: -n, y: n, z: n } }),
        new Cube1x1({ size, position: { x: n, y: n, z: -n } }),
        new Cube1x1({ size, position: { x: -n, y: n, z: -n } }),
        new Cube1x1({ size, position: { x: n, y: -n, z: n } }),
        new Cube1x1({ size, position: { x: -n, y: -n, z: n } }),
        new Cube1x1({ size, position: { x: n, y: -n, z: -n } }),
        new Cube1x1({ size, position: { x: -n, y: -n, z: -n } }),

        //Centers
        new Cube1x1({ size, position: { x: n, y: 0, z: 0 } }),
        new Cube1x1({ size, position: { x: -n, y: 0, z: 0 } }),
        new Cube1x1({ size, position: { x: 0, y: n, z: 0 } }),
        new Cube1x1({ size, position: { x: 0, y: -n, z: 0 } }),
        new Cube1x1({ size, position: { x: 0, y: 0, z: -n } }),
        new Cube1x1({ size, position: { x: 0, y: 0, z: n } }),

        //Edge
        new Cube1x1({ size, position: { x: n, y: n, z: 0 } }),
        new Cube1x1({ size, position: { x: -n, y: n, z: 0 } }),
        new Cube1x1({ size, position: { x: n, y: -n, z: 0 } }),
        new Cube1x1({ size, position: { x: -n, y: -n, z: 0 } }),

        new Cube1x1({ size, position: { x: n, y: 0, z: n } }),
        new Cube1x1({ size, position: { x: -n, y: 0, z: n } }),
        new Cube1x1({ size, position: { x: n, y: 0, z: -n } }),
        new Cube1x1({ size, position: { x: -n, y: 0, z: -n } }),

        new Cube1x1({ size, position: { x: 0, y: n, z: n } }),
        new Cube1x1({ size, position: { x: 0, y: -n, z: n } }),
        new Cube1x1({ size, position: { x: 0, y: n, z: -n } }),
        new Cube1x1({ size, position: { x: 0, y: -n, z: -n } }),
    ];
}

export class Cube3x3 extends THREE.Group {

    #cubes = [];
    #faces = {};

    constructor(config = {}){

        super();
        
        const {size = 2, gap = 0.05, position = {}} = config;

        this.#cubes = getCubes1x1(size, gap);

        this.#faces.middleX = this.#cubes.filter((cube) => cube.position.x === 0);
        this.#faces.middleY = this.#cubes.filter((cube) => cube.position.y === 0);
        this.#faces.middleZ = this.#cubes.filter((cube) => cube.position.z === 0);

        const n = (size + gap) / 2;

        this.#faces.left = this.#cubes.filter((cube) => cube.position.x < -n);
        this.#faces.right = this.#cubes.filter((cube) => cube.position.x > n);

        this.#faces.top = this.#cubes.filter((cube) => cube.position.y > n);
        this.#faces.bottom = this.#cubes.filter((cube) => cube.position.y < -n);

        this.#faces.front = this.#cubes.filter((cube) => cube.position.z > n);
        this.#faces.back = this.#cubes.filter((cube) => cube.position.z < -n);
        
        this.add(...this.#cubes);

        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.position.z = position.z || 0; 


/* 
        // this.rotateFace('top', 60);
        // this.rotateFace('bottom', 60);

        this.rotateFace('middleZ', 60); */
    }

    rotateFace(face, angle){

        const angle_rad = angle * Math.PI / 180;

        const axis = {
            'top': WorldAxis.y,
            'bottom': WorldAxis.y,
            'left': WorldAxis.x,
            'right': WorldAxis.x,
            'front': WorldAxis.z,
            'back': WorldAxis.z,
            'middleX': WorldAxis.x,
            'middleY': WorldAxis.y,
            'middleZ': WorldAxis.z
        }

        if(this.#faces[face]){

            this.#faces[face].forEach(cube => {
                
                cube.position.applyAxisAngle(axis[face], angle_rad);
                cube.rotateOnWorldAxis(axis[face], angle_rad);
            });
        }

    }
}