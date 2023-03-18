import { Component } from 'react';
import Avatar_player from './Avatar_player';
import { server_url } from '../../global';
import GLTF_player from './gltf_player';

class Displayer_loader extends Component{
    constructor(props){
        super(props)
        this.state={
            index:0,
            path:"",
            no_sets:0,
            no_repetitions:0,
            format:"gltf"
        }
        this.onfinsh=this.onfinsh.bind(this)
    }
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.exercise !== prevProps.exercise) {
            this.load_avator()
        }
      }
      load_avator(){
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        //var mybody = new FormData()
        //mybody.append("Day_Of_Week",""+(new Date()).getDay())
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            
        };
        console.log(this.props.exercise.exercise)
        fetch(server_url+ "/exercise/avatar-for-exe?exercise="+this.props.exercise.exercise+"&character="+this.props.exercise.characters[0],requestOptions)
        .then(reponse=>reponse.json()).then(
            data=>{
                console.log("d")
                console.log(data.avatarUrl)
                this.setState({["path"]:data.avatarUrl,["index"]:0})
            }
        )//.then((data)=>{
           // console.log("data 2")
            //console.log(data)
            //this.setState({["path"]:data.path,["index"]:0,["format"]:data.format})
        //})
      }
    onfinsh(){
        console.log('number sets')
        console.log(this.props.exercise.number_sets)
        console.log(this.state.index)
        if(this.state.index+1<this.props.exercise.number_sets){
            this.setState({["index"]:this.state.index+1})
        }else{
            this.send_complete(this.props.onfinsh)
        }
    }


    send_complete(call_back){
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append('Content-Type','application/json')
        var mybody = new FormData()
        let e = this.props.exercise
        console.log(e.exercise)
        mybody.append("exercise",""+e.exercise)
        mybody.append("character",""+e.characters[0])
        mybody.append("no_sets",""+e.number_sets)
        mybody.append("no_reps",""+e.number_repetitions)
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + (today.getSeconds()>9?today.getSeconds():'0'+today.getSeconds());
        console.log(time)
        mybody.append("date",""+date)
        mybody.append("time",""+time)
        for (var key of mybody.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }

        var b = JSON.stringify({
            exercise:""+e.exercise,
            character:""+e.characters[0],
            number_sets:""+e.number_sets,
            number_repetitions:""+e.number_repetitions,
            date:""+date,
            time:""+time
        })
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            token:`Bearer ${token}`,
            body:b
        };
        
        fetch(server_url+ "/exercise/complete_exercise",requestOptions).then((response)=>{
            console.log(response)
        }).then(call_back)
    }

    render() {
        console.log(this.props.exercise)
        return (
            <div>
            <div>
                sets finished: {this.state.index}/{this.props.exercise.number_sets}
            </div>
            <GLTF_player path={server_url+`/exercise/avatar_provider?exercise=${this.props.exercise.exercise}&character=${this.props.exercise.characters[0]}`} 
            total={this.props.exercise.number_repetitions}
             format={this.state.format}
              onfinsh={this.onfinsh}
               index={this.state.index}
               connection={this.props.connection}
               ></GLTF_player>
            </div>
        );
    }
}
export default Displayer_loader