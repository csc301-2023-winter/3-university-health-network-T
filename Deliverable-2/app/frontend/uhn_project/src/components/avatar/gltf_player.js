
import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class GLTF_player extends Component {

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
        this.stop=this.stop.bind(this)
        this.cont=this.cont.bind(this)
        //this.load_data = this.load_data.bind(this)
    }


    next(){
        //if(this.state.index<this.data.length-1){
            this.setState({['index']:this.state.index+1})
        //}
        
    }
    onfinsh(a){
        console.log('gltf loder total')
        console.log(this.props.total)
        console.log(a)
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
    console.log("format")
    console.log(this.props.format)
    let loader = new GLTFLoader()
    loader.setRequestHeader(myHeaders)
    console.log('path')
    console.log(path)
    loader.load(
        path,
        (gltf) => {






            console.log(gltf)
            this.scene.remove(this.scene.children.filter(child => child !== this.camera && child !== this.pointLight)[0]);


            gltf.scene.scale.set(1.6, 1.6, 1.6)
            gltf.scene.position.set(-4, -2, 0)
            gltf.scene.rotation.y = Math.PI * .48
    
            this.mixer = new THREE.AnimationMixer(gltf.scene)
            const clipAction = this.mixer.clipAction(gltf.animations[0])
            clipAction.setLoop(THREE.LoopOnce)
            //console.log(clipAction.repetitions)
            clipAction.reset()
            this.mixer.addEventListener('finished', this.onfinsh)
    
    
            // console.log(gltf.animations[0].tracks)
    
            clipAction.play()
            clipAction.fadeIn()
            this.action=clipAction
    
    
            this.scene.add(gltf.scene)
    
           // modelReady = true




        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
        }
    )
    
    this.clock = new THREE.Clock();
    this.animate();
}





componentDidMount() {
    if(this.props.connection){
        this.props.connection.avatar=this
    }

    if(!this.scene){        // Scene
        this.scene = new THREE.Scene()
        this.scene.add(new THREE.AxesHelper(2))
        this.scene.background = new THREE.Color(0xffffff)        
    }
    if(!this.camera){


       // camera.position.x = 5
        
        
        //camera.position.y = 1
        //camera.position.z = 1
    // Camera
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight);
    this.camera.position.set(5, 1, 1);
    this.scene.add(this.camera);
    }
    console.log(this.renderer)
    // Renderer
    //const renderer = new THREE.WebGLRenderer({canvas})
//renderer.setSize(sizes.width, sizes.height)
//renderer.setPixelRatio(2)
//renderer.render(scene, camera)
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    this.renderer.setPixelRatio(2);
    this.mount.appendChild(this.renderer.domElement);
    if(!this.controls){
        //const controls = new OrbitControls(camera, canvas)
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
componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.path!=prevProps.path) {
        this.update_avtar(this.props.path)
    }
    if(this.props.index!=prevProps.index){
    this.setState({['index']:0})
    if(this.action){
    
        this.action.reset()
    }
    }
  }
componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.removeChild(this.renderer.domElement);
}
stop(){
    console.log('stop')
    console.log(this.clock)
    this.clock.running=false
    this.pause=true
}
cont(){
    console.log(this.clock)
    this.pause=false
    if(this.animate){
    this.animate()
    }
}
render() {
    return (
        <div style={{width:"100%"}}>
        <div>
            repation finished: {this.state.index}/{this.props.total}
        </div>
        <div ref={mount => { this.mount = mount }} style={{width:"100%"}}/>
        </div>
    );
}
}
export default GLTF_player