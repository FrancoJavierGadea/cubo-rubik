import * as THREE from "three";

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
