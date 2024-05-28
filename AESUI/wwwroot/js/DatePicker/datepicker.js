$(document).ready(function () {
    debugger;
    $('.datepicker').datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        defaultDate: 0,
        changeYear: true,
        scrollMonth: false,
        mask: false,
        scrollInput: false,
        onSelectDate: function () {
        }
    });
    $('.datepicker').on('change', function () {
        $(this).datetimepicker("hide");
    });
});