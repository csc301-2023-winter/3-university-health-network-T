import Menu from "../Component/Menu"
import Avatar_displayer from "./avatar/avatar_displayer"
import Recorder from "./Recorder"
import "./record_page.css"
function Recording_page(){
    const connection ={}
    const stop=function(){
        if(connection.avatar&&connection.avatar.stop){
            connection.avatar.stop()
        }
        if(connection.recorder&&connection.recorder.stop){
            connection.recorder.stop()
        }
    }
    const cont=function(){
        if(connection.avatar&&connection.avatar.cont){
            connection.avatar.cont()
        }
        if(connection.recorder&&connection.recorder.cont){
            connection.recorder.cont()
        }
    }
    return(
        <div>
            <Menu/>
            <div>
            <div className="container">
            <Avatar_displayer className="child" id="avatar" connection={connection}/>
            <Recorder className="child" connection={connection}/>
            </div>
            <button onClick={stop}>stop</button>
            <button onClick={cont}>continue</button>
            </div>
        </div>




    )
}
export default Recording_page