import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { DirectionalLight } from 'three';
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
  public camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  public controls = new OrbitControls(this.camera, this.renderer.domElement);
  public loader = new THREE.TextureLoader();

  ngOnInit() {
    this.init();
  }

  private init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('black');

    this.controls.update();
    this.camera.position.set(20, 5, 0);

    // =============================================================== Plane ===========================================================

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
    planeMesh.rotation.x = Math.PI * -.5;
    this.scene.add(planeMesh);

    // =============================================================== Shadow Texture On Spheres ===========================================================

    const shadowTexture = this.loader.load('../assets/textures/roundshadow.png');

    const sphereShadowBases = [];

    const sphereRadius = 1;
    const sphereWidthDiv = 32;
    const sphereHeightDiv = 16;
    const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDiv, sphereHeightDiv);

    const fakeShadowPlaneSize = 1;
    const shadowGeo = new THREE.PlaneBufferGeometry(fakeShadowPlaneSize, fakeShadowPlaneSize);

    const numSpheres = 15;
    for (let i = 0; i < numSpheres; i++) {
      // make a base for the shadow and the sphere so that they move together
      const base = new THREE.Object3D();
      this.scene.add(base);

      // add shadow to the base
      // note: we make a new material for each sphere
      // so we can set that sphere's material transparency seperately.
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true, // so that we can see the ground
        depthWrite: false // so that we don't have to sort
      });

      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.y = .001 // so that we are above ground slightly
      shadowMesh.rotation.x = Math.PI * -.5;
      const shadowSize = sphereRadius * 4;
      shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
      base.add(shadowMesh);

      // add the sphere to the base
      const u = i / numSpheres; // goes from 0 to 1 as we iterate the spheres
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(u, 1, .75);
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(0, sphereRadius + 2, 0);
      base.add(sphereMesh);

      // remember all 3 plus the y position
      sphereShadowBases.push({
        base,
        sphereMesh,
        shadowMesh,
        y: sphereMesh.position.y
      });


    }
    console.log('Sphere Shadow Bases ->', sphereShadowBases);

    // =============================================================== Lights ===========================================================

    {
      // HemisphereLight
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 2;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      this.scene.add(light);
    }

    {
      // DirectionalLight
      const color = 'white';
      const intensity = 1;
      const light = new DirectionalLight(color, intensity);
      light.position.set(0, 10, 5);
      light.target.position.set(-5, 0, 0);
      this.scene.add(light);
      this.scene.add(light.target);
    }

    // =============================================================== Animate ===========================================================

    const animate = (time) => {
      time *= .001; // convert to seconds

      sphereShadowBases.forEach((sphereShadBase, ndx) => {
        const {base, sphereMesh, shadowMesh, y} = sphereShadBase;

        // u is a value that goes from 0 to 1 as we iterate the spheres
        const u = ndx / sphereShadowBases.length;

        // compute a position for the base. Thius will move both the sphere and the shadow
        const speed = time * .2;
        const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
        const radius = Math.sin()
      })

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
}
