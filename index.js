// Import stylesheets
import './style.css';

// Write Javascript code!\
const video = document.getElementById('myVideo');
video.addEventListener('canplaythrough', (e) => {
  var i = 0;
  if (i == 0) {
    i = 1;
    var elem = document.getElementById('myBar');
    var width = 1;
    var id = setInterval(frame, 200);
    function frame() {
      if (video.ended || width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        // console.log(video.currentTime);
        // console.log(video.duration);
        width = Math.ceil((video.currentTime / video.duration) * 100);
        elem.style.width = width + '%';
      }
    }
  }
});

video.addEventListener('timeupdate', () => {
  if (Math.ceil(video.currentTime) % 5 == 0) {
    console.log('ok');
  }
});
