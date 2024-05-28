$(document).ready(function () {
    $.noConflict();
    $('#txt_FirstName').focus();
    ViewStudent();
    $('#txt_AadharNo').on('input', function () {
        // Remove any existing hyphens and non-numeric characters
        var inputVal = $(this).val().replace(/[^0-9]/g, '');

        // Add hyphens after every 4 digits
        if (inputVal.length > 4) {
            inputVal = inputVal.substring(0, 4) + '-' + inputVal.substring(4, 8) + '-' + inputVal.substring(8, 12);
        }

        // Update the input field value
        $(this).val(inputVal);
    });
});

var globalStudentDetails = {};

//This function is used for when pressing enter buttton auto submit behaviour affected
$('form').keypress(function (e) {
    if (e.which === 13) {
        e.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting a form)
        if ($('#btn_cancel').is(':focus')) {
            e.stopPropagation();
            clearStudentData();
            $('#form_id :input:visible:enabled:first').focus();
        }
        else {
            Student(); // Call SupplierIUDOnEnter for form submission
            $('#form_id :input:visible:enabled:first').focus();
        }
    }
});

//This function is used for when pressing escape buttton all field clear data behaviour affected
document.addEventListener('keydown', function (event) {
    // Check if the pressed key is Escape (key code 27)
    if (event.key === 'Escape') {
        clearStudentData();
        $('#form_id :input:visible:enabled:first').focus();
    }
});

function togglePassword(inputId, eyeIconId) {
    debugger;
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeIconId);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

//This function is used for validating all user field
function ValidateStudent() {
    if ($('#txt_FirstName').val() === "") {
        $('#txt_FirstName').focus();
        ValidationCallForInfo('Student first name cannot be  blank!!');
        return false;
    }
    if ($('#txt_LastName').val() === "") {
        $('#txt_LastName').focus();
        ValidationCallForInfo('Student last name cannot be  blank!!');
        return false;
    }
    if ($('#txt_StdEmail')) {
        if ($('#txt_StdEmail').val() === "") {
            $('#txt_StdEmail').focus();
            ValidationCallForInfo('Student Email cannot be  blank!!');
            return false;
        }
        //var emailPattern = /^[^\s]+[^\s]+\.[a-zA-Z]{2,}$/;
        //if (!emailPattern.test($('#txt_UserEmail').val())) {
        //    $('#txt_UserEmail').focus();
        //    ValidationCallForInfo('please enter valid email address!!');
        //    return false;
        //}
    }
    if (!$('#ddl_StdGender').val()) {
        $('#ddl_StdGender').focus();
        ValidationCallForInfo('Student gender cannot be  blank!!');
        return false;
    }
    if ($('#cd_dob').val() === "") {
        $('#cd_dob').focus();
        ValidationCallForInfo('Student date of birth cannot be  blank!!');
        return false;
    }
    if ($('#txt_PhoneNo')) {
        if ($('#txt_PhoneNo').val() === "") {
            $('#txt_PhoneNo').focus();
            ValidationCallForInfo('PhoneNo cannot be blank!!');
            return false;
        }
        var regex = /^[0-9]+$/;
        if (!regex.test($('#txt_PhoneNo').val())) {
            $('#txt_PhoneNo').focus();
            ValidationCallForInfo('PhoneNo cannot contain characters!!');
            return false;
        }
        if ($('#txt_PhoneNo').val().length > 10) {
            $('#txt_PhoneNo').focus();
            ValidationCallForInfo('PhoneNo cannot exceed ten digit!!');
            return false;
        }
        if ($('#txt_PhoneNo').val().length < 10) {
            $('#txt_PhoneNo').focus();
            ValidationCallForInfo('PhoneNo cannot less than ten digit!!');
            return false;
        }
    }
    if ($('#txt_StdPwd').val() === "") {
        $('#txt_StdPwd').focus();
        ValidationCallForInfo('Student Password cannot be blank!!');
        return false;
    }
    if ($('#txt_StdConfrpwd').val() === "") {
        $('#txt_StdConfrpwd').focus();
        ValidationCallForInfo('Student Confrim Password cannot be blank!!');
        return false;
    }
    if ($('#txt_StdPwd').val() != $('#txt_StdConfrpwd').val()) {
        $('#txt_StdConfrpwd').focus();
        ValidationCallForInfo('Student Password and ConfrimPassword Must be Same!!');
        return false;
    }
    return true;
}

function toggleTabs(tabId, data) {
    if (tabId === 'content1') {
        $('#content1').show();
        $('#content2').hide();
        $('#txt_FirstName').focus();
        if (data) {
            $('#txt_FirstName').val(data.stdFrstname);
            $('#txt_LastName').val(data.stdLstname);
            $('#txt_StdEmail').val(data.stdEmail);
            $('#ddl_StdGender').val(data.stdGnder);
            //$('#defaultImage').attr('src', data.stdPhoto);
            //$('#cd_dob').val(data.stdDob);
            $('#txt_AadharNo').val(data.stdAdharno);
            $('#txt_PhoneNo').val(data.stdMobNo);
            $('#PermanentDetails').val(data.stdPermntadrs);
            $('#CurrentDetails').val(data.stdCurntadrs);
            $('#ddl_BloodGroup').val(data.stdBldgrp);
            $('#txt_Nationality').val(data.stdNationality);
            $('#txt_Religion').val(data.stdReligion);
            $('#txt_State').val(data.stdState);
            $('#txt_StdPwd').val(data.stdPwd);
            $('#txt_StdConfrpwd').val(data.stdPwd);
            $('#btn_submit').text('UPDATE');
        }
        else {
            clearStudentData();
        }
    } else if (tabId === 'content2') {
        $('#content1').hide();
        $('#content2').show();
    }
}

