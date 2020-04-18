// {
//   /* <section class="card">
// <h2>Title</h2>
// <p>descrition</p>
// <h5>two days ago ..</h5>
// </section> */
// }

// const element = `<section class='card'> <h2>Title</h2><p>descrition</p> <h5>asda/h5>`;

// //   "<section class='card'> <h2>Title</h2><p>descrition</p> <h5></h5>";
// import env from".env"

function addWord() {
  // Zaman Fonksiyonu
  var dataRes;
  var time = new Date();
  time = time.toDateString();
  const lang = "tr";
  const text = document.getElementById("word-input").value;
  const API_KEY =
    " trnsl.1.1.20200418T031625Z.9cec77fc8baa52af.4342049eae7cc356f4d7cd8f54034fd7a001783f";
  fetch(
    "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
      API_KEY +
      "&text=" +
      text +
      "&lang=" +
      lang
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      dataRes = data.text;
      console.log("dataRes:" + dataRes);
      // document.getElementById("lagaluga").innerHTML = dataRes.text;
      console.log(data.text);
    });

  console.log("flag");
  // CARDLARIN HTML ELEMENTİ OLARAK KURULUMU

  cardsTag = document.getElementById("cards");

  var strHtml = document.createElement("section");
  var attr = document.createAttribute("class");
  attr.value = "card";
  strHtml.setAttributeNode(attr);
  var h2 = document.createElement("h2");
  attr = document.createAttribute("id");
  attr.value = "card-title";

  h2.setAttributeNode(attr);
  var node = document.createTextNode(
    document.getElementById("word-input").value.toUpperCase()
  );
  h2.appendChild(node);
  strHtml.appendChild(h2);

  var p = document.createElement("p");
  attr = document.createAttribute("id");
  attr.value = "card-body";
  p.setAttributeNode(attr);

  node = document.createTextNode(this.response);
  p.appendChild(node);
  strHtml.appendChild(p);

  var h5 = document.createElement("h5");
  node = document.createTextNode(time);
  h5.appendChild(node);
  strHtml.appendChild(h5);

  document.getElementById("cards").appendChild(strHtml);
}

function clear_Input() {
  document.getElementById("word-input").value = "";
}
