import { useRef } from "react"
import Menu from "../Component/Menu"
import Avatar_displayer from "./avatar/avatar_displayer"
import Recorder from "./Recorder"
import "./record_page.css"
import HomePopUP from "./homePopUP"
function Recording_page(){
    const toggleref = useRef(null)
    const connection ={}
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
            <Menu/>
            <div>
            <div className="container">
            <Avatar_displayer className="child" id="avatar" connection={connection}/>
            <Recorder className="child" connection={connection} />
            </div>
            <button onClick={stop}>stop</button>
            <button onClick={cont}>continue</button>
            </div>
            <HomePopUP cont = {cont} connection={connection}></HomePopUP>
        </div>




    )
}
export default Recording_page