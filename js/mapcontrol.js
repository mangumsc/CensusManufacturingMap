// BASE API

var API = "http://web10.dev.rm.census.gov/data/timeseries/asm/state";

// VARIABLES TO BE ADDED

var stat_sel = ["EMP","PAYANN","PAYANPW","RCPTOT","VALADD","CEXTOT"];

// GRAB VARIABLES
var ind = [];
var years = [];
var latest_year;
var stat = [];

d3.json(API+"/variables",function(d){

 for(j=0;j<stat_sel.length;j++){
  for(i=1;i<d.length;i++){
    if(stat_sel[j]==d[i][0]){
      stat.push([stat_sel[j],d[i][1]]);
    }  
  }
 };

mapcontrol = document.getElementById('mapcontrol');

mapcontrol.innerHTML = "<h3>Select a Statistic</h3>";

for(i=0;i<stat.length;i++){
  var checked = "";
  if(i==0){checked = "checked"} else {checked = ""};
  mapcontrol.innerHTML += "<input type='radio' name='variables' value='"+stat[i][0]+"' "+checked+">"+stat[i][1]+"<br>";
};

// GET YEARS AND NAICS 

Array.prototype.uniq = function(){
    var self = this;
    var _a = this.concat().sort();
    _a.sort(function(a,b){
        if(a == b){
            var n = self.indexOf(a);
            self.splice(n,1);
        }
    });
    return self;
};

d3.json(API + "?get=NAICS,NAICS_TTL,YEAR&for=us:*&NAICS=*&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0",function(d){


mapcontrol.innerHTML += '<br><br><h3>Enter a manufacturing NAICS code or Title</h3>'+
                        '<input type="search" size="60%" title="Enter a NAICS code or Title"'+
                        'name="search" id="search" placeholder=""></input>'+
                        '<br><br>'+
                        '<h3>Select a year:</h3>'+
                        '<select id="year"></select>'+
                        '<br><br><br>'+
                        '<input type="button" value="Put Data On Map" onclick="updatemap();"> </input>';

 for(i=1;i<d.length;i++){
  ind.push(d[i][0]+": "+d[i][1]);
 };

 ind.uniq();

 $("#search").autocomplete({source:ind, minLength: 0});

 for(i=1;i<d.length;i++){
  years.push(d[i][2]);
 };

 years.uniq().sort().reverse();


 for(i=0;i<years.length;i++){
  document.getElementById('year').innerHTML += "<option>"+years[i]+"</option>";
 }
 latest_year = years[0];

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
};

var maploadcontrol = parseURLParams(window.location.href);

if(maploadcontrol == undefined){
  document.getElementById('search').value = '31-33: Manufacturing';
  CreateMap('31-33','Manufacturing',latest_year,'EMP');  
} else {
  if(maploadcontrol.naics == undefined){usr_naics = '31-33'}else{usr_naics = maploadcontrol.naics};
  if(maploadcontrol.year == undefined){usr_year = 2013}else{usr_year = maploadcontrol.year};
  if(maploadcontrol.variable == undefined){usr_variable = 'EMP'}else{usr_variable = maploadcontrol.variable};

     console.log(ind.length);

  for(i=1;i<ind.length;i++){
    if(usr_naics == Number(ind[i].split(":")[0])){
      usr_naics_ttl = ind[i].split(":")[1];
      document.getElementById('search').value = ind[i];
    }
  };

  CreateMap(usr_naics,
            usr_naics_ttl,
            usr_year,
            usr_variable);
};
});
});

function updatemap(){
  if(document.getElementById('search').value === ""){
    searchnaics = '31-33';
    searchnaics_TTL = 'Manufacturing';
  } else if(document.getElementById('search').value.split(':')[1] === "" && !document.getElementById('search').value.split(':')[0]){
    code_naics = document.getElementById('search').value.split(':')[0];

    for (i=0;i<ind.length;i++){
      if (ind[i].split(":")[0] == code_naics){
        searchnaics = ind[i].split(":")[0];
        searchnaics_TTL = ind[i].split(":")[1];
      }
    }
  } else {
  var searchnaics = document.getElementById('search').value.split(':')[0];
  var searchnaics_TTL = document.getElementById('search').value.split(':')[1];
};
    var serchselect = document.getElementById("year");
    var searchyear = serchselect.options[serchselect.selectedIndex].text;

  var topic;
  var radio = document.getElementsByName('variables');
    for(var i=0;i<radio.length;i++){
        if(radio[i].checked){
          var topic = radio[i].value;
        };
      };

console.log(searchnaics, searchnaics_TTL, searchyear, topic);

  CreateMap(searchnaics, searchnaics_TTL, searchyear, topic);
};