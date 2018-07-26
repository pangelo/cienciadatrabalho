var switchVar = 0;

if (document.URL == 'http://localhost.3000/')
    switchVar = 0;

if (document.URL.indexOf("manifesto") >= 0)
    switchVar = 1;

if (document.URL.indexOf("howto") >= 0)
    switchVar = 2;

if (document.URL.indexOf("gallery") >= 0)
    switchVar = 3;

if (document.URL.indexOf("new") >= 0)
    switchVar = 4;

switch (switchVar) {
    case (0):
        document.getElementById("homeLink").classList.add("active");
        break;
    case (1):
        document.getElementById("manifestoLink").classList.add("active");
        break;
    case (2):
        document.getElementById("howToLink").classList.add("active");
        break;
    case (3):
        document.getElementById("galleryLink").classList.add("active");
        break;
    case (4):
        document.getElementById("newLink").classList.add("active");
        break;
}

$("#fbLogo").mouseover(function () {
    $("#fbLogo").attr('src', '/images/facebook-logo_blue.png');
});

$("#fbLogo").mouseout(function () {
    $("#fbLogo").attr('src', '/images/facebook-logo.png');
});

$("#fbLogo").click(function () {
    window.open("https://www.facebook.com/cienciadatrabalho/");
});

$("#instaLogo").mouseover(function () {
    $("#instaLogo").attr('src', '/images/instagram-logo_blue.png');
});

$("#instaLogo").mouseout(function () {
    $("#instaLogo").attr('src', '/images/instagram-logo.png');
});

$("#instaLogo").click(function () {
    window.open("https://www.instagram.com/cienciadatrabalho/");
});

$("#twitterLogo").mouseover(function () {
    $("#twitterLogo").attr('src', '/images/twitter-logo-on-black-background_blue.png');
});

$("#twitterLogo").mouseout(function () {
    $("#twitterLogo").attr('src', '/images/twitter-logo-on-black-background.png');
});

$("#twitterLogo").click(function () {
    window.open("https://twitter.com/cienciadatrabal");
});

$("#newQuestionForm").submit(function(e) {

    var question = $("#newQuestionInput").val();

    if(question == "")
    {
        alert('Sem pergunta não há respostas!')
    }
    else
    {
        $.post( "/generatePoster", {question:question}, function( data ) {
            console.log(data);
            //$("#posterContent").html( data );

            var byteCharacters = atob(data);

            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            var blob = new Blob([byteArray], {type: "application/pdf"});

            var blob_url = URL.createObjectURL(blob);

            $("#posterContent").attr('src', blob_url);  
          });

        //$("#posterContent").html( question );

        $("#step1").fadeOut(500,  function() {
            $("#step2").fadeIn(500);
          });

    
    }
e.preventDefault();
    
});
