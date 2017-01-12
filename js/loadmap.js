
// CREATE MAP WITH THREE ZOOM LEVELS AND TWO ELEMENTS:

var geography = [["US", "United States"],["AL", "Alabama"],["AK", "Alaska"],["AZ", "Arizona"],["AR", "Arkansas"],["CA", "California"],
["CO", "Colorado"],["CT", "Connecticut"],["DE", "Delaware"],["FL", "Florida"],["GA", "Georgia"],["HI", "Hawaii"],["ID", "Idaho"],
["IL", "Illinois"],["IN", "Indiana"],["IA", "Iowa"],["KS", "Kansas"],["KY", "Kentucky"],["LA", "Louisiana"],["ME", "Maine"],
["MD", "Maryland"],["MA", "Massachusetts"],["MI", "Michigan"],["MN", "Minnesota"],["MS", "Mississippi"],["MO", "Missouri"],
["MT", "Montana"],["NE", "Nebraska"],["NV", "Nevada"],["NH", "New Hampshire"],["NJ", "New Jersey"],["NM", "New Mexico"],
["NY", "New York"],["NC", "North Carolina"],["ND", "North Dakota"],["OH", "Ohio"],["OK", "Oklahoma"],["OR", "Oregon"],
["PA", "Pennsylvania"],["RI", "Rhode Island"],["SC", "South Carolina"],["SD", "South Dakota"],["TN", "Tennessee"],["TX", "Texas"],
["UT", "Utah"],["VT", "Vermont"],["VA", "Virginia"],["WA", "Washington"],["WV", "West Virginia"],["WI", "Wisconsin"],
["WY", "Wyoming"]
];

document.getElementById('application').innerHTML = "<br><h3 id='selectstcd'>" +
                                                      "Interact with the map or select:" +
                                                      "<select onchange='selstate();' id='selstate'>" +
                                                        "<option>Select Geography</option>" +
                                                      "</select>" +
                                                    "</h3><br>";

for(var i=0;i<geography.length;i++){
  document.getElementById('selstate').innerHTML += "<option value='"+geography[i][0]+"'>"+geography[i][1]+"</option>";
};

var mapdata = [];
var tabdata = [];
var testme;

function selstate(n){

  function fireClick(node){
    if(document.createEvent){
      var evt = document.createEvent('MouseEvents');
      evt.initEvent("click",true,false)
      node.dispatchEvent(evt);
    } else if(document.createEventObject){
      node.fireEvent('onclick');
    } else if (typeof node.onclick == 'function'){
      node.onclick();
    }
  };

  var sel = document.getElementById('selstate');
  var selst = sel.options[sel.selectedIndex].value;

  if(selst !== "US"){
    fireClick(document.getElementById(selst));
  } else {
    updatemap();
  }
};

    // ADD MOVE TO FRONT AND MOVE TO BACK FUNCTIONS TO D3

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

