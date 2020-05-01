var item;
var current_User;
const baseURL="https://diksinary01.herokuapp.com/resources/";

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

class section {
  // Creating HTML elements
  constructor() {
    this.section = document.createElement("section");
    this.bttn = document.createElement("BUTTON");
    this.h2 = document.createElement("h2");
    this.p = document.createElement("p");
    this.h5 = document.createElement("h5");
  }
  // Set CLASS attribute
  addtribute_Class(section_Attr, bttn_Attr, h2_Attr, p_Attr, h5_Attr) {
    this.section.className = section_Attr;
    this.bttn.className = bttn_Attr;
    this.h2.className = h2_Attr;
    this.p.className = p_Attr;
    this.h5.className = h5_Attr;
  }
  // Set İD attribute
  addtribute_ID(section_Attr, bttn_Attr, h2_Attr) {
    this.section.setAttribute("id", section_Attr);
    this.bttn.setAttribute("value", bttn_Attr);
    this.h2.setAttribute("id", h2_Attr);
  }
  // Set textContent
  add_textContent(tagName, text) {
    switch (tagName) {
      case "bttn":
        this.bttn.appendChild(document.createTextNode("Sil"));
        break;
      case "h2":
        if (!(text == "")) {
          this.h2.appendChild(document.createTextNode(text));
        } else {
          this.h2.appendChild(
            document.createTextNode(document.querySelector("#word-input").value)
          );
        }
        break;
      case "p":
        this.p.appendChild(document.createTextNode(text));
        break;
      case "h5":
        this.h5.appendChild(document.createTextNode(text));
        break;
    }
  }

  // Element Mounting
  element_Mount() {
    let body = document.getElementsByClassName("cards");
    this.section.appendChild(this.bttn);
    this.section.appendChild(this.h2);
    this.section.appendChild(this.p);
    this.section.appendChild(this.h5);
    document.querySelector(".cards").appendChild(this.section);
  }
}

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
      document.querySelector("#word-input").value = "";
    });
}

function createNewElement(flag, title = "", itemKey, uid, time) {
  const Card = new section();

  Card.addtribute_Class(
    "card",
    "remove-section",
    "card-title",
    "card-body",
    "card-timeStamp"
  );

  Card.addtribute_ID(itemKey, itemKey, uid);
  Card.add_textContent("bttn", "Sil");
  Card.add_textContent("h2", title);
  Card.add_textContent("p", flag);
  Card.add_textContent("h5", time);
  Card.element_Mount();

  rand_Color(uid);
  document.querySelector(".loader").style.display = "none";
}

function saveToDatabase(flag, title) {
  // var text = e.target.value.toLowerCase();
  var text = document.getElementById("word-input").value;
  var keys = itemList[0].getElementsByTagName("section");
  var itemName;
  var isKey = [];
  console.log(keys);
  Array.from(keys).forEach((key) => {
    itemName = key.children;
    isKey.push(itemName[1].textContent);
  });
  console.log(text);

  console.log(isKey.includes(text));
  if (isKey.includes(text)) {
    alert("bu zaten var");
    Array.from(keys).forEach((key) => {
      key.style.display = "";
    });
  } else {
    let time = new Date();
    time = time.toDateString();
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

    get_Last_Save();
    setTimeout(
      () =>
        Array.from(keys).forEach((key) => {
          key.style.display = "";
        }),
      1000
    );
  }
}

function onLoad() {
  var count;
  firebase.auth().onAuthStateChanged((user) => {
    let data;
    current_User = user.uid;
    document.getElementById("user-info").innerHTML = user.email;

    if (user) {
      document.querySelector("#logout").addEventListener("click", () => {
        firebase
          .auth()
          .signOut()
          .then(() => {
            window.location.href = baseURL+"login.html";
          });
      });
    }

    let dataRef = firebase
      .database()
      .ref()
      .child("users/" + current_User)
      .child("cards/");

    dataRef.once("value", (snapshot) => {
      count += 1;

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
  if (count <= 1) {
    document.querySelector(".loader").style.display = "none";
  }
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
      createNewElement(
        snapshot.val().word,
        snapshot.val().title,
        item,
        userID,
        snapshot.val().time
      );
    });
}

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
  attr_Color = color_arr[rand_val];

  element.style.backgroundColor = attr_Color;
}

document.querySelector(".cards").addEventListener("click", deleted);
document.querySelector("#word-input").addEventListener("keyup", filter);
var itemList = document.getElementsByClassName("cards");

function deleted(e) {
  var itemName;
  var text = document.getElementById("word-input").value;
  var keys = itemList[0].getElementsByTagName("section");

  if (e.target.value != undefined) {
    if (confirm("eminmisin")) {
      let removeData = e.target.value;
      let element = document.getElementById(removeData);
      element.remove();

      firebase
        .database()
        .ref("users/" + current_User)
        .child("cards")
        .child(removeData)
        .remove();

      Array.from(keys).forEach((key) => {
        key.style.display = "";
      });
      document.getElementById("word-input").value = "";
    }
  }
}

function filter(e) {
  console.log(itemList[0]);
  // console.log("burası e target : " + e.target.value);
  var text = e.target.value.toLowerCase();
  var keys = itemList[0].getElementsByTagName("section");
  Array.from(keys).forEach((key) => {
    var itemName = key.children;
    var isKey = itemName[1].textContent;
    if (isKey.toLowerCase().indexOf(text) != -1) {
      key.style.display = "";
    } else {
      key.style.display = "none";
    }
  });
}
