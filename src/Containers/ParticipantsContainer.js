import React, {createRef, useRef, useEffect} from 'react'
import StreamThumbnail from '../Components/StreamThumbail';
import LeaveSessionButton from '../Components/LeaveSessionButton';
import InviteLinkButton from '../Components/InviteLinkButton';
import CameraOffButton from '../Components/CameraOffButton';
import CameraOnButton from '../Components/CameraOnButton';
import MuteMicButton from '../Components/MuteMicButton';
  

export default function ParticipantsContainer(props) {

    const participantRefs = useRef([]);

    useEffect(() => {
        console.log(props.participants.length)
        participantRefs.current = participantRefs.current.slice(0, props.participants.length);
        console.log(participantRefs.current)
    }, [props.participants]);

    function toggleMuteAll(newState){
        for(let ref of participantRefs.current){
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
                <button onClick={() => toggleMuteAll(true)}>Mute all</button>
                <button onClick={() => toggleMuteAll(false)}>Unmute all</button>
            </div>
            <div className="leaveButton">
                <MuteMicButton />
                <CameraOffButton />
                <CameraOnButton />
                <InviteLinkButton />
                <LeaveSessionButton />
            </div>           
            <div className="thumbnails">
                {
                    props.participants?.map((participant, index) => {
                        return  <div className="streamThumbnail" key={index-1} onClick={() => selectParticipant(participant)}>
                                    <video 
                                        className="participantVideoPlayer"
                                        autoPlay 
                                        controls 
                                        playsInline
                                        source={participant.src}
                                        ref={el => participantRefs.current[index-1] = el} 
                                        key={index}
                                    />
                                </div>
                    })
                }
            </div>
            
        </div>
    );
}