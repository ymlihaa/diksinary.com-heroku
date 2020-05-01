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

document.querySelector("#btn-login").addEventListener("click", () => {
  const email = document.getElementById("exampleInputEmail1").value;
  const password = document.getElementById("exampleInputPassword1").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert("KULLANICI ADI YADA ŞİFRE HATALI ");
      // document.getElementById("err").innerHTML="Kullanıcı Adı yada Parola Hatalı !"
    });
});

document.querySelector("#register").addEventListener("click", () => {
  window.location.href = "register.html";
});
