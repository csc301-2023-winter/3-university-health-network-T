import Menu from "../Component/Menu"
import HomePopUP from "./homePopUP"
import "./homePopUp.css";
function HomeMove(){

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjc4NjUyNzE1LCJleHAiOjE2Nzg3MzkxMTV9.IEwM7IN28HfX9xPfVgd9Rq88bEUYGerUJm47DlqUY-4";
    return(
        <div id="screen">
            <Menu/>
            <HomePopUP token={token}/>
        </div>

    )
}
export default HomeMove