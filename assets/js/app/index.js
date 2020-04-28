let item;

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

function createNewElement(flag, title = "", itemKey, uid, time) {
  let attr;
  let section;
  let h2;
  let h5;
  let node;
  let p;
  let deletebttn;

  // CARDLARIN HTML ELEMENTİ OLARAK KURULUMU

  // Section tag created
  section = document.createElement("section");
  attr = document.createAttribute("class");
  // card class adding
  attr.value = "card";
  section.setAttributeNode(attr);
  attr = "";

  attr = document.createAttribute("id");
  attr.value = itemKey;
  section.setAttributeNode(attr);
  // --------------------------------------------

  // delete button created
  // -----------------------------------------------

  // div = document.createElement("div");
  // attr = document.createAttribute("class");
  // attr.value = "remove-section";
  // div.setAttributeNode(attr);
  bttn = document.createElement("BUTTON");
  attr = document.createAttribute("class");
  attr.value = "remove-section";
  bttn.setAttributeNode(attr);
  attr = "";

  attr = document.createAttribute("onClick");
  attr.value = "delelete_Item(this.value)";
  bttn.setAttributeNode(attr);
  attr = "";

  attr = document.createAttribute("value");
  attr.value = itemKey;
  bttn.setAttributeNode(attr);
  attr = "";

  pText = document.createTextNode("Sil");
  bttn.appendChild(pText);

  section.appendChild(bttn);

  // -----------------------------------------------
  // h2 element created
  h2 = document.createElement("h2");
  attr = document.createAttribute("class");
  attr.value = "card-title";
  h2.setAttributeNode(attr);
  attr = "";

  attr = document.createAttribute("id");
  attr.value = uid;
  h2.setAttributeNode(attr);
  attr = "";

  // card-title class adding /uniq ıd declare h2
  // -----------------------------------------------

  // -----------------------------------------------

  // İnput dolumu bosmu ?
  if (!(title == "")) {
    node = document.createTextNode(
      // document.getElementById("word-input").value.toUpperCase()
      title
    );
  } else {
    node = document.createTextNode(document.querySelector("#word-input").value);
  }
  // -----------------------------------------------------------------

  h2.appendChild(node);
  // h2 elementinin texti eklendi
  section.appendChild(h2);
  //h2 elementi section elementine child olarak bağlandı
  // -----------------------------------------------

  // -----------------------------------------------
  // p element created
  p = document.createElement("p");
  attr = document.createAttribute("class");
  attr.value = "card-body";
  p.setAttributeNode(attr);
  attr = "";

  // p element adding card-body class
  pText = document.createTextNode(flag);
  p.appendChild(pText);
  section.appendChild(p);
  // p element adding child section
  // -----------------------------------------------

  // -----------------------------------------------

  // h5 element created
  h5 = document.createElement("h5");
  attr = document.createAttribute("class");
  attr.value = "card-timeStamp";
  h5.setAttributeNode(attr);
  attr = "";

  // h5 element adding card-timeStamp class
  node = document.createTextNode(time);
  h5.appendChild(node);
  section.appendChild(h5);
  // h5 element adding child section
  // -----------------------------------------------

  // -----------------------------------------------

  // section elementi classı cards olan elemente child olarak eklendi
  document.querySelector(".cards").appendChild(section);
  // -----------------------------------------------

  rand_Color(uid);
  // attr = "";
  document.querySelector(".loader").style.display = "none";
}

function saveToDatabase(flag, title) {
  let time = new Date();
  time = time.toDateString();
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
      time: time,
    });
}

function onLoad() {
  firebase.auth().onAuthStateChanged((user) => {
    let data;
    current_User = user.uid;
    // console.log("display name : " + user.email);
    document.getElementById("user-info").innerHTML = user.email;

    if (user) {
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
      .child("cards/");

    dataRef.once("value", (snapshot) => {
      snapshot.forEach((element) => {
        item = element.key;
        userID = current_User + Math.floor(Math.random() * 100).toString();
        createNewElement(
          element.val().word.toString(),
          element.val().title,
          item,
          userID,
          element.val().time
        );
      });
    });
  });
}

function get_Last_Save() {
  let dataRef = firebase
    .database()
    .ref()
    .child("users/" + current_User + "/cards" + "/");

  dataRef
    .endAt()
    .limitToLast(1)
    .once("child_added", (snapshot) => {
      item = snapshot.key;
      userID = current_User + Math.floor(Math.random() * 100).toString();
      console.log("get:" + item);
      createNewElement(
        snapshot.val().word,
        snapshot.val().title,
        item,
        userID,
        snapshot.val().time
      );
    });
}

// document.querySelector(".remove-section").addEventListener("click", () => {
//   console.log("click");
//   let removeData = document.querySelector(this).data;
//   firebase
//     .database()
//     .ref("users/" + current_User)
//     .child("cards")
//     .child(removeData)
//     .remove();
//   onload();
// });

function rand_Color(uid) {
  // BURAYA RANDOM FONKSİYONU YARDIMIYLA 1 ARRAYDEN RENK KODLARI SEÇİLEREK CARDIN CSS İ NE EKLENECEK
  const color_arr = [
    "#FF5733",
    "#581845",
    "#C70039",
    "#FF33C4",
    "#6533FF",
    "#33FF82",
    "#FFE933",
    "#33FF69",
    "#9433FF",
    "#690500",
    "#f20089",
    "#bc00dd",
    "#f25c54",
    "#ffd166",
    "#d90429",
    "#9e0059",
    "#2d00f7",
    "#ff9f1c",
    "#f8961e",
    "#f9c74f",
    "#43aa8b",
    "#06d6a0",
    "#ef476f",
    "#2ec4b6",
    "#000000",
    "#934B00",
    "#210F04",
    "#46351D",
    "#BB6B00",
    "#564D4A",
    "#5B2333",
    "#37393A",
  ];
  let rand_val = Math.floor(Math.random() * color_arr.length); // returns a random integer from 0 to 9
  let element = document.getElementById(uid);
  console.log("seçilen element" +"  |" + element.nodeName);
  attr_Color = color_arr[rand_val];
  console.log(
    "burası index : " + (rand_val + 1) + " |" + "renk kodu " + attr_Color
  );
  element.style.backgroundColor = attr_Color;
  if (uid === undefined) {
    console.log("burası randcolor uid : " + uid);
  }
}

function delelete_Item(val) {
  let removeData = val;
  // console.log("get value: " + removeData);
  // let element = this.parentNode.id;
  let element = document.getElementById(removeData);
  // element.style.display = "hide";
  element.remove();
  // element.remove();
  // alert("Click ID : " + removeData);

  firebase
    .database()
    .ref("users/" + current_User)
    .child("cards")
    .child(removeData)
    .remove();

  // alert("silinen ID :" + removeData);

  // window.location.href = "index.html";
}
