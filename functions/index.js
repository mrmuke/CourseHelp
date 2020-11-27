/* const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "coursehelp-8d1c8",
      "private_key_id": "9ade45e1f6d99967a8bf76c3ec369f50523bc609",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYfsV9g6dyPBG7\nhdSCcN1ijrVANGzznUnqGQ2eGwm958BWxrREtHv91P5ToZo6TpHqhqn4Aye+PzUX\nCZAVktOIACyIjuB1Y+68NvmAmO4k8O1MYaPfV1GJSNEzAimyt70UtDeP5SV6pQnQ\n7qWfZ0Z6QYKA4Ap4GAhDUcm7QzevCH0OZoHGfRf9JYKfp0kKKqMWCXrBoCWcLBAQ\nQ8p7YBE6Usnkfi/64J/P49kf9ljjsX0xm+RnYqFBVNlxcS/KI1IcOR131IX+xAyj\nuNXEzOwUplrpzjVLFb8DuikXueuCBxR4tsBu8PS4TdA2Bw4W7fFsslGsbthmoIfU\nCVBpAWpHAgMBAAECggEABCtzOvtemMELuxTtuqNbalZ8nkTQtdiXLM+Cj9AtdAPi\nPn0wcLB+s3IfginpDa8YTlFgVGfBrnIMAZVBW1Wocw+OKC2/9XXGEV9vcxS7bkco\nNe51jKXWlOpozfxBJ6HeibJj0otxeukIW64q2TD5vF4OM3fs0VvW3gBeg8BSxXZr\nIsxwlGZ9t1ZzgEt8+YMDpxcFJtjXQqAhmmyfg8gVPZSc3Dx0Z6052hMfGaeQoBLn\nMx1sK3lDl/NM61SufeHDJ71XsrmX0c9HE42qExulCVz/qrWpaNYEc4rUmCjsXYNu\nkyPrz4NWaz37rmDimWN1rWlWQPDAeZOCxI5t6X0AAQKBgQDQiAwxAQ9wStR7XPqu\nBrKPbAoHatHi65i8OeMlefq3A4SwQxiOz33+LQPSV5P+SrEdkJm3ZtWUIivnKssT\n46U6uXs4ok4VkZMyaWNuEC8r799R9ilF24tGpNa2ObT3D5X8GzePl1dqW8Xko1Qt\neBdAc3Iw178EKIrWNadfpqPjAQKBgQC7NUVC79jIAbifcIhslcGf71SPEoVjVmBw\nCzPLzgZZZ67k8BD3b7lFKiok9SV071rDVzSQTX0vO+Ot5muQGwcWBz35ZVc38L+V\nQIN1TzpNJHyaIuIPpnrbk5AAJ4RO9MGnbSPpfpQfIsJcF8K83fkcRxsIgWZ76PGl\nCaPfoM51RwKBgCamgLP4gVcL15RB6Iim3yOsH7O+Pca0aivBAvPoRury8P4GgZ++\nn5ij2Uh8SQbh6zASpBsVKVL6fm6rRNab4/0dcdROaPCgecrnM7GruEKJhDfZy06S\nYZ8nYFCII52DOwZuOP8ZSu+AsQ4uo6SF1LFydGDPLC1mIk2PxkT5SvkBAoGAbkGT\nhzbHUBRjbdPTJVCV9uH3xUO9N6I5rgOK/+9ZIfLEuKUC+Rfd3/RTWezfoJ0PsZh8\nprhckCMPlu3sT7T7WWfugiHDWnj5/KdARSjiR2jD0evVhC4ikYu49b5QWEgifb7z\ntaMNDcFlAuQjlySMgLEIJNxBRZ0OJIsm7qBAuCUCgYBMoba1Vu94l5WCx5d67gEI\n8jKlTHwg4JtMxg8KUITYZbb93NcFEhHn47TInEwjW8/zcN8oSgZHCF/rXw/GdjtR\n77XypZ5LtwWzEsAuKkq6cpsz6QueV0CJD8GjNpk7nMTi8LwXKSYErkzdpdh1LLTk\ngVrd848dImwgseDUrZI89g==\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-mhgpp@coursehelp-8d1c8.iam.gserviceaccount.com",
      "client_id": "118208453105025282696",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mhgpp%40coursehelp-8d1c8.iam.gserviceaccount.com"
    }
    ),
    databaseURL: "https://coursehelp-8d1c8.firebaseio.com"
  });
const speech = require('@google-cloud/speech');
const fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'audio')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })
exports.speech = functions.https.onRequest(upload.single("file"),async (req, res) => {

    const client = new speech.SpeechClient();
    
    // Creates a client
    const fileName = './Hello.wav';
 
  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');
 
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',

    sampleRateHertz:44100,
    audioChannelCount:2,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };
 

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  res.json(transcription)
  });

   */
const path = require('path');
const os = require('os');
const fs = require('fs');
// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require('busboy');
const Speech = require('@google-cloud/speech');
const functions = require('firebase-functions')

const ENCODING = 'LINEAR16';
const SAMPLE_RATE_HERTZ = 41000;
const LANGUAGE = 'en-US';

const audioConfig = {
    encoding: ENCODING,
    sampleRateHertz: SAMPLE_RATE_HERTZ,
    languageCode: LANGUAGE,
    enableAutomaticPunctuation: true
};

const convertToText = (file, config) => {
    console.log('FILE:', JSON.stringify(file));

    const audio = {
        content: fs.readFileSync(file).toString('base64'),
    };

    const request = {
        config,
        audio,
    };

    const speech = new Speech.SpeechClient();

    return speech.recognize(request).then((response) => {
        return response;
    }).catch((error) => {
        console.log('SPEECH error:', error);
    });
};

/**
 * Audio-to-Text is a Cloud Function that is triggered by an HTTP
 * request. The function processes one audio file.
 *
 * @param {object} req Cloud Function request context.
 * @param {object} res Cloud Function response context.
 */
exports.audioToText = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        res.status(405).end();
    }

    const busboy = new Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    let tmpFilePath;
    let fileWritePromise;

    // Process the file
    busboy.on('file', (fieldname, file, filename) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        const filepath = path.join(tmpdir, filename);
        tmpFilePath = filepath;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        // File was processed by Busboy; wait for it to be written to disk.
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWritePromise = promise;
    });

    // Triggered once the file is processed by Busboy.
    // Need to wait for the disk writes to complete.
    busboy.on('finish', () => {
        fileWritePromise.then(() => {
            convertToText(tmpFilePath, audioConfig).then((response) => {
                const transcript = response[0].results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n')
                res.send({ transcript });
            });
            fs.unlinkSync(tmpFilePath);
        });
    });

    busboy.end(req.rawBody);
})