document.getElementById('table').innerHTML += "<div id='tabs-container'>" +
                                                      "<ul id='tabs-menu' class='tabs-menu'></ul>" +
                                                      "<div id='tab'>" +
                                                      "</div>" +
                                             "</div>";


function tabs(child){
  $('#tabs-menu li').removeClass('active');
  $('#tabs-menu li:nth-child('+child+')').addClass('active');
  $('#tab div').hide();
  $('#tab div:nth-child('+child+')').show();
  $('#tabs-menu a').click(function() {
    $('#tabs-menu li').removeClass('active');
    $(this).parent().addClass('active');
    var activeTab = $(this).attr('href');
    $('#tab > div:visible').hide();
    $(activeTab).show();
    return false;
  })
};

function hs_SE(table_num){
  Columns = document.getElementsByName("SE"+table_num);
  if(document.getElementById("SE_"+table_num).checked == false){
    for(i=0;i<Columns.length;i++){
      Columns[i].style.display = "none";
    }
  } else {
    for(i=0;i<Columns.length;i++){
       Columns[i].style.display = "";
    };
  };
};

jQuery.tablesorter.addParser({
  id: "comma",
  is: function(s) {
    return /^[0-9]?[0-9,\.]*$/.test(s);
  },
  format: function(s) {
    return jQuery.tablesorter.formatFloat( s.replace(/,/g,'') );
  },
  type: "numeric"
});


