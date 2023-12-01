const express = require('express');
const db = require('../db');
const { encrypt, decrypt } = require('./crypto');
const mail = require('../sendMail');
const bcrypt = require("bcryptjs");
const router = express.Router();
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const JWT_SECRET = "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

const Collection1 = db.collection("USER");

router.post('/sendOTP', async (req, res) => {
    const { name, email, otp } = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const getUser = await Collection1.doc(email).get();
  if (getUser.exists) res.json({ status: "Exists" });
  else {
    mail.setConfiguration(email, name, otp);
    mail.sendMail(res);
  }
})

router.post("/signUp", async(req, res) => {
  const {name, email, password} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const pass = await bcrypt.hash(password, 10);
  const n = encrypt(name);
    const user = await Collection1.doc(email).set({
      Name: n,
      Password: pass,
    });
    if (user) {
      res.json({ status: "ok" });
    }
    else 
      res.json({ status: "error" });
});

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  const user = await Collection1.doc(email).get();
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (!user.exists) {
    res.json({ status: "error", error: "Invalid username/password" });
  }
  else
  {
    if (await bcrypt.compare(password, user.data().Password)) {
      return res.json({ status: "ok", name: decrypt(user.data().Name) });
    }
    else
      res.json({ status: "error", error: "Invalid username/password" });
  }
});

router.post('/verifyEmail', async (req, res) => {
  const { email, otp } = req.body;
res.header("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
res.setHeader("Access-Control-Allow-Credentials", true);

const getUser = await Collection1.doc(email).get();
if (!getUser.exists) res.json({ status: "Not Exists" });
else {
  mail.setConfigurationForReset(email, otp);
  mail.sendMail1(decrypt(getUser.data().Name), res);
}
})

router.post("/changePassword", async(req, res) => {
  const {name, email, password} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const pass = await bcrypt.hash(password, 10);
  const n = encrypt(name);
    const user = await Collection1.doc(email).set({
      Name: n,
      Password: pass,
    });
    if (user) {
      res.json({ status: "ok" });
    }
    else 
      res.json({ status: "error" });
});

router.post("/addPage", async(req, res) => {
  try {
  const {email, word, meaning} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const user = await Collection1.doc(email).collection('DICTIONARY').get();
  var exists = 0;
  user.docs.forEach(doc => {
    var document = decrypt(doc.data().Word);
    if((document.toLowerCase() === word.toLowerCase()) && (exists === 0)) {
      exists = 1;
    }
  })
    if (exists === 1) {
      res.json({ status: "Exists" });
    }
    else {
      const mean = encrypt(meaning);
      const words = encrypt(word);
      const add = await Collection1.doc(email).collection('DICTIONARY').doc(encrypt(word).content).set({
        Word: words,
        Meaning: mean,
      });
      if(add)
        res.json({ status: "ok" });
      else
        res.json({ status: "error" });
    }
  }
  catch (error) {
    res.json({ status: "error" });
  }
});

router.post("/addDoc", async(req, res) => {
  try {
  const {email, word, meaning} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const user = await Collection1.doc(email).collection('DOCUMENT').get();
  var exists = 0;
  user.docs.forEach(doc => {
    var document = decrypt(doc.data().Word);
    if((document.toLowerCase() === word.toLowerCase()) && (exists === 0)) {
      exists = 1;
    }
  })
    if (exists === 1) {
      res.json({ status: "Exists" });
    }
    else {
      const mean = encrypt(meaning);
      const words = encrypt(word);
      const add = await Collection1.doc(email).collection('DOCUMENT').doc(encrypt(word).content).set({
        Word: words,
        Meaning: mean,
      });
      if(add)
        res.json({ status: "ok" });
      else
        res.json({ status: "error" });
    }
  }
  catch (error) {
    res.json({ status: "error" });
  }
});

router.post("/deleteWordDict", async(req, res) => {
  try {
  const {email, word} = req.body;
  var id;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
 
  const dict = await Collection1.doc(email).collection('DICTIONARY').get();
  if(dict) {
    dict.docs.forEach(doc => {
      if(decrypt(doc.data().Word) == word) {
        id = doc.id;
      }
    });

    const user = await Collection1.doc(email).collection('DICTIONARY').doc(id).delete();
    if(user)
      res.json({ status: "ok" });
    else
      res.json({ status: "error" });
  }
  else
    res.json({ status: "error" });
  }
  catch (error) {
    res.json({ status: "error" });
  }
});

router.post("/deleteWordDoc", async(req, res) => {
  try {
  const {email, word} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const dict = await Collection1.doc(email).collection('DOCUMENT').get();
  if(dict) {
    dict.docs.forEach(doc => {
      if(decrypt(doc.data().Word) == word) {
        id = doc.id;
      }
    });

    const user = await Collection1.doc(email).collection('DOCUMENT').doc(id).delete();
    if(user)
      res.json({ status: "ok" });
    else
      res.json({ status: "error" });
  }
  else
    res.json({ status: "error" });
  }
  catch (error) {
    res.json({ status: "error" });
  }
});

router.post("/getDictionary", async(req, res) => {
  const {email} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  const dict = await Collection1.doc(email).collection('DICTIONARY').get();
  const document = await Collection1.doc(email).collection('DOCUMENT').get();
  if(dict && document) {
    res.json({ status: "ok", dict: dict.docs.map(doc => [decrypt(doc.data().Word), decrypt(doc.data().Meaning)]), document: document.docs.map(doc => [decrypt(doc.data().Word), decrypt(doc.data().Meaning)])});
  }
  else {
    res.json({ status: "error"});
  }
});

router.post("/getMeaning", async(req, res) => {
  const {word} = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  try {
    // const targetUrl = "https://www.oxfordlearnersdictionaries.com/definition/english/"+word;
    const targetUrl = "https://dictionary.cambridge.org/dictionary/english/"+word;
    const arr = [];
    (async() => {
      try {
      // const response = await axios.get(targetUrl);
      const response = await fetch(targetUrl).then(res => res.text()).then(body => {
        const $ = cheerio.load(body);
  //   $("span.def")
  // .each((row, elem) => {
  //   if((row === 0) || (row === 1)) {
  //         const key = $(elem).text().trim();
  //         arr[row] = key;
  //     return;
  // }
  // });
  $("div.ddef_d")
  .each((row, elem) => {
    if((row === 0) || (row === 1)) {
          var key = $(elem).text().trim();
          if(key[key.length-1] == ':')
            key = key.slice(0, key.length-1);
          arr[row] = key;
      return;
  }
  });
  if(arr.length !== 0)
    res.json({ status: arr })
  else
    res.json({ status: "error"});  
      })
    }
catch (error) {
  res.json({ status: "error"});
}
  })()
}
catch (error){
  res.json({ status: "error"});
}

});

module.exports = router;