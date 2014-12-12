$(document).ready(function() {

    $('.get-schedule-btn').click(function() {
        var groupNumber = $('.input-group > input').val();
        getXml(groupNumber);
    });

    $('.input-group > input').keyup(function(event) {
        if (event.keyCode == 13) {
            $('.get-schedule-btn').click();
            return false;
        }
    });

});
