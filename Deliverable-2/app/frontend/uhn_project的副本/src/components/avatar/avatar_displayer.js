import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import model from "./models/air-squat.fbx"

class Avatar_displayer extends Component {

    componentDidMount() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        // Camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight);
        this.camera.position.set(5, 1, 1);
        this.scene.add(this.camera);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.mount.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 5;
        this.controls.enableRotate = true;

        // Light
        this.pointLight  = new THREE.PointLight(0xffffff, 3, 100);
        this.pointLight.position.set(10, 20, 20);
        this.scene.add(this.pointLight);

        // Load FBX model
        const loader = new FBXLoader();
        loader.load(
            model,
            (object) => {
                console.log(this.scene.children)
                this.scene.remove(this.scene.children.filter(child => child !== this.camera && child !== this.pointLight)[0]);
                object.scale.set(0.016, 0.016, 0.016);
                object.position.set(0, -1.5, 0);
                object.rotation.y = Math.PI * .4;

                this.mixer = new THREE.AnimationMixer(object);
                this.mixer.timeScale = 1;
                const action = this.mixer.clipAction(object.animations[0]);
                action.play();

                this.scene.add(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log(error);
            }
        );

        // Animate
        this.clock = new THREE.Clock();
        this.animate();
    }

    animate = () => {
        this.frameId = requestAnimationFrame(this.animate);

        // Update controls
        this.controls.update();

        // Update animation
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
            
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild(this.renderer.domElement);
    }

    render() {
        return (
            <div style={{width:"100%"}}>
            <div ref={mount => { this.mount = mount }} style={{width:"100%"}}/>
            </div>
        );
    }
}

export default Avatar_displayer;
