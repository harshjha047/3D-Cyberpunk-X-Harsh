import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";

const locomotiveScroll = new LocomotiveScroll();

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.2,
  100
);
camera.position.z = 6;

//object
// const Geometry = new THREE.BoxGeometry(1,1,1);
// const Material = new THREE.MeshBasicMaterial({color:'red'})
// const mash = new THREE.Mesh(Geometry,Material)
// scene.add(mash)

// HDRI
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/clarens_night_01_1k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
  }
);
let model;
// GLTF Model
const loader = new GLTFLoader();
loader.load(
  "./DamagedHelmet.gltf",
  function (gltf) {
    model = gltf.scene;
    scene.add(model);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("An error happened", error);
  }
);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms["amount"].value = 0.0015;
composer.addPass(rgbShiftPass);

//render
composer.render();

window.addEventListener("mousemove", (e) => {
  if (model) {
    const rotatonX = (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.24;
    const rotatonY = (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.24;
    gsap.to(model.rotation, {
      x: rotatonY,
      y: rotatonX,
      duration: 0.2,
      ease: "power2.out",
    });
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

//animation
function animate() {
  window.requestAnimationFrame(animate);
  // mash.rotation.x += 0.01;
  // mash.rotation.y += 0.01;
  // mash.rotation.z += 0.01;
  // controls.update();
  composer.render();
}
animate();
