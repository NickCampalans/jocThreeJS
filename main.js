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
const clock = new THREE.Clock()
function animate(){
  if (modelReady) mixer.update(clock.getDelta())
  light.position.x =2+7*Math.sin(angle) * 0.3;
  light.position.y =2+7*Math.cos(angle) * 0.3;
  angle += 0.02;
  scene.rotateY(0.0);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop( animate );
let mixer;
let modelReady = false;
const animationActions = [];
let activeAction;
let lastAction;

function LoadModel() {
  const loader = new GLTFLoader().setPath( 'assets/gltf/rogue/' );
  loader.load ('Rogue_Hooded.glb', function (gltf) {
    //console.log("Scene Add");
    var bbox = new THREE.Box3().setFromObject(gltf.scene);
    console.log("BBox: ", bbox);
    var centerX = (bbox.max.x + bbox.min.x) / 2;
    var centerY = (bbox.max.y + bbox.min.y) / 2;
    var centerZ = (bbox.max.z + bbox.min.z) / 2;
    //console.log(`Center: ${centerX}, ${centerY}, ${centerZ}`);

    var sizeX = bbox.max.x - bbox.min.x;
    var sizeY = bbox.max.y - bbox.min.y;
    var sizeZ = bbox.max.z - bbox.min.z;
    //console.log(`Size:  ${sizeX}, ${sizeY}, ${sizeZ}`);
    
    camera.position.x = centerX;
    camera.position.y = centerY + 2 * sizeY;
    camera.position.z = centerZ + sizeZ * 5;
    camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ));
    
    mixer = new THREE.AnimationMixer(gltf.scene);
    const animationAction = mixer.clipAction((gltf).animations[73])
    animationActions.push(animationAction)
    //animationsFolder.add(animations, 'default')
    activeAction = animationActions[0]
    activeAction.play();
    modelReady = true;
    
    scene.add(gltf.scene);
  }, undefined, function (error) {
    console.log( error );
  });
}

function SetLights() {
  light = new THREE.PointLight( 0xff0000, 1, 100 );
  light.position.set( 5, 0, 2 );
  //scene.add( light );

  const lightAmbient = new THREE.AmbientLight(0xffffff);
  scene.add( lightAmbient );
}