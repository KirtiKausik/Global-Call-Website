const myVideo = document.getElementById('my-video');
const peerVideo = document.getElementById('peer-video');
const peerIdInput = document.getElementById('peer-id');
const callButton = document.getElementById('callButton');
const endCallButton = document.getElementById('endCallButton');

// Initialize PeerJS (cloud server)
const peer = new Peer(undefined, {
    host: 'peerjs.com',       // Use the PeerJS cloud server
    port: 443,                // Default port for secure connections
    path: '/myapp',           // Custom path for your app
    secure: true              // Use a secure connection (recommended)
});

// Get local video stream
let localStream;
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localStream = stream;
        myVideo.srcObject = stream;
    }).catch(err => {
        console.error('Error accessing media devices.', err);
    });

// Handle incoming calls
peer.on('call', (call) => {
    call.answer(localStream);  // Answer with the local stream
    call.on('stream', (remoteStream) => {
        peerVideo.srcObject = remoteStream;
    });
    callButton.style.display = 'none';
    endCallButton.style.display = 'block';
});

// Make a call
callButton.addEventListener('click', () => {
    const peerId = peerIdInput.value.trim();
    if (peerId) {
        const call = peer.call(peerId, localStream);
        call.on('stream', (remoteStream) => {
            peerVideo.srcObject = remoteStream;
        });
        callButton.style.display = 'none';
        endCallButton.style.display = 'block';
    } else {
        alert('Please enter a valid Peer ID');
    }
});

// End the call
endCallButton.addEventListener('click', () => {
    peer.connections.forEach((connections) => {
        connections.forEach((connection) => {
            connection.close();
        });
    });
    peerVideo.srcObject = null;
    callButton.style.display = 'block';
    endCallButton.style.display = 'none';
});

// Display peer ID
peer.on('open', (id) => {
    console.log('My peer ID is ' + id);
    alert('Your Peer ID: ' + id);
});
