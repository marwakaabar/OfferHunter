import { changeCurrentThread , addThread , setThreads , addMessage , addMessages , changeIsMessaging } from "../actions/chatActions";




const initialState = {
                            currentThread : 'OfferHunter' ,
                            
                            isMessaging : false,
    
                            threads : 
                            [
                                {   id : 'OfferHunter',
                                    username : 'OfferHunter team',
                                    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_03.jpg',
                                    messages : [ {username : 'OfferHunter team', text : 'It seems you haven’t made any connections yet! To start chatting, you’ll need to reach out to someone from a post. Make a move and start the conversation!',
                                    img:'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_03.jpg', timestamp : new Date()}
                                                ],
                                    lastMessage : 'YOU HAVE NO MSGS',
                                }
                                ]
                            }



export default function userReducer(state = initialState, action) {

    switch (action.type) {
        case changeCurrentThread:
            return {
                ...state, 
                currentThread : action.payload
            }
        case addThread:{

            const newThread = {
                id: action.payload.id,
                username: action.payload.username,
                lastMessage: action.payload.lastMessage,
                img: action.payload.img,
                messages: action.payload.lastMessage ? [{id: action.payload.id , username: action.payload.username , lastMessage: action.payload.lastMessage , img:action.payload.img, timestamp: action.payload.timestamp}] : [],
            }

            return {
                currentThread : action.payload.id,
                isMessaging:false,
                threads : state.threads.filter((thread)=>{ return thread.id !== 'dealfinder' }).concat(newThread)
            }
        }
        case addMessage:{
            

            const threadIndex = state.threads.findIndex(
            (t) => t.id === action.payload.id
            );

            const oldThread = state.threads[threadIndex];

            const newThread = {
            ...oldThread,
            messages: oldThread.messages.concat({text: action.payload.text,timestamp: action.payload.timestamp, username: action.payload.username, img : action.payload.img}),
            };

            return {
            ...state,
            threads: [
            ...state.threads.slice(0, threadIndex),
            newThread,
            ...state.threads.slice(
            threadIndex + 1, state.threads.length
                                ),
                    ],
                };
        }
        case setThreads:{
            const oldThread = state.threads;
            function arrayUnique(array) {
                var a = array.concat();
                for(var i=0; i<a.length; ++i) {
                    for(var j=i+1; j<a.length; ++j) {
                        if(a[i].id === a[j].id)
                            a.splice(j--, 1);
                    }
                }
            
                return a;
            }
            
                // Merges both arrays and gets unique items
            var newThread = arrayUnique(oldThread.concat(action.payload.threads)).filter((thread)=>{return thread.id !== 'dealfinder'});
            return {
                currentThread : action.payload.currentThread,
                threads: newThread
            }
        }
        case addMessages: {

            const threadIndex = state.threads.findIndex(
                (t) => t.id === action.payload.threadId
                );
    
                const oldThread = state.threads[threadIndex];
    
                const newThread = {
                ...oldThread,
                messages: action.payload.messages,
                };
    
                return {
                currentThread: action.payload.threadId,
                isMessaging:true,
                threads: [
                ...state.threads.slice(0, threadIndex),
                newThread,
                ...state.threads.slice(
                threadIndex + 1, state.threads.length
                                        ),
                        ],
                    };


        }
        case changeIsMessaging : {
            return{
                ...state,
                isMessaging:!state.isMessaging,
            }
        }
        default:
            return state;
    }
}