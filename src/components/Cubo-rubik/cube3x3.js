import * as THREE from "three";
import { Cube1x1 } from "./cube1x1.js";
import { WORLD_AXIS } from "@utils/world.js";

const axis = {
    'top': WORLD_AXIS.y,
    'bottom': WORLD_AXIS.y,
    'left': WORLD_AXIS.x,
    'right': WORLD_AXIS.x,
    'front': WORLD_AXIS.z,
    'back': WORLD_AXIS.z,
    'middleX': WORLD_AXIS.x,
    'middleY': WORLD_AXIS.y,
    'middleZ': WORLD_AXIS.z
}

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
        new Cube1x1({ size, position: { x: n, y: 0, z: 0 }, data: {center: true} }),
        new Cube1x1({ size, position: { x: -n, y: 0, z: 0 }, data: {center: true} }),
        new Cube1x1({ size, position: { x: 0, y: n, z: 0 }, data: {center: true} }),
        new Cube1x1({ size, position: { x: 0, y: -n, z: 0 }, data: {center: true} }),
        new Cube1x1({ size, position: { x: 0, y: 0, z: -n }, data: {center: true} }),
        new Cube1x1({ size, position: { x: 0, y: 0, z: n }, data: {center: true} }),

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
        
        const n = (size + gap) / 2;

        this.#faces = {

            middleX: (cube) => (cube.position.x > -n && cube.position.x < n),
            middleY: (cube) => (cube.position.y > -n && cube.position.y < n),
            middleZ: (cube) => (cube.position.z > -n && cube.position.z < n),
    
            left: (cube) => (cube.position.x <= -n),
            right: (cube) => (cube.position.x >= n),
    
            top: (cube) => (cube.position.y >= n),
            bottom: (cube) => (cube.position.y <= -n),
    
            front: (cube) => (cube.position.z >= n),
            back: (cube) => (cube.position.z <= -n),
        };
        
        this.add(...this.#cubes);

        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.position.z = position.z || 0; 


        
        // this.rotateFace('middleX', 90);
        // this.rotateFace('top', 90);
        // this.rotateFace('middleY', 90);
        // this.rotateFace('middleZ', 90);
    }

    rotateFace(face, angle){

        const angle_rad = THREE.MathUtils.degToRad(angle);

        // console.log(...this.#cubes.filter(c => c.userData.center).map(c => [c.userData, c.position]));

        if(this.#faces[face]){

            this.#cubes.filter(this.#faces[face]).forEach(cube => {
                        
                cube.position.applyAxisAngle(axis[face], angle_rad);

                cube.rotateOnWorldAxis(axis[face], angle_rad);
            });
        }
        
    }
}