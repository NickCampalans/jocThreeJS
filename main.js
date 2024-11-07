import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth / window.innerHeight,
0.1,
1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

var light;
var angle = 0;

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const texture = new THREE.TextureLoader().load('img/grid.png')
const plane = new THREE.Mesh(
    planeGeometry,
    new THREE.MeshBasicMaterial({ color: 0x888888 })
)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)
LoadModel();
SetLights();

var animations = {};

renderer.setClearColor(0xffffff, 1);
renderer.clear();
camera.position.z = 10;
camera.position.y = 4;
const clock = new THREE.Clock();
const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
animationsFolder.open();

function animate(){
  if (modelReady) mixer.update(clock.getDelta())
  light.position.x =2+7*Math.sin(angle) * 0.3;
  light.position.y =2+7*Math.cos(angle) * 0.3;
  angle += 0.02;
  scene.rotateY(0.0);
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop( animate );
let mixer;
let modelReady = false;
const animationActions = [];
let activeAction;
let lastAction;

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  animate();
}

const setAction = (toAction) => {
  if (toAction != activeAction) {
    lastAction = activeAction
    activeAction = toAction
    lastAction.stop()
    lastAction.fadeOut(1)
    activeAction.reset()
    activeAction.fadeIn(1)
    activeAction.play() 
  }
}

function LoadModel() {
  const loader = new GLTFLoader().setPath( 'assets/gltf/rogue/' );
  loader.load ('Rogue_Hooded.glb', function (gltf) {
    var bbox = new THREE.Box3().setFromObject(gltf.scene);
    var centerX = (bbox.max.x + bbox.min.x) / 2;
    var centerY = (bbox.max.y + bbox.min.y) / 2;
    var centerZ = (bbox.max.z + bbox.min.z) / 2;

    var sizeX = bbox.max.x - bbox.min.x;
    var sizeY = bbox.max.y - bbox.min.y;
    var sizeZ = bbox.max.z - bbox.min.z;
    
    camera.position.x = centerX;
    camera.position.y = centerY + 2 * sizeY;
    camera.position.z = centerZ + sizeZ * 5;
    camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ));
    controls.target.set(centerX, centerY, centerZ);
    
    mixer = new THREE.AnimationMixer(gltf.scene);
    var animationAction;
    
    for (let index = 0; index < gltf.animations.length; index++) {
      const propName = gltf.animations[index].name;
      const str = `() => {setAction(animationActions[${index}]);}`;
      var funct = eval(str);
      
      animations[propName] = funct;
      animationsFolder.add(animations, propName)
    }
    
    for (let index = 0; index < gltf.animations.length; index++) {
      animationAction = mixer.clipAction(gltf.animations[index]);
      animationActions.push(animationAction);
    }

    activeAction = animationActions[73]
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

  const lightAmbient = new THREE.AmbientLight(0xffffff);
  scene.add( lightAmbient );
}