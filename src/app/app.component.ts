import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { BoxBufferGeometry, DirectionalLight, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ColorGUIHelper } from './Helpers/helpers.js';
import { DimensionGUIHelper } from './Helpers/helpers.js';
import { MinMaxGUIHelper } from './Helpers/helpers.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  public camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100);
  public controls = new OrbitControls(this.camera, this.renderer.domElement);
  public loader = new THREE.TextureLoader();

  ngOnInit() {
    this.init();
  }

  private init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('black');

    this.controls.target.set(0, 5, 0);
    this.controls.update();

    this.camera.position.set(0, 10, 20);

    // =============================================================== Plane Cube & Sphere===========================================================

    const planeSize = 40;
    const texture = this.loader.load('../assets/textures/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.receiveShadow = true;
    planeMesh.rotation.x = Math.PI * -.5;
    this.scene.add(planeMesh);

    {
      const size = 4;
      const cubeGeo = new BoxBufferGeometry(size, size, size);
      const cubeMat = new THREE.MeshPhongMaterial({
        color: '#8ac'
      });
      const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
      cubeMesh.castShadow = true;
      cubeMesh.receiveShadow = true;
      cubeMesh.position.set(size + 1, size / 2, 0);
      this.scene.add(cubeMesh);
    }

    {
      const sphereRadius = 3;
      const sphereWidthDiv = 32;
      const sphereHeightDiv = 16;
      const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDiv, sphereHeightDiv);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: '#ca8'
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.castShadow = true;
      sphereMesh.receiveShadow = true;
      sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      this.scene.add(sphereMesh);
    }

    // =============================================================== Lights ===========================================================

    const color = 'white';
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.castShadow = true;
    light.position.set(0, 10, 0);
    light.target.position.set(-4, 0, -4);
    this.scene.add(light);
    this.scene.add(light.target);

    const directHelper = new THREE.DirectionalLightHelper(light);
    this.scene.add(directHelper)

    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    this.scene.add(cameraHelper);

    const updateMatrixAndHelpers = () => {
      // update the light targets's matrixWorld because it is needed by the helper
      light.target.updateMatrixWorld();
      directHelper.update();

      // update the light's shadow camera's projection matrix
      light.shadow.camera.updateProjectionMatrix();

      // update the camera helper we're using to show the light's shadow camera
      cameraHelper.update();
    }
    updateMatrixAndHelpers();


    // =============================================================== Animate ===========================================================

    const gui = new dat.GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, .01);
    {
      const folder = gui.addFolder('Shadow Camera');
      folder.open();
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'left', 'right'), 'value', 1, 100).name('width').onChange(updateMatrixAndHelpers);
      folder.add(new DimensionGUIHelper(light.shadow.camera, 'bottom', 'top'), 'value', 1, 100).name('height').onChange(updateMatrixAndHelpers);
      const minMaxHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', .1);
      folder.add(minMaxHelper, 'min', .1, 50, .1).name('near').onChange(updateMatrixAndHelpers);
      folder.add(minMaxHelper, 'max', .1, 50, .1).name('far').onChange(updateMatrixAndHelpers);
      folder.add(light.shadow.camera, 'zoom', .01, 1.5, .01).onChange(updateMatrixAndHelpers);
    }

    this.makeXYZGUI(gui, light.position, 'position', updateMatrixAndHelpers);
    this.makeXYZGUI(gui, light.target.position, 'target', updateMatrixAndHelpers);

    // =============================================================== Resize ===========================================================

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);

    // =============================================================== Animate ===========================================================

    const animate = (time) => {

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  public makeXYZGUI(gui, vector3: Vector3, name: string, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }
}
