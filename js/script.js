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
    getJSON(input)
});

$("#resetButton").on("click", function(){
    reset();
});


function getJSON(x){
   $.ajax({
       url: "http://photoright.co/api/?url="+x,
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
        $('#canYouUse').append($("<p class='contact'>You can contact the owner <a href='" + json.owner + "'>here</a>.</p>"))
        if (json.license === "Attribution-NonCommercial-NoDerivs License"){
            $("form").append("<div class='photo-site'>This photo is from Flickr! It's license type is " + json.license + ". That's a Creative Commons <a href='https://creativecommons.org/licenses/by-nc-nd/2.0/'>license</a>, so we have a few more questions.</div>")
            // $("form").append($('<img>',{id:'license-image', src: "../img/ann.png"}));
            FlickrANNDisplay(FlickrANNQuestions.q1);
        } else if (json.license === "All Rights Reserved"){
            $("#canYouUse").css("display", "none");
            $('#canYouUse').prepend($('<img>',{id:'logo-image', src: '../img/red.png'}))
            $("#qa-container").css("display", "none");
            $("form").append("<div class='photo-site'>Unfortunately, this means that you cannot use this photo without explicit permission from the <a href='" + json.owner + "'>owner</a>. We recommend using a different photo or contacting the owner for permission.</div>");
        } else if (json.license === "Attribution License"){
            $("#canYouUse").css("display", "none");
            $("#qa-container").css("display", "none");
            $("form").append("<div class='photo-site'>This photo is from Flickr! It's license type is " + json.license + ". It has a Creative Commons <a href='https://creativecommons.org/licenses/by/4.0/'>license</a> that lets you distribute, remix, tweak, and build upon this work, even commercially, as long as you offer credit to the original owner.</div>")
            // $("form").append($('<img>',{id:'license-image', src: "img/attribution.png"}));
        } else {
            $("#canYouUse").css("display", "none");
            $("#qa-container").css("display", "none");
            $("form").append("<div class='photo-site'>This photo is from Flickr! It's license type is " + json.license + ". It has a <a href='https://creativecommons.org/licenses/'>Creative Commons license</a>, but we haven't built out functionality for that license yet. We recommend checking the license before using this image.</div>")
        }
    } else if (json.domain == "instagram.com") {
        $("form").append("<div class='photo-site'>This photo is from Instagram!</div>");
        $("#question-container").html("This photo is from Instagram!");
        $('#canYouUse').append($("<p class='contact'>You can contact the owner <a href='" + json.owner + "'>here</a>.</p>"))
        InstaDisplay(InstaQuestions.q1);
    } else {
        $("#canYouUse").css("display", "none");
        $('#canYouUse').prepend($('<img>',{id:'logo-image', src: '../img/red.png'}))
        $("#qa-container").css("display", "none");
        $("form").append("<div class='photo-site'>We don't recognize that site or the photo's license!</div>");
    }
    $.scrollTo(".photo-site", 800);
}

function displayOurAnswer(v){
    $.scrollTo("#canYouUse", 800)
    $('#canYouUse').prepend($('<img>',{id:'logo-image',src: v.image}))
    // $("#canYouUse").prepend($('<img>',{id:'logo-image',src: v.license}))
    $("#ourAnswer").html(v.answers)
}

function displayAnswers(v) {
    $("#answers-container").children().remove();
    for (var i =0; i < v.length; i++){
        $("#answers-container").append("<div class='answer-button'>" + v[i] +"</div>" )
    }
}
function reset() {
    $.scrollTo('h1');
    location.reload();
}
///////////////////////////////////////////////////////////////////////////////////////

// instagram functions


InstaQuestions = {
   q1: {
		question: "How do you plan to access this photo?",
		answers: ["Embed it", "Save it"]
	  },
   save: {
		question: "Would you prefer to embed it instead?",
		answers: ["Yes", "No"]
   },
  allowed: {
	   image: "img/green.png",
       answers: ["Allowed! You can embed the photo in your site as long as you agree to the Instagram API's <a href='https://instagram.com/about/legal/terms/api/'>terms of use</a>."]
   },
  no: {
       image: "img/red.png",
       answers: ["This photo is only authorized for embedding.  Please contact the owner for more information."]
  }
}

function InstaDisplay(q){
    highlight();
    $("#question-container").html(q.question);
    displayAnswers(q.answers);
// handle click on first question
    $(".answer-button").click(function(){
        // option 1 click for question 1
        if ($(this).html() == "Save it"){

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
        if ($(this).html() == "Embed it"){
            displayOurAnswer(InstaQuestions.allowed);
        }
    }); // closes fist click event
} // closes display

///////////////////////////////////////////////////////////////////////////////////////
// Flickr

FlickrANNQuestions = {
    licnese: ["../img/ann.png"],
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
		answers: ["This image is not allowed to be edited. Please contact the owner for more information."]
	},
    notEditing: {
		question: "Are there any identifiable faces in the photo?",
		answers: ["Yes", "No"]
    },
	recognizablePeople: {
		question: "Are the people in the image at a public event?",
		answers: ["Yes", "No"]
    },
	noPeople: {
		image: "img/green.png",
		answers: ["Using this photo is allowed! However, under the <a href='https://creativecommons.org/licenses/by-nc-nd/3.0/us/'>license terms</a>, you must give appropriate credit and provide a link to the <a href='https://creativecommons.org/licenses/by-nc-nd/3.0/us/legalcode'>license</a>. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use."]
	},
    atPublicEvent: {
		image: "img/green.png",
		answers: ["Using this photo is allowed! However, under the <a href='https://creativecommons.org/licenses/by-nc-nd/3.0/us/'>license terms</a>, you must give appropriate credit, provide a link to the <a href='https://creativecommons.org/licenses/by-nc-nd/3.0/us/legalcode'>license</a>. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use."]
    },
	notPublic: {
		image: "img/yellow.gif",
		answers: ["We don't recommend that you use this photo. The <a href='https://creativecommons.org/licenses/by-nc-nd/3.0/us/legalcode'>license</a> has several interpretations that may or may not cover use based on who appears in the photo. To be safe, we recommend using a different image or contacting the owner directly to get permission."]
	},
    social: {
		image: "img/yellow.gif",
		answers: ["Be careful if you decide to use this photo. The <a href='https://creativecommons.org/licenses/by-nc-nd/3.0/us/legalcode'>license</a> has several interpretations that may or may not cover use on social media. To be safe, we recommend using a different image or contacting the owner for permission."]
    },
	business: {
		image: "img/red.png",
		answers: ["This photo is not authorized for business use. We recommend using a different image or contacting the owner for permission."]
   }
}

// function for Attribution-NonCommercial-NoDerivs  license

function FlickrANNDisplay(q){
    // highlight();
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
    }); // closes fist click event
} // closes Flickrdisplay
