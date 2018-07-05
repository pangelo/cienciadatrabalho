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
			document.getElementById("gallery").classList.add("active");
			break;
		case (4):
			document.getElementById("new").classList.add("active");
			break;
	}

	$("#fbLogo").mouseover(function() {
		$( "#fbLogo" ).attr('src','images/facebook-logo_blue.png');
	});

    $("#fbLogo").mouseout(function() {
		$( "#fbLogo" ).attr('src','images/facebook-logo.png');
    });
    
    $("#fbLogo").click(function() {
		window.open("https://www.facebook.com/cienciadatrabalho/"); 
	});

	$("#instaLogo").mouseover(function() {
		$( "#instaLogo" ).attr('src','images/instagram-logo_blue.png');
	});

    $("#instaLogo").mouseout(function() {
		$( "#instaLogo" ).attr('src','images/instagram-logo.png');
    });
    
    $("#instaLogo").click(function() {
		window.open("https://www.instagram.com/cienciadatrabalho/"); 
    });

	$("#twitterLogo").mouseover(function() {
		$( "#twitterLogo" ).attr('src','images/twitter-logo-on-black-background_blue.png');
	});

    $("#twitterLogo").mouseout(function() {
		$( "#twitterLogo" ).attr('src','images/twitter-logo-on-black-background.png');
    });
    
    $("#twitterLogo").click(function() {
		window.open("https://twitter.com/cienciadatrabal"); 
	});
    