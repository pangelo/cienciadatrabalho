var displayGallery = function(docs)
{
	var allPosters = $('[id="posterContent"]');

		var posters = [];

		var generatePDF = function (data, id) {

			return new Promise(resolve => {
				setTimeout(() => {
					var byteCharacters = atob(data);

					var byteNumbers = new Array(byteCharacters.length);
					for (var i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i);
					}

					var byteArray = new Uint8Array(byteNumbers);

					var blob = new Blob([byteArray], {
						type: "application/pdf"
					});

					var blob_url = URL.createObjectURL(blob);

					$('#posterContent_' + id).attr('src', blob_url);
					resolve('resolved');
				}, 1);
			});


		}

		var success = function (data) {
			generatePDF(data, tempDoc._id);
		}

		for (var i = 0; i < docs.length; i++) {
			var tempDoc = docs[i];
			var data = {
				id: tempDoc._id,
				question: tempDoc.question
			};


			$.ajax({
				type: 'POST',
				url: "/generatePoster",
				data: data,
				success: success,
				async: false
			});
		}
}

	