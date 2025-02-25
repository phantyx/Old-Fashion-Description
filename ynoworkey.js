var description;
var badDescription;
var showMoreButton;
var showLessButton;

var previousURL;

window.onload = function() {
  console.log("onload");
  checkReadyState();
}

document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress')
      if (previousURL != document.URL) {
        previousURL = document.URL;
        console.log("page change");
        checkReadyState();
      }
});

function checkReadyState() {
  if (document.readyState != "complete") {
    window.setTimeout(
      checkReadyState,
      100
    ); /* this checks the page every 100 milliseconds */
    console.log("not ready");
  } else {
    console.log("ready");
    SetVars();
    start();
  }
}

function SetVars() {
  //Set Vars

  //More Button
  waitForEl('tp-yt-paper-button[id="more"]').then(() => {
    showMoreButton = document.querySelector('tp-yt-paper-button[id="more"]');
    showMoreButton.addEventListener("click", More);
    console.log(showMoreButton);
  });

  //Less Button
  waitForEl('tp-yt-paper-button[id="less"]').then(() => {
    showLessButton = document.querySelector('tp-yt-paper-button[id="less"]');
    //showLessButton.addEventListener("click", Less);
    console.log(showLessButton);
  });

  //New Description
  waitForEl('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]').then(() => {
    badDescription = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-structured-description"]');
    //console.log(badDescription);
    //Check if there actually is the new description to prevent error
    if (badDescription != null) {
      badDescription.remove();
      //patch for removing the new description on newer versions of the website
      badDescription.style.visibility = "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN";
    }
  });

  //Old Description
  waitForEl('ytd-expander.ytd-video-secondary-info-renderer').then(() => {
    description = document.querySelector('ytd-expander.ytd-video-secondary-info-renderer');
    //console.log(description);
    //Incase the more button was clicked and the old description has not expanded yet then expand it
    if (showMoreButton.hasAttribute('hidden')) {
      More();
    }
  });
}

function More() {
  description.removeAttribute("collapsed");
}

// Showless button stil actualy adds the collapsed atribute
// If I had to guess it is because they dont expect the showless button to show so they didnt remove the functionality in case the description is expanded

// function Less() {
//   description.setAttribute("collapsed", "");
// }

//Waits for the element to be loaded
function waitForEl(el) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (document.querySelector(el)) {
        clearInterval(intervalId);
        resolve();
      }
    }, 100);
  });
}