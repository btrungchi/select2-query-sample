var csv_file = "";

loadCSV = function(CSV_link, callbackFunc) {
    d3.csv(CSV_link, callbackFunc);   
}

getAge = function(csvData) {
    if (!csvData) {return;}
    var age = []
    csvData.forEach(function(row) {
        if(age.indexOf(row["Age"]) === -1){
            age.push(row["Age"]);        
        }
    });
    return age;
}

getRace = function(csvData) {
    if (!csvData) {return;}
    var race = []
    csvData.forEach(function(row) {
        if(race.indexOf(row["race"]) === -1){
            race.push(row["race"]);        
        }
    });
    return race;
}

showTable = function(csvData) {
    var tableHtml = '<table id="data-table" style="table-layout:fixed; width:100%; word-break:break-all;" class="table table-striped table-bordered" cellspacing="0" width="100%">';
    tableHtml += "<thead><tr>"

    if (!csvData || !csvData[0]) {
        tableHtml += "<th>No data</th>";
        tableHtml += "</tr></thead><tbody>";    
        tableHtml += '</tbody></table>';
        $("#show-data-div").html(tableHtml);
        return;
    }
    
    Object.keys(csvData[0]).forEach(function(key) {
        tableHtml += "<th>" + key + "</th>";
    });
    tableHtml += "</tr></thead><tbody>";    
    csvData.forEach(function(row) {
        tableHtml += "<tr>";    
        Object.values(row).forEach(function(value) {
            tableHtml += "<td>" + value + "</td>";
        });
        tableHtml += "</tr>";
    });
    tableHtml += '</tbody></table>';

    $("#show-data-div").html(tableHtml);
}

csvFilter = function(csvData, arrColumnName, arrColumnValue) {
    var filteredData = csvData.filter(function(row) {
        var goodRow = true;
        for (i = 0; i<arrColumnName.length; i++) {
            if (arrColumnValue[i] != '---' && row[arrColumnName[i]] != arrColumnValue[i]) {
                goodRow = false;
            }
        }
        if (goodRow) {
            return row;
        }
    });
    return filteredData;
}

$(document).ready(function() {
    loadCSV(csv_file, function(csvData) {
        var age = getAge(csvData);
        var race = getRace(csvData);
        showTable(csvData);

        $(".js-example-data-array").select2({
          data: age
        });

        $(".js-example-data-array-selected").select2({
          data: race
        });

        $("#select-group-1").change(function() {
            filteredData = csvFilter(csvData, ["Age", "race"], [$("#select-group-1").val(), $("#select-group-2").val()] );
            showTable(filteredData);
        });

        $("#select-group-2").change(function() {
            filteredData = csvFilter(csvData, ["Age", "race"], [$("#select-group-1").val(), $("#select-group-2").val()] );
            showTable(filteredData);
        });
    });
});