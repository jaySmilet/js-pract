// Import stylesheets
import './style.css';

// Write Javascript code!

// Does the browser actually support the video element?
const supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {
  // Obtain handles to main elements
  const videoContainer = document.getElementById('videoContainer');
  const video = document.getElementById('video');
  const videoControls = document.getElementById('video-controls');

  // Hide the default controls
  video.controls = false;

  // Display the user defined video controls
  videoControls.style.display = 'block';

  // Obtain handles to buttons and other elements
  const playpause = document.getElementById('playpause');
  const stop = document.getElementById('stop');
  const mute = document.getElementById('mute');
  const volinc = document.getElementById('volinc');
  const voldec = document.getElementById('voldec');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progress-bar');
  const fullscreen = document.getElementById('fs');

  // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
  if (document.addEventListener) {
    // Change the volume
    const alterVolume = (dir) => {
      var currentVolume = Math.floor(video.volume * 10) / 10;
      if (dir === '+' && currentVolume < 1) {
        video.volume += 0.1;
      } else if (dir === '-' && currentVolume > 0) {
      }
      console.log(currentVolume);
    };

    // Play/Pause Button
    playpause.addEventListener('click', (e) => {
      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }
    });

    // The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
    stop.addEventListener('click', (e) => {
      video.pause();
      video.currentTime = 0;
      progress.value = 0;
    });

    mute.addEventListener('click', (e) => {
      video.muted = !video.muted;
    });

    volinc.addEventListener('click', (e) => {
      alterVolume('+');
    });

    voldec.addEventListener('click', (e) => {
      alterVolume('-');
    });
  }
}
