var csv_file = "";

loadCSV = function (CSV_link, callbackFunc) {
    d3.csv(CSV_link, callbackFunc);
}

getAge = function (csvData) {
    if (!csvData) { return; }
    var age = []
    csvData.forEach(function (row) {
        if (age.indexOf(row["Age"]) === -1) {
            age.push(row["Age"]);
        }
    });
    return age;
}

getRace = function (csvData) {
    if (!csvData) { return; }
    var race = []
    csvData.forEach(function (row) {
        if (race.indexOf(row["race"]) === -1) {
            race.push(row["race"]);
        }
    });
    return race;
}

showTable = function (csvData) {
    var tableHtml = '<table id="data-table" style="table-layout:fixed; width:100%; word-break:break-all;" class="table table-striped table-bordered" cellspacing="0" width="100%">';
    tableHtml += "<thead><tr>"

    if (!csvData || !csvData[0]) {
        tableHtml += "<th>No data</th>";
        tableHtml += "</tr></thead><tbody>";
        tableHtml += '</tbody></table>';
        $("#show-data-div").html(tableHtml);
        return;
    }

    Object.keys(csvData[0]).forEach(function (key) {
        tableHtml += "<th>" + key + "</th>";
    });
    tableHtml += "</tr></thead><tbody>";
    csvData.forEach(function (row) {
        tableHtml += "<tr>";
        Object.values(row).forEach(function (value) {
            tableHtml += "<td>" + value + "</td>";
        });
        tableHtml += "</tr>";
    });
    tableHtml += '</tbody></table>';

    $("#show-data-div").html(tableHtml);
}

csvFilter = function (csvData, arrColumnName, arrColumnValue) {
    var filteredData = csvData.filter(function (row) {
        var goodRow = true;
        for (i = 0; i < arrColumnName.length; i++) {
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

$(document).ready(function () {
    $('#csv-url').keypress(function (event) {
        if (event.keyCode == 13) {
            $('#submit-request').click();
            event.preventDefault();
        }
    });

    $("#submit-request").click(function () {
        $("#show-data-div").html("Loading...");
        var csvUrl = $("#csv-url").val();
        if (csvUrl == '') {
            $("#show-data-div").html("Please fill in CSV file url");
        } else {
            $.ajax({
                type: "POST",
                url: "/get-data",
                data: {
                    url: csvUrl
                },
                success: function (jsonData) {
                    console.log(jsonData);
                    showTable(jsonData);
                    var age = getAge(jsonData);
                    var race = getRace(jsonData);

                    $("#select-group-1").select2({
                        data: age
                    });

                    $("#select-group-2").select2({
                        data: race
                    });

                    $(".group-select").change(function () {
                        filteredData = csvFilter(jsonData, ["Age", "race"], [$("#select-group-1").val(), $("#select-group-2").val()]);
                        showTable(filteredData);
                    });
                },
                error: function (jqXHR, exception) {
                    $("#show-data-div").html(exception);
                }
            });
            return false;
        }
    });
});

