$(document).ready(function () {
    $.noConflict();
    $('#exam_name').focus();
    ViewExam();
});
var quill1 = new Quill('#exam_editor', {
    theme: 'snow'
});
function ValidateUser() {
    if (!$('#exam_name').val()) {
        $('#exam_name').focus();
        ValidationCallForInfo('Exam name cannot be  blank!!');
        return false;
    }
    if (!$('#exam_duration').val()) {
        $('#exam_duration').focus();
        ValidationCallForInfo('Exam duration cannot be  blank!!');
        return false;
    }
    if (!$('#exam_subject').val()) {
        $('#exam_subject').focus();
        ValidationCallForInfo('Exam subject cannot be  blank!!');
        return false;
    }
    if (!$('#exam_no_of_questions').val()) {
        $('#exam_no_of_questions').focus();
        ValidationCallForInfo('Exam no of questions cannot be  blank!!');
        return false;
    }
    if (!$('#exam_pass_marks').val()) {
        $('#exam_pass_marks').focus();
        ValidationCallForInfo('Exam pass marks cannot be  blank!!');
        return false;
    }
    if (!quill1.getText().replace(/\n/g, '')) {
        $('#exam_editor').focus();
        ValidationCallForInfo('Exam description cannot be  blank!!');
        return false;
    }
    return true;
}
//This function is used for when pressing enter buttton auto submit behaviour affected
$('form').keypress(function (e) {
    if (e.which === 13) {
        e.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting a form)
        if ($('#btn_cancel').is(':focus')) {
            e.stopPropagation();
            clearExamData();
            $('#form_id :input:visible:enabled:first').focus();
        }
        else {
            addExam(); // Call SupplierIUDOnEnter for form submission
            $('#form_id :input:visible:enabled:first').focus();
        }
    }
});

//This function is used for when pressing escape buttton all field clear data behaviour affected
document.addEventListener('keydown', function (event) {
    // Check if the pressed key is Escape (key code 27)
    if (event.key === 'Escape') {
        clearExamData();
        $('#form_id :input:visible:enabled:first').focus();
    }
});

var globalExamDetails = {};

function clearExamData() {
    $('#exam_name').focus();
    $('#exam_name').val('');
    $('#exam_duration').val('');
    $('#exam_subject').val('');
    $('#exam_no_of_questions').val('');
    $('#exam_pass_marks').val('');
    quill1.setText('');
    $('#btn_submit').text('SUBMIT');
}


function toggleTabs(tabId, data) {
    if (tabId === 'content1') {
        $('#content1').show();
        $('#content2').hide();
        if (data) {

            $('#exam_name').val(data.examName);
            $('#exam_duration').val(data.examDuration);
            $('#exam_subject').val(data.examSubject);
            $('#exam_no_of_questions').val(data.tnoqans);
            $('#exam_pass_marks').val(data.passmark);
            quill1.setText(data.examDescr);
            $('#btn_submit').text('UPDATE');
        }
        else {
            clearExamData();
        }

    } else if (tabId === 'content2') {
        $('#content1').hide();
        $('#content2').show();
    }
}
function addExam(event) {
    if (ValidateUser() == true) {
        event.preventDefault()
        // alert("Exam add function called successfully!");
        debugger;
        var formData = {
            examId: globalExamDetails.examId,
            examName: $('#exam_name').val(),
            examDuration: parseInt($('#exam_duration').val(), 10),
            examSubject: $('#exam_subject').val(),
            tnoqans: parseInt($('#exam_no_of_questions').val(), 10),
            passmark: parseInt($('#exam_pass_marks').val(), 10),
            examDescr: quill1.getText().replace(/\n/g, '')
        };
        alert(formData);
        console.log(formData);
        var examid = $('#examid').val();
        console.log(examid);
        var type = "";
        var url = "";
        if (examid === null || examid === "") {
            debugger;
            type = "POST";
            url = "https://localhost:7092/api/ExamAPI/Exam?action=INSERT";
        } else {
            debugger;
            type = "PUT";
            url = "https://localhost:7092/api/ExamAPI/Exam?action=UPDATE";
            $('#examid').val('');
        }
        // Disable the submit button to block user input
        $('#btn_submit').prop('disabled', true);
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
                if (data.outputMessage == "Exam Name Already Exist.Duplicate Not Allowed") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.outputMessage,
                    });
                    $('#btn_submit').prop('disabled', false);
                } else {
                    ValidationCallForSuccess(data.outputMessage);
                    $('#exam_name').focus();
                    clearExamData();
                    // enable the submit button to give user input
                    $('#btn_submit').prop('disabled', false);
                    $('.dataTable').DataTable().ajax.reload();
                }
            },
            error: function (xhr, error, thrown) {
                console.log('Ajax error:', error);
                console.log('Status:', xhr.status);
                console.log('Thrown:', thrown);
            }
        });
    }
}

function ViewExam() {
    debugger;
    var apiUrl = 'https://localhost:7092/api/ExamAPI/VIEWEXAM?action=All';

    $('.dataTable').DataTable({
        ajax: {
            url: apiUrl,
            dataSrc: ''    // Specify that the data source is the top-level of the JSON response
        },
        // Define the columns for the DataTable
        columns: [
            {
                "className": "text-center",
                "data": null,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
            },
            { data: 'examName' },      // Define a column for 'examName'
            { data: 'examDuration' },     // Define a column for 'examDuration'
            { data: 'examSubject' },       // Define a column for 'examSubject'
            { data: 'tnoqans' },       // Define a column for 'tnoqans'
            { data: 'passmark' },       // Define a column for 'passmark'
            {
                class: "details-control",
                orderable: "false",
                data: null,
                render: function (data, type, row) {

                    return "<div class='btn-group'>" +
                        '<button class="jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-primary edit-btn" value="' + row.examId + '" onclick="editExam(this,event)"></button> &nbsp; <button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" value="' + row.examId + '" onclick="deleteExam(this,event)"></button>'
                        + "</div>";

                }
            }
        ],
        "order": [[0, 'asc']]
    });
}
function editExam(examid, event) {
    event.preventDefault();
    debugger;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7092/api/ExamAPI/VIEWEXAM?action=AllById&exam_id=' + examid.value,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (examDetails) {
            debugger;
            globalExamDetails = examDetails;
            $('#examid').val(globalExamDetails.examId);
            toggleTabs('content1', globalExamDetails);
            $('#exam_name').focus();
        },
        error: function (xhr, error, thrown) {
            console.log('Ajax error:', error);
            console.log('Status:', xhr.status);
            console.log('Thrown:', thrown);
        }
    });
}

function deleteExam(examid, event) {
    event.preventDefault();
    debugger;
    var exam_id = parseInt(examid.value, 10);
    Swal.fire({
        title: 'Are you sure to delete this student ?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: 'https://localhost:7092/api/ExamAPI/DeleteExam/' + exam_id,
                contentType: "application/json; charset=utf-8",
                success: function (data1) {
                    debugger;
                    ValidationCallForSuccess(data1);
                    $('.dataTable').DataTable().ajax.reload();
                },
                error: function (xhr, error, thrown) {
                    console.log('Ajax error:', error);
                    console.log('Status:', xhr.status);
                    console.log('Thrown:', thrown);
                }
            });
        }
    });
}
