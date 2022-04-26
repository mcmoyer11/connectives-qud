PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence(
       "Instructions",
       "StoryIntro1",
       "StoryIntro2",
       rshuffle("training"),
                "TrainEnd",
       rshuffle(
           rshuffle("critical"),
           rshuffle("fillers")
       ),
       SendResults(),
        "end")


// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("Instructions",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("<p>Hello! Welcome to the experiment!</p>")
        .bold()
    ,
    newText("In this task, you will hear about two friends learning to play a game.")
    ,
    newText("You will help them learn by answering questions about how they played.")
    ,
    // newText("You will see the two friends talk to each other. The things ")
    // ,
    newText("<p>Are you ready?</p>")
    ,
    newText("Please type in your ID below.")
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        // .before( newText("before", "<p>Please enter your unique participant ID. </p>") )
        .print()
    ,
    newText("warning", "Please enter your ID first")
        .color("red")
        .bold()
        .remove()
    ,
    newButton("consent button", "By clicking this button I indicate my consent.")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait(  // Make sure the TextInput has been filled
            getTextInput("inputID")
                .testNot.text("")
                .failure( getText("warning").print() )
        )
    ,
    // Store the text from inputID into the Var element
    getVar("inputID").set( getTextInput("inputID") )
)


// Instructions
newTrial("StoryIntro1",
    defaultText.center().print()
    ,
    newText("Two friends, Dana and Fox, are playing a guessing game.")
    ,
    newText("<p> </p>")
    ,
    newText("One of them will pick three letters at random from a bag of all the letters.")
    ,
    newText("The other person won't know what letters are picked, they'll have to guess.")
    ,
    newText("However, you will see the three letters at the top of each screen.")
    ,
    newText("<p> </p>")
    ,
    newText("Next, the friend that didn't pick letters will ask a <b>question</b> about them.")
    ,
    newText("The person who picked the letters will then <b>answer</b> the question.")
    ,
    newText("Press the space bar to see each line of the dialogue.")
    ,
    newText("<p> </p>")
    ,
    newText("<p> </p>")
    ,
    newText("(Press the space bar to see the next page of instructions.)")
    ,
    newKey(" ")
        // .log()
        .wait()
        // .log()
)

