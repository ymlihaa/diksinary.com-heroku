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

var current_User;

firebase.initializeApp(firebaseConfig);

const lang = "tr";
const API_KEY =
  " trnsl.1.1.20200418T031625Z.9cec77fc8baa52af.4342049eae7cc356f4d7cd8f54034fd7a001783f";

function request_API() {
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
      saveToDatabase(
        data.text.toString(),
        document.getElementById("word-input").toString()
      );
      get_Last_Save();
      document.querySelector("#word-input").value = "";
    });
}
// -------------------------------------------------------------------

function createNewElement(flag, title = "") {
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
  // alert("Lütfen bir kelime giriniz !");
  if (!(title == "")) {
    node = document.createTextNode(
      // document.getElementById("word-input").value.toUpperCase()
      title
    );
  } else {
    node = document.createTextNode(document.querySelector("#word-input").value);
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

function saveToDatabase(flag, title) {
  data = document.querySelector("#word-input").value;
  firebase
    .database()
    .ref()
    .child("users")
    .child(current_User)
    .child("cards")
    .push({
      word: flag,
      title: document.querySelector("#word-input").value.toString(),
    });
}

function onLoad() {
  firebase.auth().onAuthStateChanged((user) => {
    let data;
    current_User = user.uid;

    if (user) {
      console.log(current_User);

      document.querySelector("#logout").addEventListener("click", () => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            window.location.href = "login.html";
          });
      });

      // document.querySelector("#SendToData").addEventListener("click", () => {});
    }

    // alert(current_User);
    let dataRef = firebase
      .database()
      .ref()
      .child("users/" + current_User)
      .child("cards");

    dataRef.once("value", (snapshot) => {
      snapshot.forEach((element) => {
        createNewElement(element.val().word.toString(), element.val().title);
      });
    });
  });
}

function get_Last_Save() {
  // firebase.auth().onAuthStateChanged((user) => {
  let dataRef = firebase
    .database()
    .ref()
    .child("users/" + current_User + "/cards" + "/");
  // .child("cards")

  dataRef
    .endAt()
    .limitToLast(1)
    .once("child_added", (snapshot) => {
      console.log(snapshot.val());
      createNewElement(snapshot.val().word, snapshot.val().title);
    });
  // });
}

// random_Card_Title_Color(){

//   // BURAYA RANDOM FONKSİYONU YARDIMIYLA 1 ARRAYDEN RENK KODLARI SEÇİLEREK CARDIN CSS İ NE EKLENECEK

// }
