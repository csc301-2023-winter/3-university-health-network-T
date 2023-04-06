export const server_url = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'
export const record_page_setting = {
    // when user choose one of the recording or avator to show in full screen, the other one will be 
    //squeezed with the following factor and placed on the from_bottom from the bottom
    // and from_right from the right of the screen
    factor: 0.25,
    from_right:0,
    from_bottom:0
}
//the width and hight of the largest retangle that can fit into a width x hight retangle with width/hight = ratial 
export const largest_inside=(width, hight, ratial)=>{
    if(width>hight*ratial){
        return [ratial*hight,hight]
    }
    return [width,width/ratial]
}