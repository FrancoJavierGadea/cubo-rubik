import * as THREE from "three";
import { WORLD_AXIS, ORIGIN } from "@utils/world.js";

export class Point extends THREE.Group {

    #update = false;
    #listeners = [];

    constructor(config = {}){
        super();

        const {size = 0.1, position = ORIGIN, color = '#ffff00'} = config;

        //Point
        const geometry = new THREE.SphereGeometry(size, 16, 16); 
        const material = new THREE.MeshBasicMaterial({ color });

        this.point = new THREE.Mesh(geometry, material);

        this.point.position.set(position.x, position.y, position.z);

        //Vector
        const dir = position.clone().normalize();
    
        const length = position.length();
    
        this.arrow = new THREE.ArrowHelper(dir, ORIGIN, length, color);

        this.add(this.point);
        this.add(this.arrow);
    }


    attachControls(controls){

        controls.attach(this.point);

        controls.addEventListener('dragging-changed', (e) => {

            this.#update = e.value;
        });
    }

    tick(){
        if(!this.#update) return;

        this.arrow.setLength(this.point.position.length(), 0.5, 0.2);
        this.arrow.setDirection(this.point.position.clone().normalize());

        this.#listeners.forEach(listener => {

            listener(this);
        });
    }

    addEventListener(event, listener){

        if(event === 'change'){

            this.#listeners.push(listener);
        }
    }

    removeEventListener(event, listener){

        if(event === 'change'){

            this.#listeners = this.#listeners.filter(lis => lis === listener);
        }
    }
}