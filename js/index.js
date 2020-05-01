let scene, camera, renderer, canvas_container;
let controls, guiControls, datGUI;
let stats;
let spotLight, hemi;
let SCREEN_WIDTH, SCREEN_HEIGHT;
let mouse, raycaster;
let objects = [];
let model;

function init() {
  //document.querySelector(".popup").style.display = "none";
  $(".popup").hide();
  scene = new THREE.Scene();
  canvas_container = document.querySelector("#canvas-container");

  createCamera();
  createRenderer();
  createControls();
  createGUIControls();
  createLights();
  loadModel();
  createRaycaster();
  addControls();
  window.addEventListener("resize", onWindowResize);
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  camera.position.x = -2;
  camera.position.y = 4;
  camera.position.z = -9;
  camera.lookAt(scene.position);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x999999);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;
  renderer.shadowMapSoft = false;
  canvas_container.append(renderer.domElement);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);
}

function createGUIControls() {
  guiControls = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    lightX: 19,
    lightY: 47,
    lightZ: 19,
    intensity: 0.5,
    distance: 373,
    angle: 1.6,
    exponent: 38,
    shadowCameraNear: 34,
    shadowCameraFar: 2635,
    shadowCameraFov: 68,
    shadowCameraVisible: false,
    shadowMapWidth: 512,
    shadowMapHeight: 512,
    shadowBias: 0.0,
    shadowDarkness: 0.11
  };
}

function createLights() {
  hemi = new THREE.HemisphereLight(0xbbbbbb, 0x660066);
  scene.add(hemi);

  /*adds spot light with starting parameters*/
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = false;
  spotLight.position.set(20, 35, 40);
  spotLight.intensity = guiControls.intensity;
  spotLight.distance = guiControls.distance;
  spotLight.angle = guiControls.angle;
  spotLight.exponent = guiControls.exponent;
  spotLight.shadow.camera.near = guiControls.shadowCameraNear;
  spotLight.shadow.camera.far = guiControls.shadowCameraFar;
  spotLight.shadow.camera.fov = guiControls.shadowCameraFov;
  spotLight.shadowCameraVisible = guiControls.shadowCameraVisible;
  spotLight.shadow.bias = guiControls.shadowBias;
  spotLight.shadow.darkness = guiControls.shadowDarkness;
  scene.add(spotLight);
}

function onLoad(gltf) {
  model = gltf.scene;
  scene.add(model);

  scene.traverse(function(children) {
    objects.push(children);
  });

  model.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;

      //console.log(o);
    }
  });
}

const onProgress = () => {};

// the loader will send any error messages to this function, and we'll log
// them to to console
const onError = errorMessage => {
  console.log(errorMessage);
};

function loadModel() {
  let loader = new THREE.GLTFLoader();
  loader.load("/model/scene.glb", gltf => onLoad(gltf), onProgress, onError);
}

function createRaycaster() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  document.addEventListener("click", onDocumentClick, false);
  document.addEventListener("mouseup", onDocumentMouseUp, false);
}

function addControls() {}

function onDocumentMouseUp(event) {
  event.preventDefault();
  event.clientX = event.clientX;
  event.clientY = event.clientY;
  onDocumentClick(event);
}

function onDocumentClick(event) {
  event.preventDefault();
  mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(objects);
  var color = Math.random() * 0xffffff;

  if (intersects.length > 0) {
    intersects[0].object.material.color.setHex(color);
    console.log(intersects[0]);
    this.temp = intersects[0].object.material.color.getHexString();
    this.name = intersects[0].object.name;
    //document.querySelector(".text").innerHTML = "";
    $(".text").empty();
    // document
    //   .querySelector(".popup")
    //   .append(
    //     "<div class='text'><p>This is the color <strong>#" +
    //       this.temp +
    //       "</strong> and the name assigned in Blender is <strong>" +
    //       this.name +
    //       "</strong></p></div>"
    //   );
    // document.querySelector(".popup").style.visibility = "visible";
    $(".popup").append(
      "<div class='text'><p>This is the color <strong>#" +
        this.temp +
        "</strong> and the name assigned in Blender is <strong>" +
        this.name +
        "</strong></p></div>"
    );
    $(".popup").show();
  }
}

function render() {
  // spotLight.position.x = guiControls.lightX;
  // spotLight.position.y = guiControls.lightY;
  // spotLight.position.z = guiControls.lightZ;
  scene.rotation.y += 0.001;
}

function animate() {
  requestAnimationFrame(animate);
  render();
  //stats.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
}

init();
animate();
