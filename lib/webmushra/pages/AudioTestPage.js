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

    this.audio = new Audio("design/audio/stereo_check_slow.mp3");
    this.audio.addEventListener("ended", () => { this.resetAudio(); });

    this.audio_inputs = [];
    this.failedAttempts = 0;
  
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

AudioTestPage.prototype.lockUndoBtn = function() {
  $('#audio_undo_button').attr('disabled', 'disabled');
};

AudioTestPage.prototype.unlockUndoBtn = function() {
  $('#audio_undo_button').removeAttr('disabled');
};

AudioTestPage.prototype.lockCheckBtn = function() {
  $('#audio_check_button').attr('disabled', 'disabled');
};

AudioTestPage.prototype.unlockCheckBtn = function() {
  $('#audio_check_button').removeAttr('disabled');
};

AudioTestPage.prototype.lockNumpads = function() {
  $('.number-button').attr('disabled', 'disabled');
}

AudioTestPage.prototype.unlockNumpads = function() {
  $('.number-button').removeAttr('disabled');
}

AudioTestPage.prototype.onTestSuccess = function() {
  console.log("Success");
  this.highlightEntries("#00FF00");
  this.pageTemplateRenderer.unlockNextButton();
  this.lockCheckBtn();
  this.lockNumpads();
  this.setInfoText("Correct!"
    + "<br>You passed the audio test! Please press \"Next\" below to proceed with the study.", "#00DD00");
  $('#audio_undo_button').attr('disabled', 'disabled');
};

AudioTestPage.prototype.onTestFailed = function() {
  this.failedAttempts++;
  this.highlightEntries("red");
  if (this.failedAttempts <= 2) {
    // Give user one more change
    this.lockCheckBtn();
  } else {
    this.pageManager.failedAudioTest = true;
    var remoteFailService = this.config.remoteFailService;
    var userId = this.config.userId;
    var testId = this.config.testId;
    var session = this.session;
    this.pageManager.tryTerminateStudy(remoteFailService, userId, testId, session);
  }
  this.setInfoText("Incorrect!"
  + "<br>Please wear headphones and make sure they are placed correctly on your head (left / right ear)."
  + "<br>Press \"Undo\" repeatedly to change your entries.", "#FF0000");
};

AudioTestPage.prototype.validateEntries = function() {
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
  if (this.audio_inputs.length != 10) {
    pass = false;
  }

  if (this.audio_inputs.length == 10) {
    for (let i = 0; i < 10; i++) {
      var val = this.audio_inputs[i];
      var valCorrect = correctValues[i];
      if (val.channel != valCorrect[1] || val.number != valCorrect[0])
      {
        pass = false;
      }
    }
  }

  if (pass) {
    this.onTestSuccess();
  } else {
    this.onTestFailed();
  }
};

AudioTestPage.prototype.setInfoText = function(html, color) {
  $("#info-text").html(html);
  $("#info-text").css({
    color: color
  });
}

AudioTestPage.prototype.resetAudio = function() {
  this.audio.pause();
  this.audio.currentTime = 0;
  $("#audio_play_button").text("Play");
};

AudioTestPage.prototype.playAudio = function() {
  if (this.audio.paused) {
    this.audio.play();
    $("#audio_play_button").text("Stop");
  } else {
    this.resetAudio();
  }
};

AudioTestPage.prototype.registerNumberInput = function(channel, number)
{
  this.unlockUndoBtn();

  if (this.audio_inputs.length < 10) {
    var rowID = this.audio_inputs.length;

    if (channel == "left") {
      this.writeCellEntry(rowID, 0, number, "#EEEEEE");
      this.writeCellEntry(rowID, 1, "-", "#EEEEEE");
    } else {
      this.writeCellEntry(rowID, 0, "-", "#EEEEEE");
      this.writeCellEntry(rowID, 1, number, "#EEEEEE");
    }
    this.writeCellEntry(rowID + 1, 0, " ", "#FFC864");
    this.writeCellEntry(rowID + 1, 1, " ", "#FFC864");
    
    // Track the inputs and unlock check if all filled
    this.audio_inputs.push({ "channel": channel, "number": number });
  }

  if (this.audio_inputs.length == 10) {
    this.unlockCheckBtn();
    this.lockNumpads();
  }
};

AudioTestPage.prototype.undoEntry = function() {
  if (this.audio_inputs.length > 0) {
    var rowID = this.audio_inputs.length;
    this.audio_inputs.pop();
    this.writeCellEntry(rowID - 1, 0, " ", "#FFC864");
    this.writeCellEntry(rowID - 1, 1, " ", "#FFC864");
    this.writeCellEntry(rowID, 0, " ", "#FFFFFF");
    this.writeCellEntry(rowID, 1, " ", "#FFFFFF");
    this.unlockNumpads();
    this.lockCheckBtn();
    this.unhighlightEntries();
  }

  if (this.failedAttempts == 1) {
    this.setInfoText("You have two attempts left!", "#000000");
  } else if (this.failedAttempts >= 2) {
    this.setInfoText("You have one attempt left!", "#000000");
  }

  if (this.audio_inputs.length == 0) {
    this.lockUndoBtn();
  }
}

AudioTestPage.prototype.resetEntries = function() {
  this.audio_inputs = [];
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 10; j++) {
      this.writeCellEntry(j, i, " ", "#FFFFFF");
    }
  }

  this.writeCellEntry(0, 0, " ", "#FFC864");
  this.writeCellEntry(0, 1, " ", "#FFC864");
  this.lockCheckBtn();
  this.lockUndoBtn();
  this.unlockNumpads();
  this.unhighlightEntries();
  this.setInfoText("", "#FFFFFF");
};

