import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import model from "./models/air-squat.fbx"
import Avatar_player from './Avatar_player';
const server_url = " http://localhost:5000"

class Avatar_displayer extends Component {

    constructor(props){
        super(props)
        this.state={
            all_avatars:[{
                path:model,
                times:3
            },
            {
                path:model,
                times:2
            }],
            index:0
        }
        this.onfinsh=this.onfinsh.bind(this)
    }

load_data(){
        const myHeaders = new Headers();
        const token = localStorage.getItem("authToken");
        myHeaders.append("Authorization", `Bearer ${token}`);
        var mybody = new FormData()
        mybody.append("Day_Of_Week",""+(new Date()).getDay())
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            
        };
        
        fetch(server_url+ "/exercise/getexes-by-dow?Day_Of_Week="+(new Date()).getDay(),requestOptions)
        .then(reponse=>reponse.json).then(
            data=>{
                console.log(data.message)
                return data.data
            }
        ).then((data)=>{
            return data.map((d)=>{
                return {path:d.fbx.robort_path,times:d.Number_Repetitions}
            })
        }).then((data)=>{
            this.setState({["all_avatars"]:data,["index"]:0})
        })
        //this.setState({['data']:[model]})
    }


    onfinsh(){
        console.log(this.state.index)
        if(this.state.index+1<this.state.all_avatars.length){
            this.setState({["index"]:this.state.index+1})
        }
    }

    render() {
        return (
            <div>
            <div>
                {this.state.index}
            </div>
            <Avatar_player path={this.state.all_avatars[this.state.index].path} total={this.state.all_avatars[this.state.index].times} onfinsh={this.onfinsh} index={this.state.index}></Avatar_player>
            </div>
        );
    }
}

export default Avatar_displayer;
