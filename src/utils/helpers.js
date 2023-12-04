
import * as THREE from "three";


export class Point extends THREE.Mesh {

    constructor({position, size = 0.07}){

        const geometry = new THREE.SphereGeometry(size, 16, 16); 

        const material = new THREE.MeshBasicMaterial( { color: '#ffff00' } );

        super(geometry, material);

        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.position.z = position.z || 0;

        this.scale.set(1, 1, 1);
    }
}

export function drawPoint(scene, vector3){

    const point = new Point({

        position: vector3
    });

    scene.add(point);
}

export function drawVector(scene, vector3){

    const dir = vector3.clone().normalize();

    const origin = new THREE.Vector3(0, 0, 0);
    const length = vector3.length();
    const color = '#ffff00';

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color);

    scene.add(arrowHelper);
}