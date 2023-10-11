/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Loaders
 */
const loadingManager = new THREE.LoadingManager(
  () => {
    window.setTimeout(() => {
      gsap.to(".overlay h1", {
        duration: 1,
        y: "-100%",
      });

      gsap.to(".overlay", {
        duration: 1,
        opacity: 0,
        delay: 1,
      });
      gsap.to(".overlay", {
        duration: 1,
        display: "none",
        delay: 1,
      });
    }, 2000);
  },
  () => {},
  () => console.error("error")
);

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * GLTF Model
 */
let base = new THREE.Object3D();
scene.add(base);
const gltfLoader = new THREE.GLTFLoader(loadingManager);
gltfLoader.load("./assets/COFFEE.glb", (gltf) => base.add(gltf.scene));

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
camera.position.z = 100;

scene.add(camera);

/**
 * Lights
 */
const pointLight = new THREE.PointLight("white", 2);
pointLight.position.z = 40;
scene.add(pointLight);

/**
 * Mouse move
 */

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var pointOfIntersection = new THREE.Vector3();
canvas.addEventListener(
  "touchmove",
  (e) => animate(e.touches[0].clientX, e.touches[0].clientY),
  false
);
canvas.addEventListener(
  "mousemove",
  (e) => animate(e.clientX, e.clientY),
  false
);

const cursor = document.querySelector(".cursor");
const cursorBorder = document.querySelector(".cursor-border");

const cursorPos = new THREE.Vector2();
const cursorBorderPos = new THREE.Vector2();

function animate(x, y) {
  cursorPos.x = x;
  cursorPos.y = y;

  mouse.x = (cursorPos.x / sizes.width) * 2 - 1;
  mouse.y = -(cursorPos.y / sizes.height) * 2 + 1;

  pointLight.position.x = mouse.x;
  pointLight.position.y = mouse.y;

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOfIntersection);
  base.lookAt(pointOfIntersection);

  cursor.style.transform = `translate(${x}px, ${y}px)`;
  cursor.style.opacity = 1;
  cursor.style.visibility = "visible";

  cursorBorder.style.opacity = 1;
  cursorBorder.style.visibility = "visible";
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antiAlias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);

  const easting = 8;
  cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easting;
  cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easting;

  cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px)`;
});
