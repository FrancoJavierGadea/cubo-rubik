import * as THREE from 'three';
import {ORIGIN, WORLD_AXIS} from "@utils/world.js";

export class Face extends THREE.Mesh {

    constructor(size = 1, color = '#ffffff'){

        const geometry = new THREE.PlaneGeometry(size, size);

        const material = new THREE.MeshBasicMaterial({

            color,

            side: THREE.DoubleSide
        });

        super(geometry, material);
    }
}

function getFaces(config = {}){

    const {size = 1, scale = 1, position = {}} = config;

    const n = size / 2;

    const faces = [];

    if(position.y !== 0){

        const color = position.y > 0 ? '#ffffff': '#ffd600';

        const topBottom = new Face(size * scale, color);

        topBottom.rotateX(Math.PI / 2);
        topBottom.position.y = position.y > 0 ? n : -n;

        faces.push(topBottom);
    }

    if(position.z !== 0){

        const color = position.z > 0 ? '#0044ae' : '#009c46';

        const backFront = new Face(size * scale, color);

        backFront.position.z = position.z > 0 ? n : -n;

        faces.push(backFront);
    }

    if(position.x !== 0){

        const color = position.x > 0 ? '#b80a31' : '#ff5700';

        const leftRight = new Face(size * scale, color);

        leftRight.rotateY(Math.PI / 2);

        leftRight.position.x = position.x > 0 ? n : -n;

        faces.push(leftRight);
    }

    return faces;
}

class RotateAround {

    #angle = 0

    set angle(value){

        console.log('RotateAround', value);
        this.rotate(value - this.#angle);

        this.#angle = value;
    }

    get angle(){

        return this.#angle;
    }

    constructor(config = {}){

        const {target, angle, axis, point} = config;

        this.angle = angle || 0;
        this.axis = axis || WORLD_AXIS.Y;
        this.point = point || ORIGIN;

        this.target = target;
    }

    rotate(angle = this.angle, axis = this.axis, point = this.point){

        if(angle === 0) return;

        this.target.position.applyAxisAngle(axis, angle);
        this.target.rotateOnWorldAxis(axis, angle);
    }
}

export class Cube1x1 extends THREE.Group {

    set _rotate_around_angle(value){

        this.rotateAround.angle = value;
    }

    get _rotate_around_angle(){

        return this.rotateAround.angle;
    }

    constructor(config = {}){

        super();
        
        const {size = 2, position = {}, data = {}} = config;

        const scale = 0.99;

        const geometry = new THREE.BoxGeometry(size * scale, size * scale, size * scale);

        const material = new THREE.MeshBasicMaterial({

            color: '#000000'
        });

        const cube = new THREE.Mesh(geometry, material);

        this.add(cube);

        //Faces
        const faces = getFaces({ size, scale: 0.90, position });

        if(faces.length > 0) this.add(...faces);


        this.position.x = position.x || 0;
        this.position.y = position.y || 0;
        this.position.z = position.z || 0; 

        this.userData = {
            ...data,
            colors: faces.map(face => face.material.color.getHexString())
        };

        this.rotateAround = new RotateAround({
            target: this
        });
    }
}