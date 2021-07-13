import React, { createContext ,useState , useRef, useEffect} from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('https://my-video-chat-application.herokuapp.com');

const username = prompt("what is your username");

const ContextProvider =({ children })=> {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call,setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream;
        });

        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal })
        });

        socket.on("connect", () => {
            socket.emit("username", username);
        });
      
        socket.on("users", users => {
            setUsers(users);
        });
      
        socket.on("message", message => {
            setMessages(messages => [...messages, message]);
        });
      
        socket.on("connected", user => {
            setUsers(users => [...users, user]);
        });
      
        socket.on("disconnected", id => {
            setUsers(users => {
              return users.filter(user => user.id !== id);
            });
        });
    }, []);

//Make_a_call
    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        
        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted',(signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

//Answer_call
    const answerCall = () =>{
    setCallAccepted(true)

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
        socket.emit('answercall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
    }

//Exit_call   
    const leaveCall = () =>{
        setCallEnded(true);
        connectionRef.current.destroy();
    }

//Video_toggle   
    const muteUnmuteV = () => { 
        const enabled = stream.getVideoTracks()[0].enabled;
        if (enabled) {
            myVideo.current.srcObject.getVideoTracks()[0].enabled = false;
        } 
        else {
            myVideo.current.srcObject.getVideoTracks()[0].enabled = true;
        }
    }
    
//Audio_toggle
    const muteUnmuteA = () => { 
        const enabled = stream.getAudioTracks()[0].enabled;
        if (enabled) {
            myVideo.current.srcObject.getAudioTracks()[0].enabled = false;
        } 
        else {
            myVideo.current.srcObject.getAudioTracks()[0].enabled = true;
        }
    }

//Share_screen
    const  shareScreen=() =>{
        navigator.mediaDevices.getDisplayMedia( {
            video: {
                cursor: "always"
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        } )
        .then((screenStream) => {
            setStream(screenStream);
            connectionRef.current.replaceTrack(stream.getVideoTracks()[0],screenStream.getVideoTracks()[0],stream);
            myVideo.current.srcObject = screenStream;

            screenStream.getTracks()[0].onended = () =>{
                connectionRef.current.replaceTrack(screenStream.getVideoTracks()[0],stream.getVideoTracks()[0],stream);
                myVideo.current.srcObject=stream;
            }
        })
    }

//Messenger
    const submit = event => {
        event.preventDefault();
        socket.emit("send", message);
        setMessage("");
    }
        
    
        
    return(
        <SocketContext.Provider value={{call,callAccepted,myVideo,userVideo,stream,name,setName,callEnded,me,callUser,leaveCall,answerCall,muteUnmuteV,muteUnmuteA,users,message,messages,submit,setMessage,shareScreen}}>
            {children}
        </SocketContext.Provider>
    );
}

export { ContextProvider, SocketContext };