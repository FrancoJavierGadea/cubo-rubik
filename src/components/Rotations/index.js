import { World } from '@utils/world';
import * as THREE from 'three';
import { testRotateAroundPoint } from './rotate_around_point.js';
import { Point } from '@utils/point.js';

const canvas = document.getElementById('rotation-canvas');
const width = window.innerWidth;
const height = window.innerHeight;

const world = new World(canvas, width, height);


testRotateAroundPoint(world);



world.start();