import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader';
import { MTLLoader } from 'three/addons/loaders/MTLLoader';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight,
0.1,
1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light;
var angle = 0;

LoadModel();
SetLights();

renderer.setClearColor(0xffffff, 1);
renderer.clear();
camera.position.z = 10;
camera.position.y = 4;
function animate(){
  light.position.x =2+7*Math.sin(angle) * 0.3;
  light.position.y =2+7*Math.cos(angle) * 0.3;
  angle += 0.02;
  scene.rotateY(0.00);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop( animate );

function LoadModel() {
  const loader = new GLTFLoader().setPath( 'assets/gltf/bunny/' );
  loader.load ('bunny_gltf.glb', function (gltf) {
    console.log("Scene Add");
    
    scene.add(gltf.scene);
  }, undefined, function (error) {
    console.log( error );
  });
}

function SetLights() {
  light = new THREE.PointLight( 0xff0000, 1, 100 );
  light.position.set( 5, 0, 2 );
  scene.add( light );

  const lightAmbient = new THREE.AmbientLight(0x666666);
  scene.add( lightAmbient );
}