import * as THREE from "three";
import { Point, drawPoint } from "./helpers";
import {WORLD_AXIS} from "./world.js";

export class TestCube extends THREE.Group {

    _angle = 0

    get angle(){

        return this._angle;
    }

    set angle(value){

        //console.log(value);
        this.rotateOnWorldAxis(WORLD_AXIS.y, (value - this._angle) * Math.PI / 180);
        this.position.applyAxisAngle(WORLD_AXIS.y, (value - this._angle) * Math.PI / 180);

        this._angle = value;
    }

    constructor(size = 1){
        super();

        const geometry = new THREE.BoxGeometry(size, size, size);

        const material = new THREE.MeshBasicMaterial({

            color: '#2405F0',

            transparent: true,

            opacity: 0.5
        });

        this.cube = new THREE.Mesh(geometry, material);

        this.add(this.cube);


        this.point = new Point({position: this.position});

        this.add(this.point);
    }

    rotateX_deg(angle){

        const angle_rad = THREE.MathUtils.degToRad(angle);

        super.rotateX(angle_rad);
    }

    rotateY_deg(angle){

        const angle_rad = THREE.MathUtils.degToRad(angle);
        
        super.rotateY(angle_rad);
    }

    rotateZ_deg(angle){

        const angle_rad = THREE.MathUtils.degToRad(angle);
        
        super.rotateZ(angle_rad);
    }

    rotateOnAxis_deg(vector3, angle){

        const angle_rad = THREE.MathUtils.degToRad(angle);

        super.rotateOnAxis(vector3, angle_rad);
    }

    rotateOnWorldAxis_deg(vector3, angle){

        const angle_rad = THREE.MathUtils.degToRad(angle);

        super.rotateOnWorldAxis(vector3, angle_rad);
    }


    rotateAroundWorldAxis(point, axis, angle) {

        const angle_rad = THREE.MathUtils.degToRad(angle);

        const q = new THREE.Quaternion();
    
        q.setFromAxisAngle(axis, angle_rad);
    
        this.applyQuaternion(q);
    
        this.position.sub(point);
        this.position.applyQuaternion(q);
        this.position.add(point);
    }
}