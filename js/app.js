function getXml(groupNumber) {

    var scheduleLocalPath = "schedules/" + groupNumber + ".xml";
    var scheduleWebPath = 'https://cors-anywhere.herokuapp.com/' + 'http://www.bsuir.by/schedule/rest/schedule/' + groupNumber;
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

function syncTemplateData(lesson) {
    var lessonItems = {};

    var weekNumbers = "";
    if (lesson.weekNumber.length === undefined) {
        weekNumbers += lesson.weekNumber["#text"];
    } else {
        $.each(lesson.weekNumber, function(i, week) {
            if (week["#text"] === "0") {
                weekNumbers = "";
                return false;
            }
            weekNumbers += week["#text"] + " ";
        });
    }
    lessonItems.weeks = weekNumbers;
    lessonItems.subject = lesson.subject["#text"];
    lessonItems.lessonType = lesson.lessonType["#text"];
    if (lesson.numSubgroup["#text"] !== "0") {
        lessonItems.numSubGroup = lesson.numSubgroup["#text"];
    } else {
        lessonItems.numSubGroup = "";
    }

    if (lesson.auditory !== undefined) {
        lessonItems.room = lesson.auditory["#text"];
    }
    lessonItems.time = lesson.lessonTime["#text"];
    if (lesson.employee !== undefined) {
        lessonItems.teacher = lesson.employee.firstName["#text"] + " " + lesson.employee.middleName["#text"] + " " + lesson.employee.lastName["#text"];
    }

    $('#lessonTmpl').tmpl(lessonItems).appendTo('.daily-schedule');
}

function parseXml(xml) {
    var jsonSchedule = xmlToJson(xml).scheduleXmlModels.scheduleModel;

    var day = 1;

    var count = 0;



    $('.daily-schedule').empty();

    if (jsonSchedule[day].schedule.length === undefined) {
        syncTemplateData(jsonSchedule[day].schedule);

    } else {
        $.each(jsonSchedule[day].schedule, function(i, lesson) {
            syncTemplateData(lesson)
        });

    }



}