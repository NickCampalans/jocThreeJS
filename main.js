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

/*
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 });
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);
*/

const loader = new GLTFLoader().setPath( 'assets/gltf/' );
loader.load ('bunny_gltf.gltf', function (gltf) {
  console.log("Scene Add");
  
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.log( error );
});

/*var cube = undefined;
var mtlLoader = new MTLLoader();
mtlLoader.load('assets/obj/bunny_obj.mtl', function(materials) {
  materials.preload();
  console.log(materials);
  
  var loader = new OBJLoader();
  loader.setMaterials(materials);
  loader.load('assets/obj/bunny_obj.obj', function(object) {
    cube = object;
    scene.add(cube);
  }, function(xhr) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  }, function(error) {
    console.log('An error happened');
  });
});*/

const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 0, 10, 4 );
scene.add( light );

const light2 = new THREE.AmbientLight(0xf0f0f0);
scene.add( light2 );

renderer.setClearColor(0xffffff, 1);
renderer.clear();
camera.position.z = 10;
camera.position.y = 4;
function animate(){
  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;
  scene.rotateY(0.01);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop( animate );
