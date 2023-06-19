/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  
function AudioTestPage(
    _pageManager,
    _pageTemplateRenderer,
    _session,
    _config,
    _pageConfig,
    _errorHandler,
    _language
  ) {
    this.isMushra = false;
    this.pageManager = _pageManager;
    this.pageTemplateRenderer = _pageTemplateRenderer;
    this.session = _session;
    this.config = _config;
    this.pageConfig = _pageConfig;
    this.errorHandler = _errorHandler;
    this.language = _language;

    this.audio_inputs = [];

    // this.div = null;
    // this.videoVisualizer = null;
    // this.interactionTracker = [];
    // this.watched = false;
    // this.currentItem = null;
    // this.playedStimuli = [];
    // this.tdLoop2 = null;
    // this.reportButtonUnlockTimeout = 5000; // milliseconds
  
    // this.conditions = [];
  
    // function newStimulus(i, key, video, atVal) {
    //   var stimulus = new Stimulus(key, video);
    //   if (atVal) {
    //     stimulus.at = true;
    //     stimulus.atVal = atVal;
    //   }
    //   return stimulus;
    // }
  
    // var i = 0;
    // for (var item in this.pageConfig.stimuli) {
    //   key = this.pageConfig.stimuli[item][0];
    //   stimuli = this.pageConfig.stimuli[item][1];
    //   if (key.search("attn") != -1) {
    //     var stimulus = newStimulus(
    //       i,
    //       key,
    //       stimuli,
    //       true
    //     );
    //   } else {
    //     var stimulus = newStimulus(i, key, stimuli);
    //   }
    //   this.conditions[this.conditions.length] = stimulus;
    //   i++;
    // }
  
    // // data
    // this.ratings = [];
  
    // this.time = 0;
    // this.startTimeOnPage = null;
  }

AudioTestPage.prototype.getName = function () {
    return this.pageConfig.name;
};

/**
 * The ini method is called before the pages are rendered. The method is called only once.
 * @param {Function} _callbackError The function that must be called if an error occurs. The function has one argument which is the error message.
 */
AudioTestPage.prototype.init = function (_callbackError) {
    console.log("Init!");
};

AudioTestPage.prototype.checkInputs = function() {
  var correctValues = [
    [5, "left"],
    [2, "right"],
    [9, "left"],
    [7, "right"],
    [1, "right"],
    [1, "left"],
    [4, "right"],
    [3, "left"],
    [8, "left"],
    [0, "right"]
  ];

  var pass = true;
  if (this.audio_inputs.length == 0) {
    pass = false;
  }

  for (let i = 0; i < this.audio_inputs.length; i++) {
    var val = this.audio_inputs[i];
    var valCorrect = correctValues[i];
    if (val.channel != valCorrect[1] || val.number != valCorrect[0])
    {
      pass = false;
    }
  }

  // If 'this.audio_inputs.length' > 10 but user correctly picked all 10, let them pass.
  console.log("PASSED:" + pass);
}

AudioTestPage.prototype.playAudio = function() {
  // Reset the inputs when playback starts
  this.audio_inputs = [];

  // Play audio file
  var audio = new Audio("design/audio/stereo_check_slow.mp3");
  audio.play();
  audio.addEventListener("ended", () => { return this.checkInputs(); });
}

AudioTestPage.prototype.registerNumberInput = function(channel, number)
{
  this.audio_inputs.push({ "channel": channel, "number": number });
};

AudioTestPage.prototype.render = function (_parent) {
  console.log("Render!");
  var div = $("<div></div>");
  _parent.append(div);

  var audioPlayer = $("<div></div>");
  div.append(audioPlayer);
  var audioPlayBtn = $("<button class='audio-button'>Play</button>");
  audioPlayer.append(audioPlayBtn);
  audioPlayBtn.on("click", () => { return this.playAudio() });

  var audioControls = $("<div></div>");
  div.append(audioControls);
  
  var leftColumn = $("<div class='channel-column'></div>");
  var rightColumn = $("<div class='channel-column'></div>");
  audioControls.append(leftColumn);
  audioControls.append(rightColumn);

  leftColumn.append($("<p>Left audio channel</p>"));
  rightColumn.append($("<p>Right audio channel</p>"));

  var leftNumberGrid = $("<div class='number-grid'></div>");
  var rightNumberGrid = $("<div class='number-grid'></div>");
  leftColumn.append(leftNumberGrid);
  rightColumn.append(rightNumberGrid);

  // Create number buttons
  for (let i = 0; i < 10; i++) {
    var buttonLeft = $("<button class='number-button'>" + i + "</button>");
    var buttonRight = $("<button class='number-button'>" + i + "</button>");
    buttonLeft.on("click", () => { return this.registerNumberInput("left", i); });
    buttonRight.on("click", () => { return this.registerNumberInput("right", i); });
    leftNumberGrid.append(buttonLeft);
    rightNumberGrid.append(buttonRight);
  }

  // Add CSS styling
  audioControls.css({
    display: "flex",
    justifyContent: "center",
    columnGap: "120px",
    flex: "wrap"
  });

  $(".channel-column").css(
    {
    }
  )

  $(".number-grid").css({
    display: "grid",
    gridTemplateRows: "repeat(2, 1fr)",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    borderColor: "black",
    borderStyle: "solid"
  });

  $(".number-button").css({
    width: "3em",
    margin: "0"
  });

  $(".audio-button").css({
    width: "auto",
    margin: "0",
    textAlign: "center",
    display: "inline-block"
  });
};

/**
 * This method is called after the page is rendered. The purpose of this method is to load default values or saved values of the input controls. 
 */
AudioTestPage.prototype.load = function () {
  console.log("Load!");
};

/**
 * This method is called just before the next page is presented to the user. In case values of input controls are needed for rerendering, they must be saved within in method. 
 */
AudioTestPage.prototype.save = function () {
  console.log("Save!");
};

/**
 * @param {ResponsesStorage} _reponsesStorage
 */
AudioTestPage.prototype.store = function (_reponsesStorage) {
  console.log("Store!");
};
