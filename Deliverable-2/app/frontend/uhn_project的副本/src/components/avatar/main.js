// import * as THREE from "three"
// import * as THREE from '../node_modules/three/build/three.module.js'
// import * as THREE from '/home/ali/node_modules/three/build/three.module.js'
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader'
import Stats from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/stats.module'
// import "./style.css"



// Scene
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(2))
scene.background = new THREE.Color(0xffffff)



let modelReady = false
let mixer = THREE.AnimationMixer

let animationMixer = THREE.AnimationMixer
const fbxLoader = new FBXLoader()


fbxLoader.load(

    'models/air-squat.fbx',
    // 'models/dance.fbx',
    // 'models/arissa.fbx',
    //'models/mannequin.fbx',
    // 'models/mousey.fbx',
    
    (object) => {

        // object.scale.set(0.016, 0.016, 0.016)
        // object.scale.set(0.008, 0.008, 0.008)
        object.scale.set(0.016, 0.016, 0.016)

        object.position.set(0, -1.5, 0)
        object.rotation.y = Math.PI * .4


        mixer = new THREE.AnimationMixer(object)
        mixer.timeScale = 1
        const action = mixer.clipAction( object.animations[0]);
        action.play();

        // console.log(object.scene.name)


        scene.add(object)

        modelReady = true

    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)


// Create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
})
const mesh = new THREE.Mesh(geometry, material)

// scene.add(mesh)


// Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}




// Light
// const pointLight  = new THREE.PointLight(0xffffff, 2, 100)
const pointLight  = new THREE.PointLight(0xffffff, 3, 100)
pointLight.position.set(10, 20, 20)
scene.add(pointLight)

// const ambientLight  = new THREE.AmbientLight(0xffffff, .5)
// scene.add(ambientLight)

// const spotLight  = new THREE.SpotLight(0xffffff)
// spotLight.position.set(10, 10, 10)
// spotLight.castShadow = true;
// scene.add(spotLight)


// Camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height)
camera.position.x = 5
camera.position.y = 1
camera.position.z = 1



scene.add(camera)


// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = true
controls.autoRotate = false
controls.autoRotateSpeed = 5
controls.enableRotate = true
// controls.minPolarAngle = Math.PI/2;
// controls.maxPolarAngle = Math.PI/2;

// Resize
window.addEventListener('resize', () => {

    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})


const clock = new THREE.Clock()


const animate = () => {

    window.requestAnimationFrame(animate)
    controls.update()
    // mesh.position.x += .1

    const delta = clock.getDelta();


    if (modelReady) {
        mixer.update(delta)
        // console.log(modelReady)
    }

    renderer.render(scene, camera)
}

animate()
