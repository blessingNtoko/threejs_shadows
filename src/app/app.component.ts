import { Component, OnInit } from '@angular/core';
import { request } from 'https';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  public camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  public controls = new OrbitControls(this.camera, this.renderer.domElement);

  ngOnInit() {
    this.init();
  }

  private init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('white');

    this.controls.update();
    this.camera.position.set(0, 10, 0);


    const animate = () => {

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }
}
