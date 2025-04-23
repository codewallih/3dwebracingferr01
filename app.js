import * as THREE from "https://cdn.skypack.dev/three@0.129/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 6;

const scene = new THREE.Scene();

let bee;
let mixer;

const loader = new GLTFLoader();

loader.load("/scuderia.glb", function (gltf) {
  bee = gltf.scene;
  bee.scale.set(0.6, 0.6, 0.6);

  const box = new THREE.Box3().setFromObject(bee);
  const center = new THREE.Vector3();
  box.getCenter(center);
  bee.position.sub(center);
  scene.add(bee);

  mixer = new THREE.AnimationMixer(bee);
  if (gltf.animations.length > 0) {
    mixer.clipAction(gltf.animations[0]).play();
  }
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.02);
  }
};

reRender3D();

scene.add(new THREE.AmbientLight(0xfffff, 15));
const topLight = new THREE.DirectionalLight(0xffffff, 15);
scene.add(topLight);

let totalRotation = { x: 0, y: 0, z: 0 };

window.addEventListener("scroll", () => {
  const delta = window.scrollY;
  const rotationSpeed = 0.0001;

  totalRotation.x += delta * rotationSpeed;
  totalRotation.y += delta * rotationSpeed;
  totalRotation.z += delta * rotationSpeed;

  if (bee) {
    bee.rotation.x = totalRotation.x;
    bee.rotation.y = totalRotation.y;
    bee.rotation.z = totalRotation.z;
  }
});

let hoverDirection = 1;
let hoverSpeed = 0.001;
let hoverHeight = 0.5;

const hoverEffect = () => {
  if (bee) {
    if (bee.position.y >= hoverHeight) {
      hoverDirection = -1;
    } else if (bee.position.y <= hoverHeight) hoverDirection = +1;
    bee.position.y += hoverDirection * hoverSpeed;
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  hoverEffect();
};

animate();