// Instructions
newTrial("StoryIntro2",
    defaultText.center().print()
    ,
    newText("Importantly, you will <b>press the space bar</b> to see the answer that was given.")
    ,
    newText("The sentence will be revealed in chunks.")
    ,
    newText("Press the space bar to reveal each chunk of the answer.")
    ,
    newText("<p> </p>")
    ,
    newText("<b>Your job will then be to determine whether that answer is true, </b>")
    ,
    newText("<b>considering the question asked.</b>")
    ,
    newText("Using the keyboard, press '<b>F</b>' to <b>agree</b> and '<b>J</b> to <b>disagree</b>.")
    ,
    newText("<p> </p>")
    ,
    newText("Please respond <b>as quickly as possible</b>.")
    ,
    newText("Position your left index finger on the 'F' key, the right on 'J', and a thumb on the space bar.")
    ,
    newText("Keep your fingers in these positions throughout the whole experiment.")
    ,   
    newText("<p> </p>")
    ,
    newImage("https://filedn.com/lDf2Oa0trFMzhcSFiv5VDuu/ibex/fingers.png")
        .center()
        .print()
    ,
    newText("<p> </p>")
    ,
    newText("<p>Before starting, let's practice!</p>")
    ,
    newText("Press the space bar to begin practice.")
    ,
    newKey(" ")
        // .log()
        .wait()
        // .log()
)


    
// Training trials
Template( "train.csv", row =>
        newTrial("training",
            newText(`<p><b> PRACTICE</b>.</p>`)
                .center()
                .print()
            ,
            newText("Word", `<p>${row.Answerer} pulls out <b> ${row.Letters}</b>.</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait()
                // .log()
            ,
            newText("QUD", `<p><b>${row.Questioner} asks</b>: "${row.QUD}"</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait()
                // .log()
            ,
            newText("Answerer", `<p><b>${row.Answerer} responds</b>:</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait(75)
                // .log()
            ,
            newController("DashedSentence", {s : [`${row.AnswerConj1}`, `${row.AnswerConj2}`]})
                .center()
                .print()
                .log()      // Make sure to log the participant's progress
                .wait()
            ,
            newText("Judgement", `<p>Did ${row.Answerer} respond truthfully? </p>`)
                .center()
                .print()
            ,
            newText("<p>Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
                .center()
                .print()
            ,
            newKey("select","FJ")
                .log()
                .wait()
                .log()
            ,
            getKey("select")
                .test.pressed(row.CorrectResponse)
                .success(
                    newText("correct","Right answer!")
                        .italic()
                        .center()
                        .print()
                        )
                .failure(
                    newText("false","Wrong answer!")
                        .color("red")
                        .center()
                        .print()
                        )
            ,
            newTimer("wait", 1500)
                .start()
                .wait()
            ,
            getText("correct")
                .remove()
            ,
            getText("false")
                .remove()
        )
        .log( "ID" , getVar("ID") )
        .log( "TrialType" , row.TrialType )
        .log( "Number" , row.Number)
        .log( "Letters" , row.Letters )
        .log( "QUD" , row.QUD )
        .log( "AnswerConj1" , row.AnswerConj1 )
        .log( "AnswerConj2" , row.AnswerConj2 )
        .log( "QUDTruth", row.QUDTruth)
        .log( "AnswerRelevance", row.AnswerRelevance)
        .log( "Conj" , row.Conj )
)
    
    
    
// Instructions
newTrial("TrainEnd",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("<p>Great Job!</p>")
    ,
    newText("Press the space bar to begin the experiment.")
    ,
    newKey(" ")
        // .log()
        .wait()
        // .log()
)

// critical test trials
Template( "critical_specificQUD.csv", row =>
        newTrial("critical",
            newText("Word", `<p>${row.Answerer} pulls out <b> ${row.Letters}</b>.</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait()
                // .log()
            ,
            newText("QUD", `<p><b>${row.Questioner} asks</b>: "${row.QUD}"</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait()
                // .log()
            ,
            newText("Answerer", `<p><b>${row.Answerer} responds</b>:</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait(75)
                // .log()
            ,
            newController("DashedSentence", {s : [`${row.AnswerConj1}`, `${row.AnswerConj2}`]})
                .center()
                .print()
                .log()      // Make sure to log the participant's progress
                .wait()
            // .remove()
            ,
            newText("Judgement", `<p>Did ${row.Answerer} respond truthfully? </p>`)
                .center()
                .print()
            ,
            newText("<p> Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
                .center()
                .print()
            ,
            newKey("select","FJ")
                .log()
                .wait()
                .log()
            // ,
            // newTimer(500)
            //     .start()
            //     .wait()
        )
        .log( "ID" , getVar("ID") )
        .log( "TrialType" , row.TrialType )
        .log( "Number" , row.Number)
        .log( "Letters" , row.Letters )
        .log( "QUD" , row.QUD )
        .log( "AnswerConj1" , row.AnswerConj1 )
        .log( "AnswerConj2" , row.AnswerConj2 )
        .log( "QUDTruth", row.QUDTruth)
        .log( "AnswerRelevance", row.AnswerRelevance)
        .log( "Conj" , row.Conj )
)

// fillers
Template( "fillers.csv", row =>
        newTrial("fillers",
            newText("Word", `<p>${row.Answerer} pulls out <b> ${row.Letters}</b>.</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait()
                // .log()
            ,
            newText("QUD", `<p><b>${row.Questioner} asks</b>: "${row.QUD}"</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait()
                // .log()
            ,
            newText("Dana", `<p><b>${row.Answerer} responds</b>:</p>`)
                .center()
                .print()
            ,
            newKey(" ")
                // .log()
                .wait(50)
                // .log()
            ,
            newController("DashedSentence", {s : [`${row.AnswerConj1}`, `${row.AnswerConj2}`]})
                .center()
                .print()
                .log()      // Make sure to log the participant's progress
                .wait()
            // .remove()
            ,
            newText("Judgement", `<p>Did ${row.Answerer} respond truthfully? </p>`)
                .center()
                .print()
            ,
            newText("<p> Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
                .center()
                .print()
            ,
            newKey("select","FJ")
                .log()
                .wait()
                .log()
        )
        .log( "ID" , getVar("ID") )
        .log( "TrialType" , row.TrialType )
        .log( "Number" , row.Number)
        .log( "Letters" , row.Letters )
        .log( "QUD" , row.QUD )
        .log( "AnswerConj1" , row.AnswerConj1 )
        .log( "AnswerConj2" , row.AnswerConj2 )
        .log( "QUDTruth", row.QUDTruth)
        .log( "AnswerRelevance", row.AnswerRelevance)
        .log( "Conj" , row.Conj )
)

// Final screen
newTrial("end",
    newText("Thank you for your participation!")
        .center()
        .print()
    ,
    // This link a placeholder: replace it with a URL provided by your participant-pooling platform
    newText("<p><a href='https://www.pcibex.net/' target='_blank'>Click here to validate your submission</a></p>")
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false)