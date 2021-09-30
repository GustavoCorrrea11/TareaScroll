import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import gsap from 'gsap';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/loaders/GLTFLoader.js';
/* 
    Actividad
    - Cambiar imagenes por modelos(puede ser el mismo modelo)
    - Limitar el scroll
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

let y = 0;
let position = 0;
let car;
let objs = [];
let loader = new GLTFLoader();
let hlight;
let directionalLight;
let light;
let light2;
let light3;
let light4;

document.body.onload = () => {
  main();
};

window.onresize = () => {
  scene.background = new THREE.Color(0xdddddd);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

window.addEventListener('wheel', onMouseWheel);



function main() {
  // Configurracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  scene.background = new THREE.Color(0xdddddd);
  camera.position.x = 8;
  camera.position.y = 2;
  camera.position.z = 8;
  scene.add(camera);

  cameraConfig();
  // Lights
  setupLights();

  // Imagenes
  loadImages();

  animate();
}

function loadImages() {
  // Loader de Textura
  // const textureLoader = new THREE.TextureLoader();

  // const geometry = new THREE.PlaneBufferGeometry(1, 1.3);

  for (let i = 0; i < 4; i++) {
    // const material = new THREE.MeshBasicMaterial({
    //   map: textureLoader.load(`/assets/${i}.jpg`),
    // });

    // const img = new THREE.Mesh(geometry, material);
    // img.position.set(Math.random() + 0.3, i * -1.8);
    loader.load(
      'assets/scene.gltf',
      function (gltf) {
        car = gltf.scene.children[0];
        
        scene.add(gltf.scene);
        scene.traverse((object) => {
          if (object.isMesh) objs.push(object);
        });
        animate();
        car.position.set(Math.random()+ 0.3, i* -100.5);
         
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% cargado');
      },
      function (error) {
        console.log('Un error ocurrio');
      },
    );

    // scene.add(img);
  }

  
}

function cameraConfig() {
  camera.position.x = 8;
  camera.position.y = 2;
  camera.position.z = 300;
}

function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
}

function setupLights() {
  hlight = new THREE.AmbientLight(0x404040, -10);
  scene.add(hlight);

  directionalLight = new THREE.DirectionalLight(0xffffff, -10);
  directionalLight.position.set(0, 1, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  light = new THREE.PointLight(0xc4c4c4, -0.01);
  light.position.set(0, 300, 500);
  scene.add(light);

  light2 = new THREE.PointLight(0xc4c4c4, 20);
  light2.position.set(500, 100, 0);
  scene.add(light2);

  light3 = new THREE.PointLight(0xc4c4c4, 20);
  light3.position.set(0, 100, -500);
  scene.add(light3);

  light4 = new THREE.PointLight(0xc4c4c4, 20);
  light4.position.set(-500, 300, 500);
  scene.add(light4);
}

function onMouseWheel(event) {
  y = -event.deltaY * 0.07;
}

function updateElements() {
  position += y;
  y *= 0.9;
  if(position>10.5){
    position=10.5;
  }else if(position<-250.5){
    position=-250.5;
  }
  // Raycaster
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objs);

  for (const intersect of intersects) {
    gsap.to(intersect.object.scale, { x: 1, y: 1 });
    gsap.to(intersect.object.rotation, { x: 0 });
    gsap.to(intersect.object.rotation, { z: 5 });
    gsap.to(intersect.object.position, { y: -0.5 });
  }

  for (const object of objs) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      gsap.to(object.scale, { x: 0.9, y: 0.9 });
      
      gsap.to(object.rotation, { z: 0 });
      gsap.to(object.position, { x: 0 });
    }
  }
  
  
  camera.position.y = position;
}
