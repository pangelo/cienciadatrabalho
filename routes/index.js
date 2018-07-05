var express = require('express');
var router = express.Router();
var Question = require('../server/models/Question');
var QRCode = require('qrcode');
var PDFDocument = require('pdfkit');
var fs = require("fs");
var blobStream = require('blob-stream');
var streamBuffers = require('stream-buffers');
var base64 = require('base64-stream');

router.get('/', function (req, res) {
  res.render('landing', {
    id: '',
    title: '#ciênciadátrabalho',
    question: 'Eu Tenho Perguntas?',
    teaser: '#ciênciadátrabalho é um movimento que surge no contexto do Emergence Hackathon 2018, e pretende despertar a consciência do público para a complexidade e morosidade do trabalho científico através do casamento entre a arte de rua e o mundo digital. Entra na nossa história.',
    story: '/uploads/stories/teste.html',
  });
});

/* GET manifesto page */
router.get('/manifesto', function (req, res) {
  res.render('manifesto', { title: '#ciênciadátrabalho - Manifesto' });
});

/* GET how-to page */
router.get('/howto', function (req, res) {
  res.render('howto', { title: '#ciênciadátrabalho - Como Participar' });
});

/* GET new question page */
router.get('/new', function (req, res) {
  res.render('new', { title: '#ciênciadátrabalho - Nova Pergunta' });
});

router.post('/generatePoster', function (req, res) {

  console.log('bla');
  console.log(req.body.question);

  /*var sb = new streamBuffers.WritableStreamBuffer(
    {
      initialSize: (100 * 1024),
      incrementAmount: (10 * 1024)
    });*/

  var doc = new PDFDocument();

  var finalString = '';

  var stream = doc.pipe(base64.encode());
  
  var question = req.body.question;

  var splitQuestion = question.split(" ");

  var hashtag = "#ciênciadatrabalho";

  for (var i = 0; i < splitQuestion.length; i++) {

    doc.polygon ([10, 10], [10, 780], [600, 780], [600, 10]).dash(10,  20).stroke();

    var fontSize = 0;
    if (splitQuestion[i].length <= 5)
      fontSize = 96;
    else if(splitQuestion[i].length <= 10)
      fontSize = 64;
    else
      fontSize = 48;

    if (i < splitQuestion.length - 1) {
      doc.font('public/fonts/Bungee.ttf', fontSize).text(splitQuestion[i], {
        align: 'center',
      });
    }
    else {
      doc.font('public/fonts/Bungee.ttf', fontSize).text(splitQuestion[i], {
        align: 'center',
      }).moveDown();
    }

  }

  doc.font('public/fonts/Lora.ttf', 36).text(hashtag, 100, 670, {
    align: 'center',
  });

  //console.log(doc);
  //blob = stream.toBlob('application/pdf');
  //res.contentType('application/pdf');
  //console.log(new Blob(doc));
  //res.send(doc)

  doc.end();

  stream.on('data', function(chunk) {
    finalString += chunk;
});

stream.on('end', function() {
  // the stream is at its end, so push the resulting base64 string to the response
  res.json(finalString);
});
  //console.log(stream);
  //console.log(stream.size());

  //res.send();

  //console.log(doc);

  //res.sendFile('/public/uploads/output.pdf');

  /*res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=some_file.pdf',
    'Content-Length': doc.length
  });
  res.end(doc);*/
  //doc.pipe( fs.createWriteStream('out.pdf') );
  /*doc.write('out.pdf');
  res.download('out.pdf');*/

});

/* GET home page with a specific ID */
router.get('/:id', function (req, res) {

  getQuestionById(req, res);

});

/* GET detail page related with a specific ID */
router.get('/:id/detail', function (req, res) {

  Question.findById(req.params.id, function (err, questions) {

    if (err) {
      res.send(err);
    }

    if (questions == null) {
      res.render('error', { status: 404, message: 'not found', error: '404 not found' });
    }


    res.render('detail', {
      title: '#ciênciadátrabalho',
      detail: questions.details
    });

  });

 
});

/* POST a new question */
router.post('/question', function (req, res) {

  var newQuestion = new Question();
  newQuestion.question = req.body.question;
  newQuestion.answer = req.body.answer;
  newQuestion.created_at = new Date();
  newQuestion.interactiveStory = req.body.interactiveStory;
  newQuestion.poster = req.body.poster;
  newQuestion.details = req.body.details;

  newQuestion.save(function (err, newQuestion) {
    if (err) res.send(err);
    console.log(err);
    res.json(newQuestion);
  });

});


var getQuestionById = function (req, res) {

  var qrCode = '';

  Question.findById(req.params.id, function (err, questions) {

    if (err) {
      res.send(err);
    }

    if (questions == null) {
      res.render('error', { status: 404, message: 'not found', error: '404 not found' });
    }


    QRCode.toDataURL("http://localhost:3000/" + questions._id, function (err, url) {
      qrCode = url;
      res.render('landing', {
        id: req.params.id,
        title: '#ciênciadátrabalho',
        question: questions.question,
        teaser: questions.answer,
        story: questions.interactiveStory,
        qrCode: qrCode
      });
    });

  });
}

module.exports = router;
