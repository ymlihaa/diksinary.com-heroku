let current_User = "";

const firebaseConfig = {
  apiKey: "AIzaSyCTwdHnyx32m8Ksktkevcjn0gzRXfBpWio",
  authDomain: "mysozluk-39b91.firebaseapp.com",
  databaseURL: "https://mysozluk-39b91.firebaseio.com",
  projectId: "mysozluk-39b91",
  storageBucket: "mysozluk-39b91.appspot.com",
  messagingSenderId: "99167490466",
  appId: "1:99167490466:web:6a61128b0a10743fdf22fb",
  measurementId: "G-EQRNVJ2L8B",
};
firebase.initializeApp(firebaseConfig);

const lang = "tr";
const API_KEY =
  " trnsl.1.1.20200418T031625Z.9cec77fc8baa52af.4342049eae7cc356f4d7cd8f54034fd7a001783f";
let URL =
  "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
  API_KEY +
  "&text=" +
  document.getElementById("word-input").value +
  "&lang=" +
  lang;

function request_API() {
  var flag;

  fetch(
    "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
      API_KEY +
      "&text=" +
      document.getElementById("word-input").value +
      "&lang=" +
      lang
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      flag = data;
      createNewElement(flag.text);
      document.querySelector("#word-input").value = "";
    });
}
// -------------------------------------------------------------------

function createNewElement(flag) {
  let attr;
  let section;
  let h2;
  let h5;
  let node;
  let p;

  let time = new Date();
  time = time.toDateString();

  // CARDLARIN HTML ELEMENTİ OLARAK KURULUMU

  section = document.createElement("section");
  attr = document.createAttribute("class");
  attr.value = "card";
  section.setAttributeNode(attr);
  h2 = document.createElement("h2");
  attr = document.createAttribute("id");
  attr.value = "card-title";

  h2.setAttributeNode(attr);
  if (document.getElementById("word-input").value == "") {
    alert("Lütfen bir kelime giriniz !");
  } else {
    node = document.createTextNode(
      document.getElementById("word-input").value.toUpperCase()
    );
  }
  h2.appendChild(node);
  section.appendChild(h2);
  p = document.createElement("p");
  attr = document.createAttribute("id");
  attr.value = "card-body";
  p.setAttributeNode(attr);
  pText = document.createTextNode(flag);
  p.appendChild(pText);
  section.appendChild(p);

  h5 = document.createElement("h5");
  attr = document.createAttribute("id");
  attr.value = "card-timeStamp";
  h5.setAttributeNode(attr);
  node = document.createTextNode(time);
  h5.appendChild(node);
  section.appendChild(h5);

  document.getElementById("cards").appendChild(section);
}

firebase.auth().onAuthStateChanged((user) => {
  let data;
  if (user) {
    document.querySelector("#logout").addEventListener("click", () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          window.location.href = "login.html";
        });

      document
        .querySelector("#sendToDatabase")
        .addEventListener("click", () => {
          data = document.querySelector("#word-input").value;

          firebase
            .database()
            .ref()
            .child("users")
            .child(current_User)
            .child("cards")
            .push({
              word: data,
            });
        });
    });
  }
});
