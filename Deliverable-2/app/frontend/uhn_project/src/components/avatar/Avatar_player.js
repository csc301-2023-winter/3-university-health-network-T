import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Avatar_player extends Component {

    constructor(props){
        super(props);
        this.state={
            path:props.path,
            index:0,
            total:props.total
        }
        this.componentDidMount=this.componentDidMount.bind(this)
        this.update_avtar=this.update_avtar.bind(this)
        //this.load_data=this.load_data.bind(this)
        this.next=this.next.bind(this)
        console.log("d o w"+(new Date()).getDay())
        this.onfinsh=this.onfinsh.bind(this)
        this.pause=false
        //this.load_data = this.load_data.bind(this)
    }

    
    next(){
        //if(this.state.index<this.data.length-1){
            this.setState({['index']:this.state.index+1})
        //}
        
    }
    onfinsh(a){
        if(this.props.total>this.state.index+1){
        a.action.reset()
        this.setState({['index']:this.state.index+1})
        console.log("aaa")
        }else{
            this.setState({["index"]:0})
            this.props.onfinsh()
        }
    }
    update_avtar(path){
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        console.log("avtar updated")
        let loader = new FBXLoader();
        console.log("format")
        console.log(this.props.format)
        if(this.props.format=='gltf'){
            loader = new GLTFLoader();
        }
        loader.setRequestHeader(myHeaders)
        console.log('path')
        console.log(path)
        loader.load(
            path,
            (object) => {
                console.log(this.scene.children)
                console.log('obj')
                console.log(object)
                this.scene.remove(this.scene.children.filter(child => child !== this.camera && child !== this.pointLight)[0]);
                object.scale.set(0.016, 0.016, 0.016);
                object.position.set(0, -1.5, 0);
                object.rotation.y = Math.PI * .4;

                this.mixer = new THREE.AnimationMixer(object);
                this.mixer.timeScale = 1;
                var action = this.mixer.clipAction(object.animations[0]);
                action.setLoop(THREE.LoopOnce)
                console.log(action.repetitions)
                action.reset()
                this.mixer.addEventListener('finished', this.onfinsh)
                this.scene.add(object);
                action.play();
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
        if(this.pause){
            return 
        }
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
    componentDidMount() {
        if(!this.scene){        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        }
        if(!this.camera){
        // Camera
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight);
        this.camera.position.set(5, 1, 1);
        this.scene.add(this.camera);
        }
        console.log(this.renderer)
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.mount.appendChild(this.renderer.domElement);
        if(!this.controls){
        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 5;
        this.controls.enableRotate = true;
        }
        if(!this.pointLight){
        // Light
        this.pointLight  = new THREE.PointLight(0xffffff, 3, 100);
        this.pointLight.position.set(10, 20, 20);
        this.scene.add(this.pointLight);
        }
        this.update_avtar(this.props.path)
        // Load FBX model
        //this.load_data()
        
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.path!=prevProps.path) {
            this.update_avtar(this.props.path)
        }
      }
    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild(this.renderer.domElement);
    }
    stop(){
        this.pause=true
    }
    continue(){
        this.pause=false
        this.animate()
    }
    render() {
        return (
            <div style={{width:"100%"}}>
            <div>
                {this.state.index}/{this.props.total}
            </div>
            <div ref={mount => { this.mount = mount }} style={{width:"100%"}}/>
            {this.pause?<button onClick={this.continue}>
            continue
            </button>:<button onClick={this.stop}> stop</button>}
            </div>
        );
    }
}

export default Avatar_player;
