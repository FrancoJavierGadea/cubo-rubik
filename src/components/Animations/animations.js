import { TestCube } from '@utils/testMesh';
import * as THREE from 'three';

export function testAnimation(world){

    //Create keyframes (time -> value)
    const position_keyframes = {
        '1': new THREE.Vector3(0, 0, 0),
        '2': new THREE.Vector3(1, 0, 0),
        '3': new THREE.Vector3(2, 0, 0),
        '4': new THREE.Vector3(3, 0, 0),
        '5': new THREE.Vector3(4, 0, 0),
        '6': new THREE.Vector3(5, 0, 0),
        '7': new THREE.Vector3(6, 0, 0),
    }

    const scale_keyframes = {
        '1': new THREE.Vector3(1, 1, 1),
        '3': new THREE.Vector3(1, 2, 1),
        '5': new THREE.Vector3(1, 3, 1),
        '7': new THREE.Vector3(1, 4, 1)
    }

    //Convert keyframes to arrays
    const position_times = Object.keys(position_keyframes).map(key => +key);//[1, 2, 3, 4, 5]
    const position_values = Object.values(position_keyframes).flatMap(vector => vector.toArray());//[x1, y1, z1, x2, y2, z2, x3, y3, z3]

    const scale_times = Object.keys(scale_keyframes).map(key => +key);//[1, 3, 5, 7]
    const scale_values = Object.values(scale_keyframes).flatMap(vector => vector.toArray());//[x1, y1, z1, x2, y2, z2, x3, y3, z3]

    //!-> Create keyframes tracks
    const positionKF = new THREE.VectorKeyframeTrack(".position", position_times, position_values);

    const scaleKF = new THREE.VectorKeyframeTrack(".scale", scale_times, scale_values);

    //!-> Create Animation clip
    const clip = new THREE.AnimationClip("move and scale", -1, [positionKF, scaleKF]);

    //Create a mesh
    const testCube = new TestCube(2);

    world.scene.add(testCube);

    //!-> Create a mixer and actions
    const mixer = new THREE.AnimationMixer(testCube);

    const action = mixer.clipAction(clip);

    //!-> Config action

    //action.setLoop(THREE.LoopRepeat)//<- default
    //action.setLoop(THREE.LoopOnce);
    action.setLoop(THREE.LoopPingPong);

    action.repetitions = 2;//Default Infinity

    //action.clampWhenFinished = true;
    
    //!-> Set method to update in the world loop
    testCube.tick = (delta) => {

        mixer.update(delta);
    }
    
    world.loop.animatedItems.push(testCube);

    //!-> Play
    action.play();

    mixer.addEventListener('loop', (e) => {

        console.log(e);
    });

    mixer.addEventListener('finished', ({type, action, direction, target}) => {

        console.log(action.getClip().name);
    });
}

