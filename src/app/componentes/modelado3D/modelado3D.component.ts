import { Component, ElementRef, NgZone, OnInit, ViewChild, Input } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'modelado3D',
  template: '<div #rendererContainer></div>',
  styleUrls: ['./modelado3D.component.css']
})

export class Modelado3DComponent implements OnInit {

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  @Input() modelTypeFilePath: string;
  @Input() modelNameFile: string;
  @Input() modelNameType: string;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Object3D;
  private controls: OrbitControls;

  constructor(private ngZone: NgZone) {

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('');
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(2.5, 1.9, 7.5);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer();
    this.model = new THREE.Object3D();

    // this.camera.position.x = 8;
  }

  ngOnInit(): void {
    this.initRenderer();
    this.initControls();
    this.loadModel();
    this.adjustSceneSize();
    this.animate();
  }

  private initRenderer(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }


  private adjustSceneSize(): void {
    const viewportWidth = window.innerWidth * 0.8;
    const viewportHeight = window.innerHeight * 0.8;

    this.camera.aspect = viewportWidth / viewportHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(viewportWidth, viewportHeight);

    const canvas = this.renderer.domElement;
    canvas.style.width = '80%';
    canvas.style.height = 'auto';

    // Centering the canvas horizontally
    const marginLeft = (window.innerWidth - viewportWidth) / 2;
    canvas.style.marginLeft = marginLeft + 'px';
   }


  private loadModel(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    const loader = new GLTFLoader();

    const gltfData = `assets/Renderizado/${this.modelTypeFilePath}/${this.modelNameFile}${this.modelNameType}.gltf`
    
    loader.load(gltfData, (gltf) => {
      // El modelo se ha cargado con éxito
      const model = gltf.scene;
      this.scene.add(model);
  }, undefined, (error) => {
      // Ocurrió un error durante la carga
      console.error('Error cargando el modelo GLTF', error);
  });
  }

  private animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animate();
    });
  }

  private initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

}
