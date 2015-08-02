// functions on load
if($(window).width() <= 1250){
  alert("Yikes! Your browser screen is awfully small! For the best experience, expand the browser to full screen!")
}
///////////////////////////////////////////////////////////////////////////////////////

// initial functions to submit link

$("#submitButton").click(function(){
    event.preventDefault();
    $(".photo-site").remove();
    var input = $(".URL-input").val()
    console.log(input)
    getJSON(input)
});

function getJSON(x){
   $.ajax({
       url: "http://72.52.222.141/~photosafe/api/?url="+x,
        //force to handle it as text
        dataType: "text",
        success: function(data) {
            // store the parsed json as a variable
            json = $.parseJSON(data);
            console.log(json)
            whichSite(json)
        }
    });
}
function whichSite() {
    if (json.domain == "www.flickr.com"){
        $("form").append("<div class='photo-site'>This photo is from Flickr! It's license type is " + json.license + ".</div>")
        if (json.license === "Attribution-NonCommercial-NoDerivs License"){
            FlickrANNDisplay(FlickrANNQuestions.q1);
        }
    } else if (json.domain == "instagram.com") {
        $("form").append("<div class='photo-site'>This photo is from Instagram!</div>")
        $("#question-container").html("This photo is from Instagram!")
        InstaDisplay(InstaQuestions.q1);
    } else {
        $("#question-container").html("We don't recognize that site!")
    }
    $.scrollTo(".photo-site", 800);
}


///////////////////////////////////////////////////////////////////////////////////////

// instagram functions


InstaQuestions = {
   q1: {
		question: "How do you plan to access this photo?",
		answers: ["Embed it from Instagram", "Save and re-upload it"]
	  },
   save: {
		question: "Would you prefer to embed it instead?",
		answers: ["Yes", "No"]
   },
  allowed: {
	   image: "img/green.png",
       answers: ["Allowed!"]
   },
  no: {
       image: "img/red.png",
       answers: ["This photo is only authorized for embedding.  Please contact the owner for more information."]
  }
}

function InstaDisplay(q){
    $("#question-container").html(q.question);
    displayAnswers(q.answers);
// handle click on first question
    $(".answer-button").click(function(){
        // option 1 click for question 1
        if ($(this).html() == "Save and re-upload it"){
            InstaDisplay(InstaQuestions.save)
            $(".answer-button").click(function(){
                // option 1 click for question 2
                if ($(this).html() == "No"){
                    displayOurAnswer(InstaQuestions.no)
                // option 2 click for question 2
                }
                if ($(this).html() == "Yes") {
                    displayOurAnswer(InstaQuestions.allowed)
                }
            });
        // option 2 click for question 1
        }
        if ($(this).html() == "Embed it from Instagram"){
            displayOurAnswer(InstaQuestions.allowed);
        }
    }); // closes fist click event
} // closes display


function displayAnswers(v) {
    $("#answers-container").children().remove();
    for (var i =0; i < v.length; i++){
        $("#answers-container").append("<div class='answer-button'>" + v[i] +"</div>" )
    }
}

function displayOurAnswer(v){
    $.scrollTo("#canYouUse", 800)
    $('#canYouUse').prepend($('<img>',{id:'logo-image',src: v.image}))
    $("#ourAnswer").html(v.answers)
}


///////////////////////////////////////////////////////////////////////////////////////
// Flickr

FlickrANNQuestions = {
    q1: {
        question: "What is the proposed use for this photo?",
        answers: ["Editorial", "Personal", "Social", "Business"]
    },
    editorialOrPersonal: {
        question: "Will you edit the photo prior to use?",
        answers: ["Yes", "No"]
    },
	editing: {
		image: "img/red.png",
		answers: ["This image is not allowed to be edited.  Please contact the owner for more information."]
	},
    notEditing: {
		question: "Are there any identifiable faces in the photo?",
		answers: ["Yes", "No"]
    },
	recognizablePeople: {
		question: "Are the people in the image considered public figures, or are they people attending a public event?",
		answers: ["Yes", "No"]
    },
	noPeople: {
		image: "img/green.png",
		answers: ["Allowed!"]
	},
    atPublicEvent: {
		image: "img/green.png",
		answers: ["Allowed!"]
    },
	notPublic: {
		image: "img/yellow.gif",
		answers: ["We don't recommend that you use this photo."]
	},
    social: {
		image: "img/yellow.gif",
		answers: ["We don't recommend that you use this photo. Social media is the Wild West, and this photo's license may not cover you."]
    },
	business: {
		image: "img/red.png",
		answers: ["This photo is not authorized for business use. Please contact owner for more information."]
   }
}

// function for Attribution-NonCommercial-NoDerivs  license

function FlickrANNDisplay(q){
    $("#question-container").html(q.question);
    displayAnswers(q.answers);
// handle click on first question
    $(".answer-button").click(function(){
        if ($(this).html() == "Editorial" || $(this).html() == "Personal"){
            FlickrANNDisplay(FlickrANNQuestions.editorialOrPersonal);
            $(".answer-button").click(function(){
                if ($(this).html() == "Yes"){
                    displayOurAnswer(FlickrANNQuestions.editing);
                } else {
                    FlickrANNDisplay(FlickrANNQuestions.notEditing);
                    $(".answer-button").click(function(){
                        if ($(this).html() == "Yes"){
                            FlickrANNDisplay(FlickrANNQuestions.recognizablePeople);
                            $(".answer-button").click(function(){
                                if ($(this).html() == "Yes"){
                                    displayOurAnswer(FlickrANNQuestions.atPublicEvent);
                                } else {
                                    displayOurAnswer(FlickrANNQuestions.notPublic);
                                }
                            });
                        } else {
                            displayOurAnswer(FlickrANNQuestions.noPeople);
                        } // closes else
                    });
                }
            });
        }
        if ($(this).html() == "Social"){
            displayOurAnswer(FlickrANNQuestions.social);
        }
        if ($(this).html() == "Business"){
            displayOurAnswer(FlickrANNQuestions.business);
        }
        // option 1 click for question 1
        // if ($(this).html() == "Editorial"){
        //     InstaDisplay(InstaQuestions.save)
        //     $(".answer-button").click(function(){
        //         // option 1 click for question 2
        //         if ($(this).html() == "No"){
        //             InstaDisplay(InstaQuestions.no)
        //         // option 2 click for question 2
        //         } else {
        //             InstaDisplay(InstaQuestions.q3)
        //         }
        //     });
        // // option 2 click for question 1
        // } else{
        //     InstaDisplay(InstaQuestions.q3);
        // }
    }); // closes fist click event
} // closes Flickrdisplay
function displayAnswers(v) {
    $("#answers-container").children().remove();
    for (var i =0; i < v.length; i++){
        $("#answers-container").append("<div class='answer-button'>" + v[i] +"</div>" )
    }
}






//    displayAnswers(clickCounter);

// $(Questions.q1.answers[1]).click(displayNext());
// if the click is on the second answer


//
// $('#question').html()
// question: how will you use?
//     if click on 'personal'
//         $('#question').html(2)
//     else click on 'commercial'
//         $('#question').html(3)
//
//     if click on "modify"
//         answer NO you can't use
//     if click on "embed"
//         answer YES you can use
