import React, {createRef, useRef, useEffect} from 'react'
import StreamThumbnail from '../Components/StreamThumbail';
import LeaveSessionButton from '../Components/LeaveSessionButton';
import InviteLinkButton from '../Components/InviteLinkButton';
import CameraOffButton from '../Components/CameraOffButton';
import CameraOnButton from '../Components/CameraOnButton';
import MuteMicButton from '../Components/MuteMicButton';
  


export default function ParticipantsContainer(props) {

    const participantRefs = useRef(new Map());

    /*useEffect(() => {
        console.log(props.peerStreams.size)
        participantRefs.current = participantRefs.current.slice(0, props.peerStreams.size);
        console.log(participantRefs.current)
    }, [props.peerStreams.size]);*/

    useEffect(() => {
        console.log(participantRefs.current);

        for(let ref of participantRefs.current.keys()){
            let media = props.peerStreams.get(ref);
            let pref = participantRefs.current.get(ref);
            if(pref){
                pref.srcObject = media;
            }
            else {
                participantRefs.current.delete(ref);
            }
        }
    }, [participantRefs.current.size]);

    function toggleMuteAll(newState){
        for(let ref of participantRefs.current.values()){
            ref.muted = newState;
        }
    }

    function getWatchUrl(){
        var url = window.location.href;
        document.getElementById("watchUrl").innerHTML = url;
    }

    function selectParticipant(participant){
        props.selectParticipant(participant);
    }
   
    return (
        <div className="container">
            <div className="muteButtons">
                <button id="muteAllButton" onClick={() => toggleMuteAll(true)}>Mute all</button>
                <button id="unMuteAllButton" onClick={() => toggleMuteAll(false)}>Unmute all</button>
            </div>           
            <div className="thumbnails">
                {
                    props.peerStreams.size > 0 ?
                    [...props.peerStreams.keys()].map((key, index) => {
                        return  <div className="streamThumbnail" id={index+1} key={index-1} onClick={() => selectParticipant(key)}>
                                    <video 
                                        className="participantVideoPlayer"
                                        autoPlay 
                                        controls 
                                        playsInline                               
                                        ref={el => participantRefs.current.set(key, el)} 
                                        key={index}
                                    />
                                </div>
                    }) : <></>
                }
                
            </div>
            
        </div>
    );
}