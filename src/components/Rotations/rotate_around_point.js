import * as THREE from "three";
import { WORLD_AXIS, ORIGIN } from "@utils/world.js";
import { TestCube } from "@utils/testMesh.js";
import { VectorPoint, drawLine, drawPoint, drawVector } from "@utils/helpers";
import { Point } from "@utils/point.js";
import * as TWEEN from "@tweenjs/tween.js";

class RotateAround {

    #axis = WORLD_AXIS.Y
    #angle = 0

    set angle(value){

        this.rotate(value - this.#angle);

        this.#angle = value;
    }

    get angle(){

        return this.#angle;
    }

    set axis(value){

        this.#angle = 0;
        this.#axis = value;
    }

    get axis(){

        return this.#axis;
    }

    constructor(config = {}){

        const {target, angle, axis, point} = config;

        this.angle = angle || 0;
        this.axis = axis || WORLD_AXIS.Y;
        this.point = point || ORIGIN;

        this.target = target;

        this.quaternion = new THREE.Quaternion().setFromAxisAngle(this.axis, this.angle);
    }

    rotate(angle = this.angle, axis = this.axis, point = this.point){

        if(angle === 0) return;

        // this.target.position.applyAxisAngle(axis, angle);
        // this.target.rotateOnWorldAxis(axis, angle);

        const q = this.quaternion.setFromAxisAngle(axis.clone().normalize(), angle);

        this.target.applyQuaternion(q);

        this.target.position.sub(point);
        this.target.position.applyQuaternion(q);
        this.target.position.add(point);
    }
}


export function testRotateAroundPoint(world){

    //Point Vector
    const vector = new Point({
        position: new THREE.Vector3(2, 3, 3),
    });

    world.scene.add(vector);
    world.loop.animatedItems.push(vector);

    vector.attachControls(world.transformControls);

    //Point
    const point = new Point({
        position: new THREE.Vector3(1, 0, -3),
        color: '#ff0000'
    });

    world.scene.add(point);
    world.loop.animatedItems.push(point);

    //point.attachControls(world.transformControls);

    //vector.addEventListener('change', (vector) => {});

    //Line
    let line = drawLine(point.point.position, vector.point.position);

    world.scene.add(line);

    vector.addEventListener('change', () => {

        const dir = vector.point.position.clone().normalize();
        dir.clampLength(10, 20);

        line.geometry = new THREE.BufferGeometry().setFromPoints([

            point.point.position.clone(),
            point.point.position.clone().add(dir),
            point.point.position.clone().sub(dir)
        ]);
    });


    //Cube
    const cube = new TestCube(1.5);

    cube.position.set(-2, 0, -3);

    world.scene.add(cube);

    //Rotate around
    const rotateAround = new RotateAround({target: cube});

    rotateAround.axis = vector.point.position.clone().normalize();
    rotateAround.point = point.point.position;
    
    //Animation
    const tween = new TWEEN.Tween({angle: 0}).to({angle: 2 * Math.PI}, 2000);

    tween.onUpdate(({angle}) => {

        rotateAround.angle = angle;
    });
    tween.repeat(Infinity);
    tween.start();


    vector.addEventListener('change', () => {

        rotateAround.axis = vector.point.position.clone().normalize();
    });
}