function Student(event) {
    if (ValidateStudent() == true) {
        event.preventDefault();
        debugger;
        //Set data for insert and update
        var formData = {
            stdId: globalStudentDetails.stdId,
            stdFrstname: $('#txt_FirstName').val(),
            stdLstname: $('#txt_LastName').val(),
            stdEmail: $('#txt_StdEmail').val(),
            stdGnder: $('#ddl_StdGender').val(),
            stdPhoto: $('#txt_StdPhoto').val(),
            stdDob: $('#cd_dob').val(),
            stdAdharno: $('#txt_AadharNo').val(),
            stdMobNo: $('#txt_PhoneNo').val(),
            stdPermntadrs: $('#PermanentDetails').val(),
            stdCurntadrs: $('#CurrentDetails').val(),
            stdBldgrp: $('#ddl_BloodGroup').val(),
            stdNationality: $('#txt_Nationality').val(),
            stdReligion: $('#txt_Religion').val(),
            stdState: $('#txt_State').val(),
            stdPwd: $('#txt_StdPwd').val()
        };
        console.log(formData);
        var stdid = $('#stdid').val();
        var type = "";
        var url = "";
        if (stdid === null || stdid === "") {
            debugger;
            type = "POST";
            url = "https://localhost:7092/api/StudentAPI/IUDStudent?action=INSERT";
        }
        else {
            debugger;
            type = "PUT";
            url = "https://localhost:7092/api/StudentAPI/IUDStudent?action=UPDATE";
            $('#stdid').val('');
        }
        // Disable the submit button to block user input
        $('#btn_submit').prop('disabled', true);
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
                if (data.outputMessage === "Student mobile number already exists. Duplicate not allowed.") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.outputMessage,
                    });
                    $('#btn_submit').prop('disabled', false);
                }
                else {
                    ValidationCallForSuccess(data.outputMessage);
                    clearStudentData();
                    // enable the submit button to give user input
                    $('#btn_submit').prop('disabled', false);
                    $('.dataTable').DataTable().ajax.reload();
                }
            },
            error: function (error) {
                console.error(error);  // Log the error for debugging
                alert("Error sending data..Please check console!");
            }
        });
    }
}


function ViewStudent() {
    debugger;
    var apiUrl = 'https://localhost:7092/api/StudentAPI/VIEWSTUDENT?action=All';

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
            { data: 'stdFrstname' },      // Define a column for 'stdFrstname'
            { data: 'stdLstname' },     // Define a column for 'stdLstname'
            { data: 'stdEmail' },     // Define a column for 'stdEmail'
            { data: 'stdGnder' },    // Define a column for 'stdGnder'
            { data: 'stdDob' },      // Define a column for 'stdDob'
            { data: 'stdMobNo' },  // Define a column for 'stdMobNo'
            { data: 'stdPwd' },  // Define a column for 'stdPwd'
            {
                class: "details-control",
                orderable: "false",
                data: null,
                render: function (data, type, row) {

                    return "<div class='btn-group'>" +
                        '<button class="jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-primary edit-btn" value="' + row.stdId + '" onclick="editStudent(this,event)"></button> &nbsp; <button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" value="' + row.stdId + '" onclick="deleteStudent(this,event)"></button>'
                        + "</div>";

                }
            }
        ],
        "order": [[0, 'asc']]
    });
}

function editStudent(stdid, event) {
    event.preventDefault();
    debugger;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7092/api/StudentAPI/VIEWSTUDENT?action=AllById&std_id=' + stdid.value,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (studentDetails) {
            debugger;
            globalStudentDetails = studentDetails;
            $('#stdid').val(globalStudentDetails.stdId);
            toggleTabs('content1', globalStudentDetails);
        },
        error: function (error) {
            console.error('Error fetching student details:', error);
        }
    });
}

function deleteStudent(stdid, event) {
    event.preventDefault();
    debugger;
    var formData = {
        stdId: stdid.value,
        stdFrstname: '',
        stdLstname: '',
        stdEmail: '',
        stdGnder: '',
        stdPhoto: '',
        stdDob: null,
        stdAdharno: '',
        stdMobNo: '',
        stdPermntadrs: '',
        stdCurntadrs: '',
        stdBldgrp: '',
        stdNationality: '',
        stdReligion: '',
        stdState: '',
        stdPwd: ''
    }
    console.log(formData);
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
                url: 'https://localhost:7092/api/StudentAPI/IUDStudent?action=DELETE',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(formData),
                success: function (data1) {
                    debugger;
                    ValidationCallForSuccess(data1.outputMessage);
                    $('.dataTable').DataTable().ajax.reload();
                },
                error: function (error) {
                    console.error('Error fetching student details:', error);
                }
            });
        }
    });
}