function CreateMap(NAICS_pick, NAICS_pick_ttl, year_pick, var_pick){

mapdata = [];
tabdata = [];


// SELECT SELECTED YEAR IN DROP DOWN MENU
var stdd = document.getElementById('year');
        for (i=0;i<stdd.options.length;i++){
          if(stdd.options[i].value == year_pick){
            stdd.options[i].selected = true;
            break;
          }
        };



// ALL DIMENTIONS BASED ON WIDTH ASSIGNED HERE
var width = 820;

// GRAB LIST OF GEOID AND TTL FROM CBP 13

// REMOVE ELEMENTS THAT NEED TO BE GENERATED ON MAP LOAD
  if(document.getElementById('Map')){
    d3.select("#Map").remove();
    d3.select("#mouse").remove();
    d3.select('#tab1').remove();
    d3.select('#tab2').remove();
    d3.select('#tab3').remove();
    d3.selectAll('#tab4').remove();
    d3.selectAll('#tab5').remove();
    d3.select('#tab-1').remove();
    d3.select('#tab-2').remove();
    d3.select('#tab-3').remove();
    d3.selectAll('#tab-5').remove();
    d3.selectAll('#tab-4').remove();
    d3.select('#legend').remove();
    d3.select('#legend_lbl').remove();
  };

    // Set Width and Height for the entire SVG element
  var height = width*.47;
  var center = [width / 2, height / 2];
  var centered;


  // Translate Geographic projection to fit in SVG element
  
  d3.geo.censusUSA = function() {
  var lower48 = d3.geo.albers();

  var alaska = d3.geo.albers()
      .rotate([154,0])
      .center([-2,58.5])
      .parallels([55,65]);

  var hawaii = d3.geo.albers()
      .rotate([157,0])
      .center([-3,19.9])
      .parallels([8,18]);

  var puertoRico = d3.geo.albers()
      .parallels([8, 18]);

  function censusUSA(coordinates) {
    var lon = coordinates[0],
        lat = coordinates[1];
    return (lat > 50 ? alaska
        : lon < -140 ? hawaii
        : lat < 21 ? puertoRico
        : lower48)(coordinates);
  }

  censusUSA.scale = function(x) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(x);
    alaska.scale(x * .4);
    hawaii.scale(x);
    return censusUSA.translate(lower48.translate());
  };

  censusUSA.translate = function(x) {
    if (!arguments.length) return lower48.translate();
    var dz = lower48.scale() / 1000,
        dx = x[0],
        dy = x[1];
    lower48.translate([dx + 135 * dz, dy + 0 * dz]);
    alaska.translate([dx - 360 * dz, dy - 130 * dz]);
    hawaii.translate([dx - 460 * dz, dy + 180 * dz]);
    puertoRico.translate([dx + 10000 * dz, dy + 10000 * dz]);
    return censusUSA;
  };

  return censusUSA.scale(lower48.scale());
};


  var projection = d3.geo.censusUSA()
    .scale(width)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path().projection(projection);

  var x = width / 2;
  var y = height / 2;
  var z = 1;


  // Create SVG element in Body
  var svg = d3.select("#application")
    .append("svg")
    .attr("xmlns","http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 "+width+" "+height)
    .attr("preserveAspectRatio", "xMinYMax slice")
    .attr("id", "Map");

  // CREATE GROUPING ELEMENT FOR MAP
  var g = svg.append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 "+width+" "+height)
    .style("stroke-width", "1px");

      // CREATE GROUPING ELEMENT FOR RESET ZOOM FUNCTIONS
  var resetg = svg.append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 "+width+" "+height)
    .style("stroke-width", "1px");

// PUT BORDER BOXES AROUND MAP HAWAII AND ALASKA

  g.append("rect")
    .attr("class", "AH_outline")
    .attr("height", height - 2)
    .attr("width", width - 2)
    .attr("y",1)
    .attr("x",1);

  g.append("rect")
    .attr("class", "AH_outline")
    .attr("height", width*.15)
    .attr("width", width*.25);

  g.append("rect")
    .attr("class", "AH_outline")
    .attr("height", width*.15)
    .attr("width", width*.17)
    .attr("y",height - width*.15);


// CREATE DIV FOR TOOLTIP (ON MOUSEOVER EVENT)

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "mouse")
    .style("opacity", 0)
    .style("width", 500);

    d3.select("#application")
    .append("div")
    .attr("id", "legend_lbl");

    d3.select("#application")
    .append("div")
    .attr("id", "legend");

