import * as THREE from "three";

export const WORLD_AXIS = {

    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),

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