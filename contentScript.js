(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, tabLength, ip } = obj;
    localStorage.setItem("User IP address", ip);
    if (type.indexOf("test") !== -1 || type.indexOf("assessment") !== -1) {
      if (tabLength > 1) alert("close other tabs");
    }
  });

  function getMediaDevices() {
    let hasVideo = false;
    let hasAudio = false;
    let audioAccess = false;
    let videoAccess = false;
    return new Promise(async (resolve, reject) => {
      if (navigator.mediaDevices) {
        let devices = null;
        try {
          devices = await navigator.mediaDevices.enumerateDevices();

          devices.forEach(function (device) {
            if (device.kind === "audioinput") {
              hasAudio = true;
            }
            if (device.kind === "videoinput") {
              hasVideo = true;
            }
          });
        } catch (error) {
          console.error("There are no media devices available in this device.");
        }
        try {
          audioAccess = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
        } catch (error) {
          console.error(
            "The browser has no access to the microphone of the device."
          );
        }
        try {
          videoAccess = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        } catch (error) {
          console.error(
            "The browser has no access to the camera of the device."
          );
        }
        resolve({
          hasAudio: hasAudio,
          hasVideo: hasVideo,
          audioAccess: audioAccess,
          videoAccess: videoAccess,
        });
        localStorage.setItem("User has mic", hasAudio);
        localStorage.setItem("User has camera", hasVideo);
        localStorage.setItem(
          "Site has audio access",
          audioAccess ? audioAccess.active : false
        );
        localStorage.setItem(
          "Site has video access",
          videoAccess ? videoAccess.active : false
        );
        localStorage.setItem(
          "Internet State",
          navigator.onLine ? "Online" : "Offline"
        );
      } else {
        reject({ error: "The media devices could not be checked" });
      }
    });
  }

  function mediaDevicesAvailable() {
    getMediaDevices().then((media) => {
      let errorMessage = null;
      if (!media.hasAudio && media.hasVideo) {
        errorMessage = "Could not find your microphone.";
      } else if (!media.hasVideo && media.hasAudio) {
        errorMessage = "Could not find your camera.";
      } else if (!media.hasVideo && !media.hasAudio) {
        errorMessage = "Could not find your camera and microphone. ";
      } else if (!media.audioAccess && media.videoAccess) {
        errorMessage = deviceErrorMsg("microphone");
      } else if (media.audioAccess && !media.videoAccess) {
        errorMessage = deviceErrorMsg("camera");
      } else if (!media.audioAccess && !media.videoAccess) {
        errorMessage = deviceErrorMsg("camera and microphone");
      }
      if (errorMessage) alert(errorMessage);
    });
  }
  function deviceErrorMsg(device) {
    return `We can not use your ${device}. Please grant permission to your ${device}.`;
  }

  mediaDevicesAvailable();
})();

if (
  window.location.href.indexOf("test") > -1 ||
  window.location.href.indexOf("assessment") > -1
) {
  document.addEventListener("visibilitychange", (e) => {
    if (
      document.visibilityState === "hidden" &&
      (window.location.href.indexOf("test") > -1 ||
        window.location.href.indexOf("assessment") > -1)
    ) {
      alert("Warning! Don't switch tabs");
    }
    return true;
  });

  document.addEventListener("fullscreenchange", (e) => {
    if (!document.fullscreenElement)
      alert(
        "Warning! Can't exit full screen, click the screen to allow full screen mode"
      );
  });

  document.documentElement.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (
      e.key === "Escape" ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.shiftKey
    ) {
      alert("Can't use esc/ctrl/shift/alt/meta keys");
      return false;
    }
    return true;
  });

  document.documentElement.addEventListener("click", (el) => {
    document.documentElement
      .requestFullscreen({ navigationUI: "hide" })
      .catch((err) => {
        console.log(err);
      });
  });
}