// PULL GEOJSON FILES

  d3.json("cb_2013_us_state_20m.geojson", function(map) {

    d3.json(API +
          "?get=GEO_TTL," +
              "NAICS_TTL," +
              "EMP," +
              "EMP_F," +
              "EMP_S," +
              "EMP_S_F," +
              "PAYANN," +
              "PAYANN_F," +
              "PAYANN_S," +
              "PAYANN_S_F," +
              "PAYANPW," +
              "PAYANPW_F," +
              "PAYANPW_S," +
              "PAYANPW_S_F," +
              "RCPTOT," +
              "RCPTOT_F," +
              "RCPTOT_S," +
              "RCPTOT_S_F," +
              "VALADD," +
              "VALADD_F," +
              "VALADD_S," +
              "VALADD_S_F," +
              "CEXTOT," +
              "CEXTOT_F," +
              "CEXTOT_S," +
              "CEXTOT_S_F," +
              "YEAR" +
          "&for=us:*" +
          "&NAICS=" + NAICS_pick +
          "&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0", function(US){

    d3.json(API +
            "?get=GEO_TTL," +
                "NAICS_TTL," +
                "EMP," +
                "EMP_F," +
                "EMP_S," +
                "EMP_S_F," +
                "PAYANN," +
                "PAYANN_F," +
                "PAYANN_S," +
                "PAYANN_S_F," +
                "PAYANPW," +
                "PAYANPW_F," +
                "PAYANPW_S," +
                "PAYANPW_S_F," +
                "RCPTOT," +
                "RCPTOT_F," +
                "RCPTOT_S," +
                "RCPTOT_S_F," +
                "VALADD," +
                "VALADD_F," +
                "VALADD_S," +
                "VALADD_S_F," +
                "CEXTOT," +
                "CEXTOT_F," +
                "CEXTOT_S," +
                "CEXTOT_S_F," +
                "YEAR" +
            "&for=state:*" +
            "&NAICS=" + NAICS_pick +
            "&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0", function(STATE){

    d3.json(API +
            "?get=GEO_TTL," +
                "NAICS_TTL," +
                "EMP," +
                "EMP_F," +
                "EMP_S," +
                "EMP_S_F," +
                "PAYANN," +
                "PAYANN_F," +
                "PAYANN_S," +
                "PAYANN_S_F," +
                "PAYANPW," +
                "PAYANPW_F," +
                "PAYANPW_S," +
                "PAYANPW_S_F," +
                "RCPTOT," +
                "RCPTOT_F," +
                "RCPTOT_S," +
                "RCPTOT_S_F," +
                "VALADD," +
                "VALADD_F," +
                "VALADD_S," +
                "VALADD_S_F," +
                "CEXTOT," +
                "CEXTOT_F," +
                "CEXTOT_S," +
                "CEXTOT_S_F," +
                "YEAR" +
            "&for=US:*" +
            "&NAICS=*" +
            "&YEAR=" + year_pick +
            "&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0", function(INDUST){



      for (i=1;i<US.length;i++){
        mapdata.push(US[i]);
      };
      
      for (i=1;i<STATE.length;i++){
        mapdata.push(STATE[i]);
      };

// CREATE FIRST TWO TABLES 
    for(i=0;i<mapdata.length;i++){
    if(mapdata[i][28] == "0"){
      tabdata.push(mapdata[i]);
    }
  };

createtable("US data by Year", 1, tabdata);

tabdata = [];

  for(i=0;i<mapdata.length;i++){
    if(Number(mapdata[i][26]) == year_pick){
      tabdata.push(mapdata[i]);
    }
  };

createtable("US data by State for "+year_pick, 2, tabdata);

tabdata = [];

  for(i=1;i<INDUST.length;i++){
      tabdata.push(INDUST[i]);
  };

createtable("US data by Industry for "+year_pick, 3, tabdata);

tabs(1);

    for (i=0;i<map.features.length;i++){
      for (j=1;j<mapdata.length;j++){
        if(Number(map.features[i].properties.GEOID) == Number(mapdata[j][28]) && mapdata[j][26] == year_pick){
          map.features[i].properties.NAICS_TTL = mapdata[j][1];
          map.features[i].properties.EMP = mapdata[j][2];
          map.features[i].properties.EMP_F = mapdata[j][3];
          map.features[i].properties.EMP_S = mapdata[j][4];
          map.features[i].properties.EMP_S_F = mapdata[j][5];
          map.features[i].properties.PAYANN = mapdata[j][6];
          map.features[i].properties.PAYANN_F = mapdata[j][7];
          map.features[i].properties.PAYANN_S = mapdata[j][8];
          map.features[i].properties.PAYANN_S_F = mapdata[j][9];
          map.features[i].properties.PAYANPW = mapdata[j][10];
          map.features[i].properties.PAYANPW_F = mapdata[j][11];
          map.features[i].properties.PAYANPW_S = mapdata[j][12];
          map.features[i].properties.PAYANPW_S_F = mapdata[j][13];
          map.features[i].properties.RCPTOT = mapdata[j][14];
          map.features[i].properties.RCPTOT_F = mapdata[j][15];
          map.features[i].properties.RCPTOT_S = mapdata[j][16];
          map.features[i].properties.RCPTOT_S_F = mapdata[j][17];
          map.features[i].properties.VALADD = mapdata[j][18];
          map.features[i].properties.VALADD_F = mapdata[j][19];
          map.features[i].properties.VALADD_S = mapdata[j][20];
          map.features[i].properties.VALADD_S_F = mapdata[j][21];
          map.features[i].properties.CEXTOT = mapdata[j][22];
          map.features[i].properties.CEXTOT_F = mapdata[j][23];
          map.features[i].properties.CEXTOT_S = mapdata[j][24];
          map.features[i].properties.CEXTOT_S_F = mapdata[j][25];
        };
      };
    };


// NOW THAT DATA IS LOADED CREATE DOMAIN (QUINITILES) FOR COLORS TO BE CHOSEN

  // CREATE DOMAIN VARIABLE TO PICK APART FROM VALUES

  var domain = [];
  for(var i=0; i<map.features.length; i++){
    if(eval("map.features[i].properties."+var_pick) == undefined | 
            (eval("map.features[i].properties."+var_pick) == 0 && 
             eval("map.features[i].properties."+var_pick+"_F") !== "")) {
          } else {
            eval("domain.push(map.features[i].properties."+var_pick+")");
          }
  };
  // FILTER OUT NAN AND SORT ASCENDING
  domain = domain.filter(function(i){return true;}).sort(function(a,b){return a-b});
  // MAKE UNIQUE TO CREATE DISTINCT RANGES
  domain.uniq();


  // SET DOMAIN TO QUINTILES
  var color = d3.scale.quantile()
    .range(["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"])
    .domain([
      d3.quantile(domain,0),
      d3.quantile(domain,.25),
      d3.quantile(domain,.5),
      d3.quantile(domain,.75),
      d3.quantile(domain,1)
      ]);

// LOAD ALL MAP FEATURES AND MAP DATA INTO SVG ELEMENT INCLUDING MOUSEOVER AND MOUSECLICK EFFECTS

  var format = d3.format(",.0f");

  g.selectAll("path")
      .data(map.features)
    .enter().append("path")
      .attr("d", path)
      .attr("id", function(d){
        return d.properties.STUSPS;
      })
      .attr("class", "outline")
      .style("fill", function(d){
        


        if(eval("d.properties."+var_pick) == undefined | (eval("d.properties."+var_pick) == 0 && eval("d.properties."+var_pick+"_F") !== "")) {
          } else {
            return eval("color(d.properties."+var_pick+")");
          }
      })
  
  .on("mouseover", function(d){
    div.transition()
      .duration(200)
      .style("opacity", .8);

    function FG_TT(varb) { 
      if(eval("d.properties."+varb) == undefined | (eval("d.properties."+varb) == 0 && eval("d.properties."+varb+"_F") !== "")) {
        return "Data not Available";
      } else {
        return format(eval("d.properties."+varb));
      };
    };

        document.getElementById("mouse").innerHTML ="<b><h7 style='font-size:1em'>"+d.properties.NAME+
                                                    "</h7></b><br>"+NAICS_pick_ttl+"<br><br>"+
                                                    "Employment in "+year_pick+" = <b>"+FG_TT("EMP")+"</b><br>"+
                                                    "Annual payroll in "+year_pick+" = <b>"+FG_TT("PAYANN")+"</b><br>"+
                                                    "Production workers annual wages in "+year_pick+" = <b>"+FG_TT("PAYANPW")+"</b><br>"+
                                                    "Total value of shipments and receipts for services in "+year_pick+" = <b>"+FG_TT("RCPTOT")+"</b><br>"+
                                                    "Value Added in "+year_pick+" = <b>"+FG_TT("VALADD")+"</b><br>"+
                                                    "Capital Expenditures in "+year_pick+" = <b>"+FG_TT("CEXTOT");

    d3.select(this)
      .style("fill", "#CC9900");
  })

  .on("mousemove", function(d){
      var tooltip_left;
    var maxleft = (width);
    if(d3.event.pageX >= maxleft){
      tooltip_left = maxleft;
    } else {
      tooltip_left = (d3.event.pageX);
    }

    div
    .style("left", tooltip_left+20 + "px")
    .style("top", (d3.event.pageY-40) + "px");
    })
      
  .on("mouseout", function(d){
    div.transition()
      .duration(200)
      .style("opacity", 0);

    d3.select(this)
      .style("fill", function(d){
         if(eval("d.properties."+var_pick) == undefined | (eval("d.properties."+var_pick) == 0 && eval("d.properties."+var_pick+"_F") !== "")) {
          } else {
            return eval("color(d.properties."+var_pick+")");
          }
    })                
  })
  .on("click", clicked);


// GENERATE TOP LEGEND USING IN LINE UL/LI 

  var Stat_label;
  for(i=0;i<stat.length;i++){
    if(stat[i][0] == var_pick){
      Stat_label = stat[i][1];
    }
  };

  document.getElementById('legend_lbl').innerHTML = "<br>" + Stat_label;

  var legendsel = d3.select('#legend')
    .append('ul')
    .attr('class', 'list-inline')
    .attr('id', 'Legend');

    legendsel.append('li').attr('class', 'key2').style('border-top-color', "#FFF");

  legendsel.selectAll('li.key')
    .data(color.range())
  .enter().append('li')
    .attr('class', 'key')
    .style('border-top-color', String)
    .text(function(d) {
          var r = color.invertExtent(d);
          return format(r[0]);
          }
      );

    // FOR TOP LEGEND GENERATE MAX VALUE
  var maxvalstate = d3.max(map.features, function(d){return eval("Number(d.properties."+var_pick+")");});


  document.getElementById('Legend').innerHTML += 
    '<li class="key" style="border-top-color: #FFF;">'+format(maxvalstate)+
    '</li><li class="key" style="border-top-color: #000;">Data not Available</li>';

  });
  });
  });

// CREATE FUNCTION FOR CLICKED EVENT
     function clicked(d) {     

// CREATE STATE TABS

        d3.selectAll('#tab4').remove();
        d3.selectAll('#tab5').remove();
        d3.selectAll('#tab-4').remove();
        d3.selectAll('#tab-5').remove();

     

      var x, y, z;

              if (d && centered !== d) {

      var state = d.properties.GEOID;

      var stdd = document.getElementById('selstate');
        for (i=0;i<stdd.options.length;i++){
          if(stdd.options[i].value == d.properties.STUSPS){
            stdd.options[i].selected = true;
            break;
          }
        };

        resetg.append("rect")
        .attr("class", "reset_box")
        .attr("id", "reset_box")
        .attr("height", 50)
        .attr("width", 100)
        .attr("x", width-110)
        .attr("y", height-60)
        .on("click", function(){
          x = width/2;
          y = height/2;
          z = 1;
          centered = null;
          clicked();
        })
        .on("mousemove", function(d){
          d3.select(this)
            .style("fill", "#66A3FF")
        })
        .on("mouseout", function(d){
          d3.select(this)
            .style("fill", "#0066FF")
        });
      resetg.append("text")
        .attr("id", "reset_box")
        .attr("x", width-87)
        .attr("y", height-30)
        .text("Zoom Out")
        .style("pointer-events", "none")
        .attr("fill", "white");

                tabdata = []

              for(i=0;i<mapdata.length;i++){
                if(mapdata[i][28] == state){
                  tabdata.push(mapdata[i]);
                }
              };

              if(tabdata[0] !== undefined){
                createtable(d.properties.NAME+" data by year", 4, tabdata);
              };

              tabdata = [];

              d3.json("http://api.census.gov/data/timeseries/asm/state?" +
                "get=GEO_TTL," +
                  "NAICS_TTL," +
                  "EMP," +
                  "EMP_F," +
                  "EMP_S," +
                  "EMP_S_F," +
                  "PAYANN," +
                  "PAYANN_F," +
                  "PAYANN_S," +
                  "PAYANN_S_F," +
                  "PAYANPW," +
                  "PAYANPW_F," +
                  "PAYANPW_S," +
                  "PAYANPW_S_F," +
                  "RCPTOT," +
                  "RCPTOT_F," +
                  "RCPTOT_S," +
                  "RCPTOT_S_F," +
                  "VALADD," +
                  "VALADD_F," +
                  "VALADD_S," +
                  "VALADD_S_F," +
                  "CEXTOT," +
                  "CEXTOT_F," +
                  "CEXTOT_S," +
                  "CEXTOT_S_F," +
                  "YEAR" +
                "&for=state:" + Number(state) +
                "&NAICS=*" +
                "&YEAR=" + year_pick +
                "&key=86ef546139db8dddaff1b4a9562f9a902f2b60b0", function(INDUST){

                  for(i=1;i<INDUST.length;i++){
                    tabdata.push(INDUST[i]);
                  };

                createtable(d.properties.NAME+" data by Industry for "+ year_pick, 5, tabdata);
                tabs(4);
              });

                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                z = 2;
                centered = d;

                d3.selectAll(".outline")
                  .style("stroke", "#252525");
                d3.selectAll(".outline")
                  .moveToBack();

                d3.select(this)
                  .style("stroke", "#CC9900")
                  .moveToFront();

                d3.selectAll('.AH_outline')
                  .style("display", "none");          



              } else {
                x = width / 2;
                y = height / 2;
                z = 1;
                centered = null;

                d3.selectAll(".outline")
                  .style("stroke", "#252525");

                d3.selectAll('.AH_outline')
                  .style("display", "block");

                d3.selectAll('#tab-4').remove();
                d3.selectAll('#tab-5').remove();
                d3.selectAll('#reset_box').remove();

                tabs(2);

                      var stdd = document.getElementById('selstate');
                      for (i=0;i<stdd.options.length;i++){
                        if(stdd.options[i].value == "US"){
                          stdd.options[i].selected = true;
                          break;
                        }
                      };

              }

              g.selectAll("path")
                  .classed("active", centered && function(d) { return d === centered; });

              g.transition()
                  .duration(750)
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + z + ")translate(" + -x + "," + -y + ")")
                  .style("stroke-width", 1 / z + "px");

  };});

};