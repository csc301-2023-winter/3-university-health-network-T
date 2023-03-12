import React from 'react';
import { Offline, Online } from "react-detect-offline";



const InternetCheck = () => {

    return ( 
    <div>
        <Online>Your internet connection is stable and good to go</Online>
        <Offline>You are currently offline, please check your internect connection</Offline>
    </div>
    );
       
}

export default InternetCheck;