const express = require('express');
const router = express.Router();
const googleTranslateService = require('@google-cloud/translate');
const path = require('path');

const googleTranslateInstance = googleTranslateService({
  projectId: 'zippy-acronym-169116',
  keyFilename: path.resolve(__dirname, 'translate_service_key.json'),
});

router.get('/:word', function (req, res) {
  const word = req.params.word;
  if (word) {
    googleTranslateInstance.translate(word, 'zh', (error, translation) => {
      if (!error && translation) {
        res.send({ translation });
      } else {
        res.status(500).send({ error: 'translation service error' });
        console.error(error);
      }
    });
  } else {
    res.status(400).send({ error: 'invalid word' });
  }
});

module.exports = router;
