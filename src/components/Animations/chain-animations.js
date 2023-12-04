import { TestCube } from '@utils/testMesh';
import * as THREE from 'three';


function moveAnimation(){

    //Create keyframes (time -> value)
    const position_keyframes = {
        '0': new THREE.Vector3(0, 0, 0),
        '3': new THREE.Vector3(6, 0, 0),
    }

    //Convert keyframes to arrays
    const position_times = Object.keys(position_keyframes).map(key => +key);
    const position_values = Object.values(position_keyframes).map(vector => vector.toArray()).flat(1);
    
    //!-> Create keyframes tracks
    const position_track = new THREE.VectorKeyframeTrack(".position", position_times, position_values);

    //!-> Create Animation clip
    const position_clip = new THREE.AnimationClip("move", -1, [position_track]);

    return position_clip;
}

function scaleAnimation(){

    const scale_keyframes = {
        '0': new THREE.Vector3(1, 1, 1),
        '3': new THREE.Vector3(1, 4, 1)
    }
    
    const scale_times = Object.keys(scale_keyframes).map(key => +key);//[1, 3, 5, 7]
    const scale_values = Object.values(scale_keyframes).flatMap(vector => vector.toArray());//[x1, y1, z1, x2, y2, z2, x3, y3, z3]
    
    const scaleKF = new THREE.VectorKeyframeTrack(".scale", scale_times, scale_values);

    const scale_clip = new THREE.AnimationClip("scale", -1, [scaleKF]);

    return scale_clip;
}

function rotateAnimation(){

    const rotate_keyframes = {
        '0': new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0),
        '3': new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI),
    }

    const rotate_times = Object.keys(rotate_keyframes).map(key => +key);

    const rotate_values = Object.values(rotate_keyframes).map(q => q.toArray()).flat(1);

    const rotate_tracks = new THREE.QuaternionKeyframeTrack('.quaternion', rotate_times, rotate_values);

    const rotate_clip = new THREE.AnimationClip("rotate", -1, [rotate_tracks]);

    return rotate_clip;
}

function angleAnimation(){

    const angle_keyframes = {
        '0': 0,
        '3': 360
    }

    const angle_times = Object.keys(angle_keyframes).map(key => +key);

    const angle_values = Object.values(angle_keyframes);

    const angle_track = new THREE.NumberKeyframeTrack('.angle', angle_times, angle_values);

    const angle_clip = new THREE.AnimationClip('angle', -1, [angle_track]);

    return angle_clip;
}

export function testChainAnimation(world){

    
    //Create a mesh
    const testCube = new TestCube(2);
    testCube.position.set(2, 0, 2);
    world.scene.add(testCube);

    //!-> Create a mixer and actions
    const mixer = new THREE.AnimationMixer(testCube);

    const move_action = mixer.clipAction(moveAnimation());
    const scale_action = mixer.clipAction(scaleAnimation());
    const rotate_action = mixer.clipAction(rotateAnimation());
    const angle_action = mixer.clipAction(angleAnimation());

    //!-> Config action
    move_action.setLoop(THREE.LoopOnce);
    scale_action.setLoop(THREE.LoopPingPong, 2);

    move_action.clampWhenFinished = true;
    //scale_action.clampWhenFinished = true;

    
    //!-> Set method to update in the world loop
    testCube.tick = (delta) => {

        mixer.update(delta);
    }
    
    world.loop.animatedItems.push(testCube);

    //!-> Chain and play

    // const actions = [move_action, scale_action];

    // mixer.addEventListener('finished', ({type, action, direction, target}) => {

    //     console.log(action.getClip().name);

    //     const nextAction = actions.findIndex((ac) => action === ac) + 1;

    //     if(actions[nextAction]){

    //         actions[nextAction].play();
    //     }
    //     else {
    //         console.log('end')
    //     }

    // });

    // actions[0].play();

    // move_action.startAt(0);
    // scale_action.startAt(2);
    // move_action_reverse.startAt(4);
    
    // move_action.play();
    // scale_action.play();
    // //move_action_reverse.play();

    //rotate_action.play();
    angle_action.play();
}