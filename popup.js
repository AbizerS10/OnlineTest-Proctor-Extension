document.addEventListener("DOMContentLoaded", function () {
  console.log("inside");
  chrome.tabs.query({ pinned: false }, function (tabs) {
    document.getElementById("tabs_count").innerHTML = tabs.length;
  });

  document.getElementById("speed").innerHTML = navigator.onLine
    ? "Online"
    : "Offline";

  if (window.screenTop === 0 || window.screenY === 0) {
    document.getElementById("full_screen").innerHTML = "true";
  } else {
    document.getElementById("full_screen").innerHTML = "false";
    document.documentElement.requestFullscreen().catch((e) => console.log(e));
  }
});