function createtable(title, table_num, table_data_arr){

  var formattbla = d3.format(",");
  var formattblb = d3.format("$,.0f");
  var formattblc = d3.format("%,.0f");


  function hyperlink(fg, data){

    if(fg == "D"){
        return '<a style="cursor: help;" id="fg" title="'+
           'Withheld to avoid disclosing data\n of individual companies.\n\n'+
           'Data are included in higher level totals'+
           '">'+fg+'</a>';
    } else if (fg == "X"){
        return '<a style="cursor: help;" id="fg" title="'+
           'Not applicable'+
           '">'+fg+'</a>';
    } else if (fg == "S"){
        return '<a style="cursor: help;" id="fg" title="'+
           'Withheld because estimates did \nnot meet publication standards'+
           '">'+fg+'</a>';
    } else if (fg == "N"){
        return '<a style="cursor: help;" id="fg" title="'+
           'Not available or not comparable'+
           '">'+fg+'</a>';
    } else if (fg == "r"){
        return formattbla(data)+'<sup><a style="cursor: help;" id="fg" title="'+
           'Revised'+
           '">('+fg+')</a></sup>';
    } else if (fg == "s"){
        return formattbla(data)+'<sup><a style="cursor: help;" id="fg" title="'+
           'Sampling error exceeds 40 percent'+
           '">('+fg+')</a></sup>';
    } else if (fg == "a"){
        return '<a style="cursor: help;" id="fg" title="'+
           '0 to 19 employees'+
           '">'+fg+'</a></sup>';
    } else if (fg == "b"){
        return '<a style="cursor: help;" id="fg" title="'+
           '20 to 99 employees'+
           '">'+fg+'</a>';
    } else if (fg == "c"){
        return '<a style="cursor: help;" id="fg" title="'+
           '100 to 249 employees'+
           '">'+fg+'</a>';
    } else if (fg == "e"){
        return '<a style="cursor: help;" id="fg" title="'+
           '250 to 499 employees'+
           '">'+fg+'</a>';
    } else if (fg == "f"){
        return '<a style="cursor: help;" id="fg" title="'+
           '500 to 999 employees'+
           '">'+fg+'</a>';
    } else if (fg == "g"){
        return '<a style="cursor: help;" id="fg" title="'+
           '1,000 to 2,499 employees'+
           '">'+fg+'</a>';
    } else if (fg == "h"){
        return '<a style="cursor: help;" id="fg" title="'+
           '2,500 to 4,999 employees'+
           '">'+fg+'</a>';
    } else if (fg == "i"){
        return '<a style="cursor: help;" id="fg" title="'+
           '5,000 to 9,999 employees'+
           '">'+fg+'</a>';
    } else if (fg == "j"){
        return '<a style="cursor: help;" id="fg" title="'+
           '10,000 to 24,999 employees'+
           '">'+fg+'</a>';
    } else if (fg == "k"){
        return '<a style="cursor: help;" id="fg" title="'+
           '25,000 to 49,999 employees'+
           '">'+fg+'</a>';
    } else if (fg == "l"){
        return '<a style="cursor: help;" id="fg" title="'+
           '50,000 to 99,999 employees'+
           '">'+fg+'</a>';
    } else if (fg == "m"){
        return '<a style="cursor: help;" id="fg" title="'+
           '100,000 employees or more'+
           '">'+fg+'</a>';
    } else {
        return '<a style="cursor: help;" id="fg">'+fg+'</a>';
    }
  };


    function putflags(arrnum){
      if(table_data_arr[i][arrnum+1] !== null){
        return hyperlink(table_data_arr[i][arrnum+1], table_data_arr[i][arrnum]);
      } else {
        return formattbla(table_data_arr[i][arrnum]);
      };
    };

    d3.select('#tab-'+table_num).remove();

    var newdiv = document.createElement("div");
    newdiv.id = "tab-"+table_num;
    document.getElementById('tab').appendChild(newdiv);

  var table_head = "<table id='tableid"+table_num+"' class='tablesorter'><thead>" +
                    "<td colspan=33 style='text-align:center'>" + 
                        "<p style='font-size:2.5em; font-weight:bold'>" +
                        title + 
                        "</p><p style='font-size:.8em'>" +
                        " Show Standard Errors: " +
                        "<input type='checkbox' id='SE_"+table_num+"' onclick='hs_SE("+table_num+")'>" +
                        
                    "</td>" +
                  "<tr>" +
                    "<th>"+
                      "NAICS code" +
                    "</th>" +
                    "<th>" +
                      "NAICS code description" +
                    "</th>" +
                    "<th>" +
                      "Geography" +
                    "</th>" +
                    "<th>" +
                      "Year" +
                    "</th>" +
                    "<th>"+
                      "Number of Employees" +
                    "</th>"+

                    "<th name='SE"+table_num+"'>"+
                      "SE" +
                    "</th>"+

                    "<th>" +
                      "Annual Payroll ($1,000)" +
                    "</th>"+

                    "<th name='SE"+table_num+"'>"+
                      "SE" +
                    "</th>"+

                    "<th>" +
                      "Production workers average for year" +
                    "</th>" +

                    "<th name='SE"+table_num+"'>"+
                      "SE" +
                    "</th>"+

                    "<th>" +
                      "Total Value of shipments and receipts for services ($1,000)" +
                    "</th>" +

                    "<th name='SE"+table_num+"'>"+
                      "SE" +
                    "</th>"+

                    "<th>" +
                      "Value Added ($1,000)" +
                    "</th>" +

                    "<th name='SE"+table_num+"'>"+
                      "SE" +
                    "</th>"+

                    "<th>" +
                      "Total capital expenditures (new and used) ($1,000)" +
                    "</th>" +

                   "<th name='SE"+table_num+"'>"+
                      "SE" +
                    "</th>"+

                    "</tr></thead>";

  for (i=0;i<table_data_arr.length;i++){
      table_head += "<tr><td>"+table_data_arr[i][27]+"</td>"+
                "<td>"+table_data_arr[i][1]+"</td>"+
                "<td>"+table_data_arr[i][0]+"</td>"+
                "<td style='text-align: right'>"+table_data_arr[i][26]+"</td>"+
                "<td style='text-align: right'>"+putflags(2)+"</td>"+
                "<td name='SE"+table_num+"' style='text-align: right'>"+putflags(4)+"</td>"+
                "<td style='text-align: right'>"+putflags(6)+"</td>"+
                "<td name='SE"+table_num+"' style='text-align: right'>"+putflags(8)+"</td>"+
                "<td style='text-align: right'>"+putflags(10)+"</td>"+
                "<td name='SE"+table_num+"' style='text-align: right'>"+putflags(12)+"</td>"+
                "<td style='text-align: right'>"+putflags(14)+"</td>"+
                "<td name='SE"+table_num+"' style='text-align: right'>"+putflags(16)+"</td>"+
                "<td style='text-align: right'>"+putflags(18)+"</td>"+
                "<td name='SE"+table_num+"' style='text-align: right'>"+putflags(20)+"</td>"+
                "<td style='text-align: right'>"+putflags(22)+"</td>"+
                "<td name='SE"+table_num+"' style='text-align: right'>"+putflags(24)+"</td></tr>";
};

  document.getElementById('tabs-menu').innerHTML += "<li id='tab"+table_num+"'><a href='#tab-"+table_num+"'>"+title+"</a></li>";
  document.getElementById('tab-'+table_num).innerHTML = table_head;
  // document.getElementById('tableid'+table_num) += "input"
  tabs(table_num);
  hs_SE(table_num);
  var xls_name = 'ASM_'+title.replace(/ /g,'')+'.xls';
  document.getElementById('tab-'+table_num).innerHTML += '<br><a id="dlink'+table_num+'" style="display:none;"></a>'+
                                                         '<input type="button" onclick="tableToExcel(\'tableid'+table_num+'\', \''+title.replace(/ /g,'')+'\', \''+xls_name+'\', \''+table_num+'\')" value="Export to Excel">';

  $(document).ready(function(){$('#tableid'+table_num).tablesorter({
      sortInitialOrder: 'desc',
      headers: {
        4: {sorter: 'comma'},
        5: {sorter: 'comma'},
        6: {sorter: 'comma'},
        7: {sorter: 'comma'},
        8: {sorter: 'comma'},
        9: {sorter: 'comma'},
        10: {sorter: 'comma'},
        11: {sorter: 'comma'},
        12: {sorter: 'comma'},
        13: {sorter: 'comma'},
        14: {sorter: 'comma'},
        15: {sorter: 'comma'},
        16: {sorter: 'comma'}
      }
  });});
};

var tableToExcel = (function () {
      var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name, filename, tablen) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

            document.getElementById("dlink"+tablen).href = uri + base64(format(template, ctx));
            document.getElementById("dlink"+tablen).download = filename;
            document.getElementById("dlink"+tablen).click();

        }
    })();
