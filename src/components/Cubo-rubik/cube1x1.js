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

        const isTop = position.y > 0;

        const color = isTop ? '#ffffff': '#ffd600';

        const face = new Face(size * scale, color);

        face.rotateX(Math.PI / 2);
        face.position.y = isTop ? n : -n;

        face.userData.name = isTop ? 'Top' : 'Bottom';
        face.userData.color = isTop ? 'White': 'Yellow';

        faces.push(face);
    }

    if(position.z !== 0){

        const isFront = position.z > 0 

        const color = isFront ? '#0044ae' : '#009c46';

        const face = new Face(size * scale, color);

        face.position.z = isFront > 0 ? n : -n;

        face.userData.name = isFront ? 'Front' : 'Back';
        face.userData.color = isFront ? 'Blue' : 'Green';

        faces.push(face);
    }

    if(position.x !== 0){

        const isRight = position.x > 0;

        const color = isRight ? '#b80a31' : '#ff5700';

        const face = new Face(size * scale, color);

        face.rotateY(Math.PI / 2);
        face.position.x = isRight ? n : -n;

        face.userData.name = isRight ? 'Right' : 'Left';
        face.userData.color = isRight ? 'Red' : 'Orange';

        faces.push(face);
    }

    return faces;
}

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
    }

    rotate(angle = this.angle, axis = this.axis, point = this.point){

        if(angle === 0) return;

        this.target.position.applyAxisAngle(axis, angle);
        this.target.rotateOnWorldAxis(axis, angle);
    }
}

export class Cube1x1 extends THREE.Group {

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
            colorsHex: faces.map(face => face.material.color.getHexString()),
            colors: faces.map(face => face.userData.color),
            name: faces.map(face => face.userData.name).join('-'),
            position
        };

        this.rotateAround = new RotateAround({
            target: this
        });
    }
}