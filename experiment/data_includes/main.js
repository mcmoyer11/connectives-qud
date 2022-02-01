PennController.ResetPrefix(null); // Shorten command names (keep this line here))

// DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence("instructions", rshuffle("experiment_template"), SendResults(), "end")

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines

// Instructions
newTrial("instructions",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("Welcome!")
    ,
    newText("In this task, you will have to read few sentences.")
    ,
    newText("Are you ready?")
    ,
    newText("Please type in your ID below and then click on the Start button to start the experiment.")
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1em")    // Add a 1em margin around this element
        .print()
    ,
    newButton("Start")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
)

Template( "conn_qud_table.csv", row =>
        newTrial("experiment_template",
            newText("Word", `The word is <b> ${row.word}</b>.<br>`)
                .center()
                .print()
            ,
            newText("QUD", `<b>Fox asks</b>: "${row.Fox_A}"`)
                .center()
                .print()
            ,
            newText("Dana", `<b>Dana responds</b>:<br> <br>`)
                .center()
                .print()
            ,
            newText("instructions", "Click on the button below to start reading. Click spacebar to proceed to the next word.")
                .center()
                .print()
            ,
            newButton("Start reading")
                .center()
                .print()
                .wait()
                .remove()
            ,
            getText("instructions")
                .remove()
            ,
            // "DashedSentence", {s: `Dana: ${row.dana}`},
            newController("DashedSentence", {s : `${row.Dana_target_A}`})
                .center()
                .print()
                .log()      // Make sure to log the participant's progress
                .wait()
            // .remove()
            ,
        // "PennController", newTrial("question",    
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
        .log( "TrialType" , row.number )
        .log( "Word" , getVar("Word") )
        .log( "QUD" , row.qud )
        .log( "Target" , row.Dana_target_A )
        .log( "Connective" , row.connective )
)

// First experiment trial
// newTrial( "experiment",
//     newText("instructions", "Click on the button below to start reading. Click spacebar to proceed to the next word.")
//         .print()
//     ,
//     newButton("Start reading")
//         .print()
//         .wait()
//         .remove()
//     ,
//     getText("instructions")
//         .remove()
//     ,
//     // We use the native-Ibex "DashedSentence" controller
//     // Documentation at:   https://github.com/addrummond/ibex/blob/master/docs/manual.md#dashedsentence
//     newText("Letters", "QET")
//         .bold()
//         .center()
//         .print()
//     ,
//     newText("QUD", "Fox: \"Is there a B or a T?\"")
//         .center()
//         .print()
//     ,
//     newController("DashedSentence", {s : "Dana: There is a B but there is a T."})
//         .print()
//         .log()      // Make sure to log the participant's progress
//         .wait()
//         // .remove()
//     ,
//     newText("<p> Press <strong>F</strong> to <strong>Agree</strong> or <strong>J</strong> to <strong>Disagree</strong><p>")
//         .center()
//         .print()
//     ,
//     newSelector()
//         .add( newText("Agree"), newText("Disagree"))
//         .keys("F", "J")
//         .log("first")
//         .wait()
//     ,
//     newButton("Next") 
//         .print()
//         .wait()
// )

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