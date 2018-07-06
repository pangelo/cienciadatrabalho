var express = require('express');
var router = express.Router();
var Question = require('../server/models/Question');
var Vandalytic = require('../server/models/Vandalytic');
var QRCode = require('qrcode');
var PDFDocument = require('pdfkit');
var fs = require("fs");
var blobStream = require('blob-stream');
var streamBuffers = require('stream-buffers');
var base64 = require('base64-stream');

router.get('/', function (req, res) {

  var randomStory = "/uploads/stories/defaultStory1.html";

    registerVisitor(req,res,"landing");

    var random = Math.floor(Math.random() * 5) + 1;

    switch(random)
    {
      case(1):
        randomStory = "/uploads/stories/ANNA.html";
      break;
      case(2):
        randomStory = "/uploads/stories/CHRISTIAN.html";
      break;
      case(3):
        randomStory = "/uploads/stories/FELIPE.html";
      break;
      case(4):
        randomStory = "/uploads/stories/NATALIA.html";
      break;
      case(5):
        randomStory = "/uploads/stories/PEDRO.html";
      break;
    }


  res.render('landing', {
    id: '',
    title: '#ciênciadátrabalho',
    question: 'Eu Tenho Perguntas?',
    teaser: 'A comunicar ciência através do vandalismo investigativo.',
    story: randomStory,
    calltoaction:"Se queres saber mais sobre o movimento, entra nesta estória!"
  });
});

/* GET manifesto page */
router.get('/manifesto', function (req, res) {
  registerVisitor(req,res,"manifesto");
  res.render('manifesto', { title: '#ciênciadátrabalho - Manifesto' });
});

/* GET how-to page */
router.get('/howto', function (req, res) {
  registerVisitor(req,res,"howto");
  res.render('howto', { title: '#ciênciadátrabalho - Como Participar' });
});

/* GET new question page */
router.get('/new', function (req, res) {
  res.render('new', { title: '#ciênciadátrabalho - Nova Pergunta' });
});

/* GET gallery page */
router.get('/gallery', function (req, res) {
  registerVisitor(req,res,"gallery");
  Question.find().exec (function(err, docs) {
    console.log(docs);

    if (err) {
      res.render ('error', {
        message: "Something bad happened to your gallery",
        status: err
      });
    }
    else {
      res.render ('gallery', {
        title: '#ciênciadátrabalho - Galeria',
        docs: docs,
        id:''
      });
    }    
  }); 
});

router.post('/generatePoster', function (req, res) {

  registerVisitor(req,res,"poster");

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

  doc.end();

  stream.on('data', function(chunk) {
    finalString += chunk;
});

stream.on('end', function() {
  // the stream is at its end, so push the resulting base64 string to the response
  res.json(finalString);
});

});

/* GET home page with a specific ID */
router.get('/:id', function (req, res) {
  registerVisitor(req,res,"landing/"+req.params.id);
  getQuestionById(req, res);

});

/* GET detail page related with a specific ID */
router.get('/:id/detail', function (req, res) {
  registerVisitor(req,res,"landing/"+req.params.id+"/");
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
  registerVisitor(req,res,"newquestion");
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

/* POST a new visit */
var registerVisitor = function(req,res,page)
{
  var newVandalytic = new Vandalytic();
  newVandalytic.page = page;
  newVandalytic.timestamp = Date.now();
  console.log(page);
  
  newVandalytic.save(function (err, newVandalytic) {
    console.log("saved to db");
  });
}


var getQuestionById = function (req, res) {

  var qrCode = '';

  Question.findById(req.params.id, function (err, questions) {

    if (err) {
      res.send(err);
    }

    if (questions == null) {
      res.render('error', { status: 404, message: 'not found', error: '404 not found' });
    }

    if(req.params.id)
    {
      QRCode.toDataURL("http://cienciadatrabalho.info" + req.params.id, function (err, url) {
        qrCode = url;
        res.render('landing', {
          id: req.params.id,
          title: '#ciênciadátrabalho',
          question: questions.question,
          teaser: questions.answer,
          story: questions.interactiveStory,
          qrCode: qrCode,
          calltoaction:"Se queres saber mais sobre a ciência por trás desta pergunta, entra nesta estória!"
        });
      });
    }
    else
    {
      res.render('landing', {
        id: '',
        title: '#ciênciadátrabalho',
        question: 'Eu Tenho Perguntas?',
        teaser: '#ciênciadátrabalho é um movimento que surge no contexto do Emergence Hackathon 2018, e pretende despertar a consciência do público para a complexidade e morosidade do trabalho científico através do casamento entre a arte de rua e o mundo digital. Entra na nossa história.',
        story: '/uploads/stories/TESTE.html',
        calltoaction:"Se queres saber mais sobre a ciência por trás desta pergunta, entra nesta estória!"
      });
    }

  });
}

module.exports = router;
