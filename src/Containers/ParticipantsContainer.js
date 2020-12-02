import React, {useRef, useEffect} from 'react'

export default function ParticipantsContainer(props) {

    const participantRefs = useRef(new Map());

    // Reset participant video players' sources when the participants change
    useEffect(() => {
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

    /**
    * Set muted state of all participants
    * @param {boolean} newState State to set muted to
    */
    function toggleMuteAll(newState){
        for(let ref of participantRefs.current.values()){
            ref.muted = newState;
        }
    }

    /**
    * Invoke selection callback
    * @param {string} participant Participant id
    */
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