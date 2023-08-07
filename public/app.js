const socket = io.connect("http://localhost:3500");

const join = document.getElementById('join');
const roomName = document.getElementById("room-name");
const userVideo = document.getElementById("user-video");
const peerVideo = document.getElementById("peer-video");


const initMedia = (data) => {
  console.log(data);
   // get user media
   navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 1920, height: 1080 },
  })
  .then( stream => {
    userVideo.srcObject = stream;
    userVideo.onloadedmetadata = () => {
      userVideo.play();
    }
    peerVideo.srcObject = stream;
    peerVideo.onloadedmetadata = () => {
      peerVideo.play();
    }
  })
  .catch(err => alert(err.message));

};


join.addEventListener('click', () => {
  if (roomName.value === "") {
    alert("Room name can not be empty");
    return false
  }

  // start room
  socket.emit("join", roomName.value);

  socket.on("room-joined", data => {
    initMedia(data);
  });

  socket.on("room-created", data => {
    initMedia(data);
  });

  socket.on("room-full", ({name, numOfUsers}) => {
    alert(`can not join room at this time, ${name} room reached full capacity of ${numOfUsers} users.`)
  })
 


})