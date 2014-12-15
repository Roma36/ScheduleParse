$(document).ready(function() {

    $('.input-search').keyup(function(event) {
        if (event.keyCode == 13) {
            var groupNumber = $(this).val();
            getXml(groupNumber);
            return false;
        }
    });

    
    $('#tabs').on('init.tools.tabs', function() {
        $('.daily-schedule').empty();
    });

    $('.nav-tabs').on('show.tools.tabs', function(tab, hash) {
        $('.daily-schedule').empty();
        $('.daily-schedule').append($(hash).html());
    });

});
