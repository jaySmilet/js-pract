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
  const subtitles = document.getElementById('subtitles');

  // Check if the browser supports the Fullscreen API
  var fullScreenEnabled = !!(
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled ||
    document.webkitSupportsFullscreen ||
    document.webkitFullscreenEnabled ||
    document.createElement('video').webkitRequestFullScreen
  );
  // If the browser doesn't support the Fulscreen API then hide the fullscreen button
  if (!fullScreenEnabled) {
    fullscreen.style.display = 'none';
  }

  // Set the video container's fullscreen state
  var setFullscreenData = function (state) {
    videoContainer.setAttribute('data-fullscreen', !!state);
  };

  // Checks if the document is currently in fullscreen mode
  var isFullScreen = function () {
    return !!(
      document.fullScreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.fullscreenElement
    );
  };

  // Fullscreen
  var handleFullscreen = function () {
    // If fullscreen mode is active...
    if (isFullScreen()) {
      // ...exit fullscreen mode
      // (Note: this can only be called on document)
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen)
        document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setFullscreenData(false);
    } else {
      // ...otherwise enter fullscreen mode
      // (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
      if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      else if (videoContainer.mozRequestFullScreen)
        videoContainer.mozRequestFullScreen();
      else if (videoContainer.webkitRequestFullScreen) {
        // Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
        // ensures that our custom controls are visible:
        // figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
        // figure[data-fullscreen=true] .controls { z-index:2147483647; }
        video.webkitRequestFullScreen();
      } else if (videoContainer.msRequestFullscreen)
        videoContainer.msRequestFullscreen();
      setFullscreenData(true);
    }
  };

  // Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
  if (document.addEventListener) {
    // Change the volume
    const alterVolume = (dir) => {
      var currentVolume = Math.floor(video.volume * 10) / 10;
      console.log('before ' + video.volume);
      if (dir === '+' && currentVolume < 1) {
        video.volume += 0.1;
      } else if (dir === '-' && currentVolume > 0) {
        video.volume -= 0.1;
      }
      console.log('after ' + video.volume);
    };

    // Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
    video.addEventListener('loadedmetadata', () => {
      progress.setAttribute('max', video.duration);
    });

    // Play/Pause Button
    playpause.addEventListener('click', (e) => {
      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }
    });

    // Turn off all subtitles
    for (var i = 0; i < video.textTracks.length; i++) {
      console.log(video.textTracks);
      video.textTracks[i].mode = 'hidden';
    }

    // Creates and returns a menu item for the subtitles language menu
    var subtitleMenuButtons = [];
    var createMenuItem = (id, lang, label) => {
      var listItem = document.createElement('li');
      var button = listItem.appendChild(document.createElement('button'));
      button.setAttribute('id', id);
      button.className = 'subtitles-button';
      if (lang.length > 0) button.setAttribute('lang', lang);
      button.value = label;
      button.setAttribute('data-state', 'inactive');
      button.appendChild(document.createTextNode(label));
      button.addEventListener('click', (e) => {
        // Set all buttons to inactive
        subtitleMenuButtons.map((v, i, a) => {
          subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
        });
        // Find the language to activate
        console.log(e);
        var lang = e.target.getAttribute('lang');
        for (var i = 0; i < video.textTracks.length; i++) {
          // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
          if (video.textTracks[i].language == lang) {
            video.textTracks[i].mode = 'showing';
            e.target.setAttribute('data-state', 'active');
          } else {
            video.textTracks[i].mode = 'hidden';
          }
        }
        subtitlesMenu.style.display = 'none';
      });
      subtitleMenuButtons.push(button);
      return listItem;
    };

    // Go through each one and build a small clickable list, and when each item is clicked on, set its mode to be "showing" and the others to be "hidden"
    var subtitlesMenu;
    if (video.textTracks) {
      var df = document.createDocumentFragment();
      var subtitlesMenu = df.appendChild(document.createElement('ul'));
      subtitlesMenu.className = 'subtitles-menu';
      subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'off'));
      for (var i = 0; i < video.textTracks.length; i++) {
        subtitlesMenu.appendChild(
          createMenuItem(
            'subtitles-' + video.textTracks[i].language,
            video.textTracks[i].language,
            video.textTracks[i].label
          )
        );
      }
      videoContainer.appendChild(subtitlesMenu);
    }
    subtitles.addEventListener('click', (e) => {
      if (subtitlesMenu) {
        subtitlesMenu.style.display =
          subtitlesMenu.style.display == 'block' ? 'none' : 'block';
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

    fs.addEventListener('click', function (e) {
      handleFullscreen();
    });

    // As the video is playing, update the progress bar
    video.addEventListener('timeupdate', () => {
      // For mobile browsers, ensure that the progress element's max attribute is set
      if (!progress.getAttribute('max')) {
        progress.setAttribute('max', video.duration);
      }
      progress.value = video.currentTime;
      progressBar.style.width =
        Math.floor((video.currentTime / video.duration) * 100) + '%';
    });

    // React to the user clicking within the progress bar
    progress.addEventListener('click', function (e) {
      var pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
      video.currentTime = pos * video.duration;
    });

    // Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
    document.addEventListener('fullscreenchange', function (e) {
      setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', function () {
      setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', function () {
      setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', function () {
      setFullscreenData(!!document.msFullscreenElement);
    });
  }
}
