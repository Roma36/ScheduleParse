function getXml(groupNumber) {

    var scheduleLocalPath = "schedules/" + groupNumber + ".xml";
    var scheduleWebPath = 'https://cors-anywhere.herokuapp.com/'+'http://www.bsuir.by/schedule/rest/schedule/' + groupNumber;
    $.ajax({
        type: "GET",
        url: scheduleLocalPath,
        dataType: "xml",
        success: parseXml,
        error: function() {
            $.ajax({
                type: "GET",
                url: scheduleWebPath,
                dataType: "xml",
                success: parseXml,
                error: (function() {
                    alert('Schedule not found');
                })
            });
        }
    });

}



function parseXml(xml) {
    jsonSchedule = xmlToJson(xml);

    alert(jsonSchedule);
}



function loadXMLDoc(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var xmlSchedule = xhr.responseXML;
            parseXml(xmlSchedule);
        }
    };
    xhr.send(null);
}


$.support.cors = true;

getXml('351001');
