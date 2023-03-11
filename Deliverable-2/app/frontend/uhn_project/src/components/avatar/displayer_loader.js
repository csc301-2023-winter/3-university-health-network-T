import { Component } from 'react';
import Avatar_player from './Avatar_player';
const server_url = " http://localhost:3000"

class Displayer_loader extends Component{
    constructor(props){
        super(props)
        this.state={
            index:0,
            path:"",
            no_sets:0,
            no_repetitions:0
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
        const token = localStorage.getItem("authToken");
        myHeaders.append("token", `Bearer ${token}`);
        var mybody = new FormData()
        mybody.append("Day_Of_Week",""+(new Date()).getDay())
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
            
        };
        
        fetch(server_url+ "/exercise/avatar-for-exes?exercise="+this.prop.exercise,requestOptions)
        .then(reponse=>reponse.json).then(
            data=>{
                console.log(data.message)
                return data.data
            }
        ).then((data)=>{
            this.setState({["path"]:data.path,["index"]:0,["no_sets"]:data.no_sets, ["no_repetitions"]:data.no_repetitions})
        })
      }
    onfinsh(){
        console.log(this.state.index)
        if(this.state.index+1<this.state.no_sets){
            this.setState({["index"]:this.state.index+1})
        }else{
            this.props.onfinsh()
        }
    }

    render() {
        return (
            <div>
            <div>
                {this.state.index}
            </div>
            <Avatar_player path={this.state.path} total={this.state.no_repetitions} onfinsh={this.onfinsh} index={this.state.index}></Avatar_player>
            </div>
        );
    }
}
export default Displayer_loader