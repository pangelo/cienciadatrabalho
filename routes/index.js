var express = require('express');
var router = express.Router();
var Question = require('../server/models/Question');
var QRCode = require('qrcode');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landing', {
    id: '',
    title: '#ciênciadátrabalho',
    question: 'Default Question?',
    teaser: 'Writing default questions is hard.',
    story: '/uploads/stories/teste.html',
  });
});

/* GET manifesto page */
router.get('/manifesto', function (req, res) {
  res.render('manifesto', { title: '#ciênciadátrabalho - Manifesto'});
});

/* GET manifesto page */
router.get('/howto', function (req, res) {
  res.render('howto', { title: '#ciênciadátrabalho - Como Participar'});
});

/* GET home page with a specific ID */
router.get('/:id', function (req, res) {

  getQuestionById(req, res);

});

/* GET detail page related with a specific ID */
router.get('/:id/detail', function (req, res) {
  res.render('detail', { 
    title: '#ciênciadátrabalho',
    detail: 'Awesome Scientific Content Goes Here'});
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
