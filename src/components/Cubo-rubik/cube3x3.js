import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Cube1x1 } from "./cube1x1.js";
import { WORLD_AXIS } from "@utils/world.js";

function getCubes1x1(size, gap) {

    const n = size + gap;

    const cubesPosition = [
        { position: { x: n, y: n, z: n }, data: { type: 'corner' } },
        { position: { x: -n, y: n, z: n }, data: { type: 'corner' } },
        { position: { x: n, y: n, z: -n }, data: { type: 'corner' } },
        { position: { x: -n, y: n, z: -n }, data: { type: 'corner' } },
        { position: { x: n, y: -n, z: n }, data: { type: 'corner' } },
        { position: { x: -n, y: -n, z: n }, data: { type: 'corner' } },
        { position: { x: n, y: -n, z: -n }, data: { type: 'corner' } },
        { position: { x: -n, y: -n, z: -n }, data: { type: 'corner' } },

        { position: { x: n, y: 0, z: 0 }, data: { type: "center" } },
        { position: { x: -n, y: 0, z: 0 }, data: { type: "center" } },
        { position: { x: 0, y: n, z: 0 }, data: { type: "center" } },
        { position: { x: 0, y: -n, z: 0 }, data: { type: "center" } },
        { position: { x: 0, y: 0, z: -n }, data: { type: "center" } },
        { position: { x: 0, y: 0, z: n }, data: { type: "center" } },

        { position: { x: n, y: n, z: 0 }, data: { type: 'edge' } },
        { position: { x: -n, y: n, z: 0 }, data: { type: 'edge' } },
        { position: { x: n, y: -n, z: 0 }, data: { type: 'edge' } },
        { position: { x: -n, y: -n, z: 0 }, data: { type: 'edge' } },

        { position: { x: n, y: 0, z: n }, data: { type: 'edge' } },
        { position: { x: -n, y: 0, z: n }, data: { type: 'edge' } },
        { position: { x: n, y: 0, z: -n }, data: { type: 'edge' } },
        { position: { x: -n, y: 0, z: -n }, data: { type: 'edge' } },

        { position: { x: 0, y: n, z: n }, data: { type: 'edge' } },
        { position: { x: 0, y: -n, z: n }, data: { type: 'edge' } },
        { position: { x: 0, y: n, z: -n }, data: { type: 'edge' } },
        { position: { x: 0, y: -n, z: -n }, data: { type: 'edge' } },
    ];

    return cubesPosition.map((config) => {

        return new Cube1x1({size, ...config});
    });
}

export class Cube3x3 extends THREE.Group {
    #cubes = [];
    #faces = {};
    #axis = {};

    constructor(config = {}) {
        super();

        const { size = 2, gap = 0.05, position = {} } = config;

        this.#cubes = getCubes1x1(size, gap);

        this.add(...this.#cubes);

        //Faces
        const n = (size + gap) / 2;

        this.#faces = {
            middleX: (cube) => cube.position.x > -n && cube.position.x < n,
            middleY: (cube) => cube.position.y > -n && cube.position.y < n,
            middleZ: (cube) => cube.position.z > -n && cube.position.z < n,

            left: (cube) => cube.position.x <= -n,
            right: (cube) => cube.position.x >= n,

            top: (cube) => cube.position.y >= n,
            bottom: (cube) => cube.position.y <= -n,

            front: (cube) => cube.position.z >= n,
            back: (cube) => cube.position.z <= -n,
        };

        //Axis y faces
        this.#axis = {
            top: WORLD_AXIS.Y,
            bottom: WORLD_AXIS.Y,
            left: WORLD_AXIS.X,
            right: WORLD_AXIS.X,
            front: WORLD_AXIS.Z,
            back: WORLD_AXIS.Z,
            middleX: WORLD_AXIS.X,
            middleY: WORLD_AXIS.Y,
            middleZ: WORLD_AXIS.Z,
        };

        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.position.z = position.z || 0;
    }

    reset() {
        this.#cubes.forEach((cube) => {
            const position = cube.userData.position;

            cube.position.set(position.x, position.y, position.z);
            cube.rotation.set(0, 0, 0);
        });
    }

    rotateFace(face, angle, time = 1) {
        if (!this.#faces[face]) return;

        const angle_rad = THREE.MathUtils.degToRad(angle);

        //Animacion Tween
        const tween = this.createTweenAnimation(angle_rad, time);

        tween.onStart((value) => {
            value.targets = this.#cubes.filter((cube) => {
                const flag = this.#faces[face](cube);

                if (flag) {
                    cube.rotateAround.axis = this.#axis[face];
                }

                return flag;
            });
        });

        tween.onUpdate((value) => {
            const { angle, targets } = value;

            targets.forEach((cube) => {
                cube.rotateAround.angle = angle;
            });
        });

        return {
            rotate: () => {
                this.#cubes.filter(this.#faces[face]).forEach((cube) => {
                    cube.rotateAround.rotate(angle_rad, this.#axis[face]);
                });
            },

            tween,
        };
    }

    createTweenAnimation(angle, time = 1) {
        const keyframes = {
            from: { angle: 0 },

            to: { angle: angle },
        };

        const tween = new TWEEN.Tween(keyframes.from).to(
            keyframes.to,
            time * 1000
        );

        return tween;
    }
}
