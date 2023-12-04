
import * as THREE from "three";
import { TestCube } from "@utils/testMesh.js";
import { drawPoint, drawVector } from "@utils/helpers";


export function testRotations(scene){

    const testCube = new TestCube(2);

    testCube.position.set(2, 0, 3);

    scene.add(testCube);

    drawPoint(scene, testCube.position);

    const vec = new THREE.Vector3(-5, 1, 3)
    
    drawVector(scene, vec);

    console.log(vec.length());

    //Animar
    return () => {

    }
}