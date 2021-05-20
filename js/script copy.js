/*Onload functions*/

window.onload = function () {
  callAPOD();
};

function displayImg(response) {
  // var target = document.getElementById("img-target");

  console.log(response);
  console.log(response.url);
  target = document.getElementById("img-target");
  target.innerHTML = "<img src=" + response.url + "></img>";
}

function callAPOD() {
  var imageReq = new XMLHttpRequest();

  imageReq.open(
    "GET",
    "https://api.nasa.gov/planetary/apod?api_key=ufnsVaQyhcZILpdIeWPVJd89SBoVze5oWO1tgEEC",
    true
  );
  imageReq.onload = function (e) {
    if (imageReq.readyState === 4) {
      if (imageReq.status === 200) {
        /*Can I put these in a global scope to call down?*/
        var response = JSON.parse(this.responseText);
        displayImg(response);
      } else {
        console.log(imageReq.responseText);
      }
    }
  };
  imageReq.send(null);
}

function log() {
  console.log("This is a test of browser dev tools");
}
