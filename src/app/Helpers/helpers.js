import * as THREE from 'three';

export class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }

  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

export class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }

  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop]);
  }

  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v);
  }
}

export class StringToNumberHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }

  get value() {
    return this.obj[this.prop];
  }

  set value(v) {
    this.obj[this.prop] = parseFloat(v);
  }
}
