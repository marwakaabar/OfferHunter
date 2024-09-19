

// props : {id,username,messages,pass}



const MessageList = ({uid,username,messages,img,id,changeMode}) => {
    

    
    console.log(messages)
            const isCurrentUser = (MessageUsername,username) => {
                if(!(MessageUsername === username) ) return {classN: 'me' , is: true}
                else return {classN :'you', is: false }
            }

            return <>
            <header>
            <button id="chatBackButton" onClick={changeMode}>GO BACK</button>
                <img  align="right" id="chatMainImage" src={img} width = "50" height = "50" alt=""/>
                <div>
                    <h2 align="center">{username}</h2>
                </div>
            </header>

            <ul id="chat">
           { messages.map ( 
                                            (msg,key) => {
                                                        const { classN , is } = isCurrentUser(msg.username,username);

                                                        return <li key = { key } className={classN}>
                                                                <div className="entete">
                                                        {       is ?   <>
                                                                            
                                                                            <h3 style={{marginRight:'5px',}}>{(new Date(Number(msg.timestamp))).toLocaleString()}</h3>
                                                                            <h2 style={{marginRight:'5px',}}><b>{msg.username}</b></h2>
                                                                            <img style={{marginBottom:'-5px',}} height="25" width="25" src={msg.img} alt=""/>
                                                                        </> 
                                                                            : <>
                                                                                <img style={{marginBottom:'-5px',}} height="25" width="25" src={msg.img} alt=""/>
                                                                                <h2 style={{marginLeft:'5px',}}><b>{msg.username}</b></h2>
                                                                                <h3 style={{marginLeft:'5px',}}>{(new Date(Number(msg.timestamp))).toLocaleString()}</h3>                                                                           
                                                                            </> 
                                                           }
                                                                    </div>
                                                                <div className="triangle"></div>
                                                                <div className="message">
                                                                    {msg.text}
                                                                </div>
                                                            </li>
                                            }
                                    
                                        )
            }
       </ul>
        
        </>

        

}

export default MessageList;