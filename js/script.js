/*Onload functions*/

window.onload = function () {
  callAPOD(displayImg);
  callPT(displayPatent);
  callRSS(displayFeed, "breaking");
};

/*Pass a function that uses the data presented by the JSON blob*/
function callAPOD(fun) {
  var imageReq = new XMLHttpRequest();

  imageReq.open("GET", "https://api.nasa.gov/planetary/apod?api_key=ufnsVaQyhcZILpdIeWPVJd89SBoVze5oWO1tgEEC", true);
  imageReq.onload = function (e) {
    if (imageReq.readyState === 4) {
      if (imageReq.status === 200) {
        var response = JSON.parse(this.responseText);
        fun(response);
      } else {
        console.log(imageReq.responseText);
      }
    }
  };
  imageReq.send(null);
}
//stop trying to make 'fetch' happen, it's not going to happen
function callPT(fun) {
  var imageReq = new XMLHttpRequest();

  imageReq.open(
    "GET",
    'https://api.patentsview.org/assignees/query?q={"_contains":{"assignee_organization":"NASA"}}&f=["patent_number","patent_date","patent_title","patent_id","assignee_organization","assignee_id","govint_org_id"]&s=[{"patent_date":"desc"}]',
    true
  );
  imageReq.onload = function (e) {
    if (imageReq.readyState === 4) {
      if (imageReq.status === 200) {
        var response = JSON.parse(this.responseText);
        // console.log(response);
        fun(response);
      } else {
        console.log(imageReq.responseText);
      }
    }
  };
  imageReq.send(null);
}

//just kidding it's fetch time
function callRSS(fun, src) {
  let dest = "";
  if (src === "station") {
    dest = "onthestation_rss";
  } else if (src === "breaking") {
    dest = "breaking_news";
  } else if (src === "kepler") {
    dest = "mission_pages/kepler/news/kepler-newsandfeatures-RSS";
  } else if (src === "chandra") {
    dest = "chandra_images";
  } else {
    console.log("Broken callRSS");
  }

  fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.nasa.gov%2Frss%2Fdyn%2F" + dest + ".rss&api_key=ckr2tgfxrtuytoqhcpbfipybboxrrw6ti2hnpfgg  ")
    //@Instructor - why do we need this response.text() thing? It seems to be some built in property but I can't find a solid explanation
    .then((response) => response.text())
    .then((lel) => {
      feed = JSON.parse(lel).items;
      fun(feed);
    });
}

//Callbacks
function compareObjects(a, b) {
  date1 = Date.parse(a.patent_date);
  date2 = Date.parse(b.patent_date);
  return date2 - date1;
}

function displayImg(response) {
  // var target = document.getElementById("img-target");

  console.log(response);
  console.log(response.url);
  target = document.getElementById("img-target");
  target.innerHTML = "<img src=" + response.url + "></img>";

  target2 = document.getElementById("img-desc");
  target2.innerHTML = response.explanation;

  target3 = document.getElementById("img-title");
  target3.innerHTML = response.title;
}

function log() {
  console.log("This is a test of browser dev tools");
}

function displayFeed(feed) {
  numToDisplay = 5;
  for (var i = 0; i < numToDisplay; i++) {
    console.log(feed[i]);
    document.getElementById("news-pubdate-" + i).innerHTML = feed[i].pubDate;
    document.getElementById("news-img-" + i).innerHTML = "<img src='" + feed[i].enclosure.link + "'/>";
    document.getElementById("news-title-" + i).innerHTML = "<a href='" + feed[i].link + "'/>" + feed[i].title + "</a>";
    document.getElementById("news-desc-" + i).innerHTML = feed[i].description;
  }
}

function displayPatent(response) {
  //console.log(response.assignees);
  data = response.assignees;
  var responseHolder = {};
  var goodResponses = [];

  for (var patentIterator = 0; patentIterator < data.length; patentIterator++) {
    if (data[patentIterator].gov_interests[0].govint_org_id != null) {
      goodResponses.push(data[patentIterator]);
    }
  }

  //For every object in the arryay, create a new object that contains the patent info and assignee on the same level
  console.log(goodResponses);

  var flatObjects = [];
  goodResponses.forEach(function (v) {
    v.patents.forEach(function (p) {
      p.assignee_id = v.assignee_id;
      p.assignee_organization = v.assignee_organization;
      flatObjects.push(p);
    });
    //Sort all patents by date key.
  });
  var sortedObjects = [...flatObjects];
  sortedObjects.sort(compareObjects);
  console.log(sortedObjects);
  // console.log(flatObjects);
  function patsToSlider(num) {
    let n = num;
    for (n = 0; n < num; n++) {
      document.getElementById("patent-date-" + n).innerHTML = "Patented on: " + sortedObjects[n].patent_date;
      document.getElementById("patent-title-" + n).innerHTML = sortedObjects[n].patent_title;

      document.getElementById("patent-btn-" + n).href = "http://patft.uspto.gov/netacgi/nph-Parser?TERM1=" + sortedObjects[n].patent_number + "&Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=0&f=S&l=50";
    }
  }

  patsToSlider(3);

  //Next bracket ends displayPatents
}

/*

https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.nasa.gov%2Frss%2Fdyn%2Fbreaking_news.rss&api_key=ckr2tgfxrtuytoqhcpbfipybboxrrw6ti2hnpfgg

var result = [].concat(...input.map(v => {
  var {assignee_id} = v;
  var {assignee_organization} = v;
  return v.patents.map(p => {
    return {
      ...p, 
      assignee_id,
      assignee_organization
    };
  };
});

var result = [];
input.forEach(function(v) {
  v.patents.forEach(function(p) {
    p.assignee_id = v.assignee_id;
    p.assignee_organization = v.assignee_organization;
    result.push(p);
  });


var result = [];
input.forEach(v => {
  result = result.concat(
    v.patents.map(p => {
      p.assignee_id = v.assignee_id;
      p.assignee_organization = v.assignee_organization;
      return p;
    }
  );
});


////

So,
var a = v.a;

can be written as
var {a} = v;

///

var result = [].concat(...input.map(v => {
  var {assignee_id} = v;
  var {assignee_organization} = v;
  return v.patents.map(p => {
    return {
      ...p,
      assignee_id,
      assignee_organization
    };
  };
});


  
});
*/
