import { Component } from 'react';
import Avatar_player from './Avatar_player';
import { server_url } from '../../global';

class Displayer_loader extends Component{
    constructor(props){
        super(props)
        this.state={
            index:0,
            path:"",
            no_sets:0,
            no_repetitions:0,
            format:"glbx"
        }
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
        
        fetch(server_url+ "/exercise/avatar-for-exe?exercise="+this.prop.exercise.exercise+"&character="+this.props.exercise.characters[0],requestOptions)
        .then(reponse=>reponse.json).then(
            data=>{
                console.log(data.message)
                return data.data
            }
        ).then((data)=>{
            this.setState({["path"]:data.path,["index"]:0,["format"]:data.format})
        })
      }
    onfinsh(){
        console.log(this.state.index)
        if(this.state.index+1<this.props.exercise.number_sets){
            this.setState({["index"]:this.state.index+1})
        }else{
            this.props.onfinsh()
        }
    }


    send_complete(call_back){
        const myHeaders = new Headers();
        const token = localStorage.getItem("token");
        myHeaders.append("Authorization", `Bearer ${token}`);
        var mybody = new FormData()
        let e = this.props.exercise
        mybody.append("exercise",""+e.exercise)
        mybody.append("character",""+e.characters[0])
        mybody.append("no_sets",""+e.number_sets)
        mybody.append("no_reps",""+e.number_repetitions)
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        mybody.append("date",""+date)
        mybody.append("time",""+time)
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            token:`Bearer ${token}`,
            body:mybody
        };
        
        fetch(server_url+ "/exercise/complete_exercise",requestOptions).then(call_back)
    }

    render() {
        return (
            <div>
            <div>
                {this.state.index}
            </div>
            <Avatar_player path={this.state.path} total={this.props.exercise.no_repetitions} format={this.props.exercise.format} onfinsh={this.onfinsh} index={this.state.index}></Avatar_player>
            </div>
        );
    }
}
export default Displayer_loader