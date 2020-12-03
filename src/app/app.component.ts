import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { BoxBufferGeometry, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

    this.controls.update();
    this.camera.position.set(20, 5, 0);

    // =============================================================== Plane Cube & Sphere===========================================================

    const planeSize = 40;
    const texture = this.loader.load('../assets/textures/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
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
      cubeMesh.receiveShadow = true;
      cubeMesh.castShadow = true;
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
      light.position.set(0, 10, 0);
      light.target.position.set(-4, 0, -4);
      this.scene.add(light);
      this.scene.add(light.target);

      const directHelper = new THREE.DirectionalLightHelper(light);
      this.scene.add(directHelper)

    // =============================================================== Animate ===========================================================

    const gui = new dat.GUI();

    // =============================================================== Animate ===========================================================

    const animate = (time) => {

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  public makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }
}
