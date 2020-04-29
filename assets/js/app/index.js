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
  section.className = "card";
  section.setAttribute("id", itemKey);
  // --------------------------------------------
  // delete button created
  // -----------------------------------------------
  bttn = document.createElement("BUTTON");
  bttn.className = "remove-section";
  bttn.setAttribute("value", itemKey);
  bttn.appendChild(document.createTextNode("Sil"));
  section.appendChild(bttn);
  // -----------------------------------------------
  // h2 element created
  h2 = document.createElement("h2");
  h2.className = "card-title";
  h2.setAttribute("id", uid);
  // İnput dolumu bosmu ?
  if (!(title == "")) {
    h2.appendChild(document.createTextNode(title));
  } else {
    h2.appendChild(
      document.createTextNode(document.querySelector("#word-input").value)
    );
  }
  // -----------------------------------------------------------------
  // h2 elementinin texti eklendi
  section.appendChild(h2);
  // -----------------------------------------------
  // p element created
  p = document.createElement("p");
  p.className = "card-body";
  p.appendChild(document.createTextNode(flag));
  section.appendChild(p);
  // p element adding child section
  // -----------------------------------------------
  // h5 element created
  h5 = document.createElement("h5");
  h5.className = "card-timeStamp";
  // h5 element adding card-timeStamp class
  h5.appendChild(document.createTextNode(time));
  section.appendChild(h5);
  // h5 element adding child section
  // -----------------------------------------------
  // section elementi classı cards olan elemente child olarak eklendi
  document.querySelector(".cards").appendChild(section);
  // -----------------------------------------------
  rand_Color(uid);
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
  console.log("seçilen element" + "  |" + element.nodeName);
  attr_Color = color_arr[rand_val];
  console.log(
    "burası index : " + (rand_val + 1) + " |" + "renk kodu " + attr_Color
  );
  element.style.backgroundColor = attr_Color;
  if (uid === undefined) {
    console.log("burası randcolor uid : " + uid);
  }
}

// function delelete_Item(val) {
//   // let removeData = val;
//   // let element = document.getElementById(removeData);
//   // element.remove();
//   // firebase
//   //   .database()
//   //   .ref("users/" + current_User)
//   //   .child("cards")
//   //   .child(removeData)
//   //   .remove();
// }

// // var itemList = document.querySelector(".buttons");
document.querySelector(".cards").addEventListener("click", deleted);

function deleted(e) {
  // if(e.target.clas)
  // console.log(e.target.value);
  console.log(e.target.value);
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
    }
  }
}
