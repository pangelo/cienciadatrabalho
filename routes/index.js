var express = require('express');
var router = express.Router();
var Question = require('../server/models/Question');
var QRCode = require('qrcode')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landing', {
    id: '',
    title: 'Bem Vindo!',
    question: 'Default Question?',
    teaser: 'Writing default questions is hard.',
    story: 'Once upon a time a coder had to write a default question...'
  });
});

/* GET home page with a specific ID */
router.get('/:id', function (req, res) {

  getQuestionById(req, res);

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

    QRCode.toDataURL("http://localhost:3000/" + newQuestion._id, function (err, url) {
      console.log(url)
    });
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
      res.render('index', { title: 'Ciência Dá Trabalho', id: req.params.id, question: questions, qrCode: qrCode });
    });
    
  });
}

module.exports = router;
