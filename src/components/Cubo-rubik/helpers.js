
import * as THREE from "three";

export function sceneHelpers(scene){

    console.log('Helpers');

    const axesHelper = [
        new THREE.AxesHelper(-20),
        new THREE.AxesHelper(20)
    ];

    scene.add(...axesHelper);

    const size = 40;
    const divisions = 40;

    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = -0.001;

    scene.add(gridHelper);

    const light = new THREE.AmbientLight(0x404040);

    scene.add(light);
}