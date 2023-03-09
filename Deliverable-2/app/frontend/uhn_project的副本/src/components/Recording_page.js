import Menu from "../Component/Menu"
import Avatar_displayer from "./avatar/avatar_displayer"
import Recorder from "./Recorder"
import "./record_page.css"
function Recording_page(){
    return(
        <div>
            <Menu/>
            <div className="container">
            <Recorder className="child"/>
            <Avatar_displayer className="child" id="avatar"/>
            </div>
        </div>




    )
}
export default Recording_page