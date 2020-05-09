const fs = require('fs')
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1')
const { IamAuthenticator } = require('ibm-watson/auth')

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: 'Ehnfu-RZWSruzTBYuaxNY0_yjhBdN-MY3o_S_X4Fy-Oh',
  }),
  url: 'https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/edfa8cce-94ea-4b17-bfd4-5c74704806e5',
})

exports.getVoices = (req, res) => {
  textToSpeech
    .listVoices()
    .then((voices) => {
      res.json({
        voices,
      })
    })
    .catch((err) => {
      if (err) {
        res.json({ error: 'Network error' })
      }
    })
}

exports.convertText = (req, res) => {
  console.log(req.body)
  const { text, selectedVoice } = req.body
  const params = {
    text,
    accept: 'audio/mp3',
    voice: selectedVoice,
  }

  textToSpeech
    .synthesize(params)
    .then((response) => {
      const audio = response.result
      return audio
    })
    .then((repairedFile) => {
      // fs.writeFileSync('audio.mp3', repairedFile)
      repairedFile.pipe(fs.createWriteStream('audio.mp3'))
      res.json({
        success: true,
      })
      console.log('audio.mp3 written with a corrected wav header')
    })
    .catch((err) => {
      console.log('Error:', err.message)
    })

  // textToSpeech.synthesizeUsingWebSocket(params)
  // synthStream.pipe(fs.createWriteStream('./audio.ogg'))
}

exports.stream = (req, res) => {
  const rs = fs.createReadStream(__dirname + '/audio.mp3')
  res.writeHead(200, {
    'Content-Type': 'audio/mp3',
    'Content-Disposition': 'attachment; filename=audio.mp3',
    'Content-Transfer-Encoding': 'Binary',
  })
  rs.pipe(res)
}