AudioTestPage.prototype.unhighlightEntries = function() {
  $("#entry-table").css({
    outline: 0
  });
}

AudioTestPage.prototype.highlightEntries = function(color) {
  $("#entry-table").css({
    outline: "4px solid " + color,
  });
}

AudioTestPage.prototype.writeCellEntry = function(row, col, val, color) {
  if (col == 0 || col == 1) {
    if (row >= 0 && row < 10) {
      var cell = $("#entry-table tr:eq(" + row + ") td:eq(" + col + ")");
      cell.text(val);
      cell.css(
        {
          backgroundColor: color,
          fontWeight: "bold"
        }
      );
    }
  }
};

AudioTestPage.prototype.render = function (_parent) {
  var instructionDiv = $("<div id='instructions'></div>");
  _parent.append(instructionDiv);
  instructionDiv.append(this.pageConfig.content);
  $("#instructions").css({
    marginTop: "2em",
    marginBottom: "4em"
  });

  var div = $("<div></div>");
  _parent.append(div);

  var audioControls = $("<div></div>");
  div.append(audioControls);
  
  var leftColumn = $("<div class='channel-column'></div>");
  var middleColumn = $("<div class='channel-column'></div>");
  var rightColumn = $("<div class='channel-column'></div>");
  audioControls.append(leftColumn);
  audioControls.append(middleColumn);
  audioControls.append(rightColumn);

  leftColumn.append($("<p class='col-header'>LEFT<br>(audio channel)</p>"));
  middleColumn.append($("<p class='col-header'>Your input so far:</p>"));
  rightColumn.append($("<p class='col-header'>RIGHT<br>(audio channel)</p>"));

  var entriesGrid = $("<table id='entry-table' class='column-grid'></table>");
  middleColumn.append(entriesGrid);

  for (var i = 0; i < 10; i++) {
    var row = $("<tr class='entry-row'></tr>");
    row.css({
      borderStyle: "solid",
      borderColor: "red"
    });

    for (var j = 0; j < 2; j++) {
      var cell = $("<td class='entry-cell'></td>");
      cell.text(" ");
      row.append(cell);
    }

    entriesGrid.append(row);
  }

  var leftNumberGrid = $("<div class='number-grid column-grid'></div>");
  var rightNumberGrid = $("<div class='number-grid column-grid'></div>");
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
  var infoDiv = $("<div><span id='info-text'></span></div>");
  div.append(infoDiv);
  infoDiv.css({
    marginTop: "2em",
    height: "2em"
  });

  var entryControls = $("<div></div>");
  div.append(entryControls);
  entryControls.css({
    marginTop: "1em"
  });
  var playBtn = $("<button id='audio_play_button' class='control-button'>Play</button>");
  var undoBtn = $("<button id='audio_undo_button' class='control-button'>Undo</button>");
  var checkBtn = $("<button id='audio_check_button' class='control-button'>Verify</button>");
  entryControls.append(undoBtn);
  entryControls.append(playBtn);
  entryControls.append(checkBtn);
  playBtn.on("click", () => { return this.playAudio(); });
  undoBtn.on("click", () => { return this.undoEntry(); });
  checkBtn.on("click", () => { return this.validateEntries(); });

  // Add CSS styling
  audioControls.css({
    display: "flex",
    justifyContent: "center",
    columnGap: "120px",
    flex: "wrap"
  });

  $(".col-header").css(
    {
      height: "2em",
    }
  );

  $("#entry-table").css(
    {
      width: "100%",
      height: "auto",
      borderSpacing: "0",
      borderBottom: "2px solid black",
      borderRight: "2px solid black"
    }
  );

  $(".entry-cell").css(
    {
      height: "10%",
      width: "50%",
      borderTop: "2px solid black",
      borderLeft: "2px solid black"
    }
  );

  $(".channel-column").css(
    {
      width: "10em"
    }
  );

  $(".column-grid").css(
  {
    height: "20em"
  });

  $(".number-grid").css({
    display: "grid",
    gridTemplateRows: "repeat(5, 1fr)",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  });

  $(".number-button").css({
    margin: "0"
  });

  $(".control-button").css({
    width: "auto",
    margin: "0",
    marginLeft: "2.5em",
    marginRight: "2.5em",
    textAlign: "center",
    display: "inline-block"
  });

  $("#audio_play_button").css({
    width: "6em",
    height: "3em",
    marginTop: "3em",
    marginBottom: "2em"
  });
};

/**
 * This method is called after the page is rendered. The purpose of this method is to load default values or saved values of the input controls. 
 */
AudioTestPage.prototype.load = function () {
  this.resetEntries();
  this.pageTemplateRenderer.lockNextButton();
};

/**
 * This method is called just before the next page is presented to the user. In case values of input controls are needed for rerendering, they must be saved within in method. 
 */
AudioTestPage.prototype.save = function () {
};

AudioTestPage.prototype.postCheck = function() {
  var remoteFailService = this.config.remoteFailService;
  var userId = this.config.userId;
  var testId = this.config.testId;
  var session = this.session;
  this.validateEntries();  
  return this.pageManager.tryTerminateStudy(remoteFailService, userId, testId, session);
};

/**
 * @param {ResponsesStorage} _reponsesStorage
 */
AudioTestPage.prototype.store = function (_reponsesStorage) {
};
