import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import model from "./models/air-squat.fbx"
import Displayer_loader from './displayer_loader';
import { server_url } from '../../global';

class Avatar_displayer extends Component {

    constructor(props){
        super(props)
        this.state={
            all_exercise:[],
            index:0
        }
        this.onfinsh=this.onfinsh.bind(this)
        this.load_data=this.load_data.bind(this)
        this.componentDidMount=this.componentDidMount.bind(this)
    }

    componentDidMount(){
        this.load_data()
    }

    load_data(){
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        var mybody = new FormData()
        mybody.append("Day_Of_Week",""+(new Date()).getDay())
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            token:`Bearer ${token}`
        };
        
        fetch(server_url+ "/exercise/getexes-todo",requestOptions)
        .then(reponse=>{
            console.log(reponse)
            return reponse.json()}).then(
            (data)=>{
                console.log("data:")
                console.log(data)
                return data.data
            }
        ).then((data)=>{
            if(data){
                this.setState({["all_exercise"]:data,["index"]:0})
            }
        })
        //this.setState({['data']:[model]})
    }


    onfinsh(){
        console.log(this.state.index)
        if(this.state.index+1<this.state.all_exercise.length){
            this.setState({["index"]:this.state.index+1})
        }
    }
  

    render() {
        return (
            <div>
            <div>
            exercise finished: {this.state.index}/ {this.state.all_exercise.length}
            </div>
            {this.state.all_exercise.length>0?<Displayer_loader exercise={this.state.all_exercise[this.state.index]}
             onfinsh={this.onfinsh} 
             index={this.state.index}
             connection={this.props.connection}
             ></Displayer_loader>:<div></div>}
            </div>
        );
    }
}

export default Avatar_displayer;
