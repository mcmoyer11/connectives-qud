PennController.ResetPrefix(null); // Initiates PennController
PennController.DebugOff()
// BOTT & NOVECK TRIALS
// A SEQUENCE

// Sequence("intro","consent", "demo","instructions","Train_simple","instructions2", "Train", "end_train", rshuffle("test"), "send", "end")
Sequence("test")


// This only works when I don't embed a DashedSentence in a newController()
var defaults = [
    "DashedSentence", {mode: "speeded acceptability", wordTime: 250}
    ];


newTrial("intro",
    defaultText
        .center()
        .print()
    ,
    newText("<p><strong>Welcome to the Experiment!</strong></p>")
    ,
    newText("<p>You will only receive extra credit points for completing <strong>all three parts.</strong></p>")
    ,
    newText("<p>This experiment requires the use of a keyboard to register responses.</p>") 
    ,
    newText("<p>So you <strong>MUST</strong> be on a laptop, desktop computer, or tablet device with a detachable keyboard.</p>")
    ,
    newText("<p>Do not use a cell phone, or tablet without detachable keyboard.</p>")
    ,
    newButton("Proceed to the Consent Form")
        .center()
        .print()
        .wait()
)
.setOption("hideProgressBar", true); // Do not show the progress bar on first screen

newTrial("consent",
    newHtml("consent.html")
        .log()
        .print()
    ,
    newTextInput("ID")
        .log()
        .before( newText("before", "<p>Please enter your unique participant ID</p>") )
        .center()
        .print()
    ,
    newText("warning", "Please enter your ID first")
        .color("red")
        .bold()
    ,
    newButton("consent button", "By clicking this button I indicate my consent")
        .center()
        .print()
        .wait(  // Make sure the TextInput has been filled
            getTextInput("ID")
                .testNot.text("")
                .failure( getText("warning").print() )
        )
    ,   // Create a Var element before going to the next screen
    newVar("ID")
        .global()          // Make it globally accessible
        .set( getTextInput("ID") )
)
.log( "ID" , getVar("ID") )
.setOption("hideProgressBar", true); // Do not show the progress bar on first screen

newTrial("demo",
    defaultText
        .center()
        .print()
    ,
    newTextInput("NativeLang")
        .log()
        .before( newText("before", "Please enter your native language.") )
        .center()
        .print()
    ,
    newText("warning", "Please enter your native language.")
        .color("red")
        .bold()
    ,
    newTextInput("OtherLangs")
        .before( newText("before", "Do you speak any other languages?") )
        .center()
        .print()
    ,
    newButton("Start")
        .center()
        .print()
        .wait(  // Make sure the TextInput has been filled
            getTextInput("NativeLang")
                .testNot.text("")
                .failure( getText("warning").print() )
        )
    ,
    newVar("NativeLang")
        .global()
        .set( getTextInput("NativeLang") )
    ,
    newVar("OtherLangs")
        .global()
        .set( getTextInput("OtherLangs") )
)
.log( "NativeLang" , getVar("NativeLang") )
.log( "OtherLangs" , getVar("OtherLangs") )
.setOption("hideProgressBar", true); // Do not show the progress bar on first screen


newTrial("instructions",
    defaultText
        .center()
        .print()
    ,
    newText("<p>In these first two parts, we will ask you to decide whether you agree or disagree with a statement.</p>")
    ,
    newText("<p>If you <strong>Agree</strong> with the sentence, press <strong>F</strong>. If you <strong>Disagree</strong>, then press <strong>J</strong><p>")
    ,
    newText("<p>Let's practice.<p>")
    ,
    newButton("Click here when you're ready to Continue.")
        .center()
        .print()
        .wait()
)

Template( "train_table2.csv", row =>
    newTrial("Train_simple",
        newText("<p><strong>PRACTICE</strong></p>")
            .center()
            .print()
        ,
        newText(row.Sentence)
            .center()
            .print()
        ,
        newText("<p> Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
            .center()
            .print()
        ,
        newText(row.Feedback)
            .center()
            .print()
        ,
        newSelector()
            .add( newText("Agree"), newText("Disagree"))
            .keys("F", "J")
            .log("first")
            .wait()
    )
    .log( "ID" , getVar("ID") )
    .log( "Type" , row.Type )
    .log( "Sentence" , row.Sentence )
    .log( "Feedback" , row.Feedback )
)



newTrial("instructions2",
    defaultText
        .center()
        .print()
    ,
    newText("<p>In the actual experiment, the statement will be revealed <strong>automatically</strong>, one word at a time.</p>")
    ,
    newText("<p>As each new word appears, the previous word will disappear.</p>")
    ,
    newText("<p><strong>This will happen quickly, so be sure to pay attention</strong>.</p>")
    ,
    newText("<p>Let's practice.</p>")
    ,
    newButton("Click for the next phase of practice.")
        .center()
        .print()
        .wait()
)


Template( "train_table.csv", row =>
    [
        "Train",
        "DashedSentence", {s: row.Sentence},
        "PennController", newTrial("question",    
            newText("<p> Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
                .center()
                .print()
            ,
            newText(row.Feedback)
                .center()
                .print()
                .log( "Feedback" , row.Feedback )
            ,
            newSelector()
                .add( newText("Agree"), newText("Disagree"))
                .keys("F", "J")
                .log("first")
                .wait()
            )
            .log( "ID" , getVar("ID") )
            .log( "Type" , row.Type )
            .log( "Sentence" , row.Sentence )
            .log( "Feedback" , row.Feedback )
    ]
)




newTrial("end_train",
    defaultText
        .center()
        .print()
    ,    
    newText("<p>Great Job!</p>")
    ,
    newText("<p><strong>Once you begin the experiment, you should not stop until you finish.</strong></p>")
    ,
    newText("<p>Only begin when you are ready.</p>")
    ,
    newButton("Click here to start the experiment")
        .center()
        .print()
        .wait()
)

// This works to get speeded acceptability
Template( "conn_qud_table.csv", row =>
    ["test",
        "DashedSentence", {s: `${row.Matrix} ${row.Quantifier} ${row[row.Subject.replace("Category",row.WhichCategory+'Category')]} are ${row[row.Predicate.replace("Category",row.WhichCategory+'Category')]}`},
        "PennController", newTrial("question",    
            newText("<p> Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
                .center()
                .print()
            ,
            newSelector()
                .add( newText("Agree"), newText("Disagree"))
                .keys("F", "J")
                .log("first")
                .wait()
        )
        .log( "ID" , getVar("ID") )
        .log( "Study" , row.Study )
        .log( "SentNumber" , row.SentNumber )
        .log( "Quantifier" , row.Quantifier )
        .log( "Matrix" , row.Matrix )
        .log( "WhichCategory" , row.WhichCategory )
        .log( "Subject" , row.Subject )
        .log( "Predicate" , row.Predicate )
        .log( "SentType" , row.SentType )
        .log( "Verb" , row.Verb )
        .log( "Embedded" , row.Embedded )
        .log( "Token" , row.Token )
        .log( "MatchingCategory" , row.MatchingCategory )
        .log( "MismatchingCategory" , row.MismatchingCategory )
        .log( "Group"  , row.Group  )
    ]
)


SendResults( "send" )

newTrial("end",
    newText("You have just completed the first part of the experiment.")
        .center()
        .print()
    ,
    newText("If you need to take a break, do so now before proceeding to part two.")
        .center()
        .print()
    ,
    newText("<p><a href='https://expt.pcibex.net/ibexexps/mcmoyer11/CB_B/experiment.html'>Click here for Part 2/3.</a></p>")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)
.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
