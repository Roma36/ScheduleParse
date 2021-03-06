var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var lessonColors = {
    "ЛК": "green",
    "ПЗ": "orange",
    "ЛР": "red"
};

function getXml(groupNumber) {
    $(".schedule-container").hide();
    $("#blurringTextG").show();
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
                    $("#blurringTextG").hide();
                    $("#schedule-not-found").message();

                })
            });
        }
    });

}

function hasEqualElements(firstArray, secondArray) {
    for (var i = 0; i < firstArray.length; i++) {
        for (var j = 0; j < secondArray.length; j++) {
            if (firstArray[i] === secondArray[j]) {
                return true;
            }
        }
    }
    return false;
}

function applyScheduleOptions() {
    var subgroupOption = document.querySelector("#selectSubgroup .btn-active").getAttribute("value");
    var userWeekOptions = [];
    var weekCheckboxes = document.querySelectorAll(".week-checkbox");

    $.each(weekCheckboxes, function(i, value) {
        if (value.checked) {
            userWeekOptions.push(value.getAttribute("value"));
        }

    });
    if (userWeekOptions.length === 0) {
        userWeekOptions = ['1', '2', '3', '4'];
    }

    var lessonRows = document.querySelectorAll(".lesson");
    [].forEach.call(lessonRows, function(lesson) {
        var subgroup = lesson.querySelector("#subgroup").innerHTML;
        var weeksArray = lesson.querySelector("#weeks").innerHTML.split('');
        if ((subgroup === subgroupOption) || (subgroup === "") || (subgroupOption === "0")) {
            if (hasEqualElements(userWeekOptions, weeksArray) || (weeksArray.length === 0)) {
                $(lesson).show();
            } else {
                $(lesson).hide();
            }

        } else {
            $(lesson).hide();
        }
    });
}

function syncTemplateData(lesson, day) {
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

    if (lessonItems.subject === "ФизК") {
        lessonItems.lessonColor = "grey";
    } else {
        lessonItems.lessonColor = lessonColors[lessonItems.lessonType];
    }

    $('#lessonTmpl').tmpl(lessonItems).appendTo('#' + weekDays[day]);

}

function parseXml(xml) {
    $("#blurringTextG").hide();
    var jsonSchedule = xmlToJson(xml).scheduleXmlModels.scheduleModel;



    var count = 0;
    var date = new Date();
    var currentDay = date.getDay() - 1;



    $('div.hidden').empty();
    for (var day = 0; day < jsonSchedule.length; day++) {
        if (jsonSchedule[day].schedule.length === undefined) {
            syncTemplateData(jsonSchedule[day].schedule);

        } else {
            $.each(jsonSchedule[day].schedule, function(i, lesson) {
                syncTemplateData(lesson, day)
            });

        }
    }


    $('.nav-tabs li').removeClass('active');
    $('.' + weekDays[currentDay]).addClass('active');
    $('li.active > a').click();
    $('.schedule-container').show();
    applyScheduleOptions();
}
