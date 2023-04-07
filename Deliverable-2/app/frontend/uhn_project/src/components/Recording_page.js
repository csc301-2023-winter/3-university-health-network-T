import { useRef } from "react"
import Menu from "../Component/Menu"
import Avatar_displayer from "./avatar/avatar_displayer"
import Recorder from "./Recorder"
import "./record_page.css"
import HomePopUP from "./homePopUP"
function Recording_page(){
    const toggleref = useRef(null)
    
    const all_ready=()=>{
        if(connection.avatar&&connection.avatar.ready&&!connection.avatar.ready()){
            return
        }
        if(connection.recorder&&connection.recorder.ready&&!connection.recorder.ready()){
            return
        }
        if(connection.homepop&&connection.homepop.ready&&!connection.homepop.ready()){
            return
        }
        console.log('every thing is ready')
        cont()
    }
    const connection ={showing_avatar:true}
    const stop=function(){
        if(connection.avatar&&connection.avatar.stop){
            connection.avatar.stop()
        }
        if(connection.recorder&&connection.recorder.stop){
            connection.recorder.stop()
        }
        if(connection.homepop&&connection.homepop.stop){
            connection.homepop.stop()
        }
        console.log('st'+toggleref.current)
    }
    const cont=function(){
        if(connection.avatar&&connection.avatar.cont){
            connection.avatar.cont()
        }
        if(connection.recorder&&connection.recorder.cont){
            connection.recorder.cont()
        }
        if(connection.homepop&&connection.homepop.cont){
            connection.homepop.cont()
        }
    }
    return(
        <div>
            <Menu style={{zIndex:'2'}}/>
            <div>
            <div >
            <Avatar_displayer id="avatar" connection={connection}/>
            <Recorder connection={connection} style={{position:'absolute', top:'0px'}}/>
            </div>
            <button onClick={stop}>pause</button>
            
            </div>
            <HomePopUP cont = {cont} connection={connection}></HomePopUP>
        </div>




    )
}
export default Recording_page