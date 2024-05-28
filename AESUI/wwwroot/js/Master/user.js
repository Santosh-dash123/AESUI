$(document).ready(function () {
    $.noConflict();
    $('#txt_UserName').focus();
    ViewUser();
});
var globalUserDetails = {};

//This function called for clear all field data
function clearUserData() {
    $('#txt_UserName').val('');
    $('#txt_PhoneNo').val('');
    $('#txt_UserEmail').val('');
    $('#Details').val('');
    $('#ddl_UserType').val('Select');
    $('#txt_UserPwd').val('');
    $('#txt_UserConfrpwd').val('');
    $('#uid').val('');
    $('#btn_submit').text('SUBMIT');
}

//This function is used for validating all user field
function ValidateUser() {
    if ($('#txt_UserName').val() === "") {
        $('#txt_UserName').focus();
        ValidationCallForInfo('User Name cannot be  blank!!');
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

    if ($('#txt_UserEmail')) {
        if ($('#txt_UserEmail').val() === "") {
            $('#txt_UserEmail').focus();
            ValidationCallForInfo('User Email cannot be  blank!!');
            return false;
        }
        /*var emailPattern = /^[^\s@@]+@@[^\s@@]+\.[a-zA-Z]{2,}$/;*/
        var emailPattern = /^[^\s]+@[^\s]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test($('#txt_UserEmail').val())) {
            $('#txt_UserEmail').focus();
            ValidationCallForInfo('please enter valid email address!!');
            return false;
        }
    }
    if ($('#Details').val() === "") {
        $('#Details').focus();
        ValidationCallForInfo('Address cannot be  blank!!');
        return false;
    }

    if (!$('#ddl_UserType').val()) {
        $('#ddl_UserType').focus();
        ValidationCallForInfo('User Type cannot be  blank!!');
        return false;
    }

    if ($('#txt_UserPwd').val() === "") {
        $('#txt_UserPwd').focus();
        ValidationCallForInfo('User Password cannot be blank!!');
        return false;
    }
    if ($('#txt_UserConfrpwd').val() === "") {
        $('#txt_UserConfrpwd').focus();
        ValidationCallForInfo('User Confrim Password cannot be blank!!');
        return false;
    }
    if ($('#txt_UserPwd').val() != $('#txt_UserConfrpwd').val()) {
        $('#txt_UserConfrpwd').focus();
        ValidationCallForInfo('UserPassword and ConfrimPassword Must be Same!!');
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
            clearUserData();
            $('#form_id :input:visible:enabled:first').focus();
        }
        else {
            AddUser(); // Call SupplierIUDOnEnter for form submission
            $('#form_id :input:visible:enabled:first').focus();
        }
    }
});

//This function is used for when pressing escape buttton all field clear data behaviour affected
document.addEventListener('keydown', function (event) {
    // Check if the pressed key is Escape (key code 27)
    if (event.key === 'Escape') {
        clearUserData();
        $('#form_id :input:visible:enabled:first').focus();
    }
});

//This function is used for toggle between two tabs
function toggleTabs(tabId, data) {
    if (tabId === 'content1') {
        $('#content1').show();
        $('#content2').hide();
        $('#txt_UserName').focus();
        if (data) {
            $('#txt_UserName').val(data.uName);
            $('#txt_PhoneNo').val(data.uMobno);
            $('#txt_UserEmail').val(data.uEmail);
            $('#Details').val(data.uAddrss);
            $('#ddl_UserType').val(data.uType);
            $('#txt_UserPwd').val(data.uPwd);
            $('#txt_UserConfrpwd').val(data.uPwd);
            $('#btn_submit').text('UPDATE');
        }
        else {
            clearUserData();
        }
    } else if (tabId === 'content2') {
        $('#content1').hide();
        $('#content2').show();
    }
}

function ViewUser() {
    var apiUrl = 'https://localhost:7092/api/UserAPI/VIEWUSER?action=All';

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
            { data: 'uName' },      // Define a column for 'uName'
            { data: 'uMobno' },     // Define a column for 'uMobno'
            { data: 'uEmail' },     // Define a column for 'uEmail'
            { data: 'uAddrss' },    // Define a column for 'uAddrss'
            { data: 'uType' },      // Define a column for 'uType'
            { data: 'uPwd' },       // Define a column for 'uPwd'
            {
                class: "details-control",
                orderable:"false",
                data: null,
                render: function (data, type, row) {

                    return "<div class='btn-group'>" +
                        '<button class="jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-primary edit-btn"  value="' + row.uId + '" onclick="editUser(this,event)"></button> &nbsp; <button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" value="' + row.uId + '" onclick="deleteUser(this,event)"></button>'
                        + "</div>";

                }
            }
        ],
        "order":[[0,'asc']]
    });     
}

function AddUser() {
    //event.preventDefault();
    debugger;
    if (ValidateUser() == true) {
        //Set data for insert and update
        var formData = {
            UId: globalUserDetails.uId,
            UName: $('#txt_UserName').val(),
            UMobno: $('#txt_PhoneNo').val(),
            UEmail: $('#txt_UserEmail').val(),
            UAddrss: $('#Details').val(),
            UType: $('#ddl_UserType').val(),
            UPwd: $('#txt_UserPwd').val(),
        };
        console.log(formData);
        var uid = $('#uid').val();
        var type = "";
        var url = "";
        if (uid === null || uid === "") {
            debugger;
            type = "POST";
            url = "https://localhost:7092/api/UserAPI/IUDUser?action=INSERT";
        }
        else {
            debugger;
            type = "PUT";
            url = "https://localhost:7092/api/UserAPI/IUDUser?action=UPDATE";
            $('#uid').val('');
        }
        // Disable the submit button to block user input
        $('#btn_submit').prop('disabled', true);
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
                debugger;
                if (data.outputMessage === "User Mobno and Email Already Exist.Duplicate Not Allowed.") {
                    ValidationCallForInfo(data.outputMessage);
                    $('#btn_submit').prop('disabled', false);
                }
                else if (data.outputMessage === "User Mobno Already Exist.Duplicate Not Allowed.") {
                    ValidationCallForInfo(data.outputMessage);
                    $('#btn_submit').prop('disabled', false);
                }
                else if (data.outputMessage === "User Email Already Exist.Duplicate Not Allowed.") {
                    ValidationCallForInfo(data.outputMessage);
                    $('#btn_submit').prop('disabled', false);
                }
                else {
                    ValidationCallForSuccess(data.outputMessage);
                    clearUserData();
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

function editUser(uid, event) {
    event.preventDefault();
    debugger;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7092/api/UserAPI/VIEWUSER?action=AllById&u_id=' + uid.value,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (userDetails) {
            globalUserDetails = userDetails;
            $('#uid').val(globalUserDetails.uId);
            toggleTabs('content1', globalUserDetails);
        },
        error: function (error) {
            console.error('Error fetching customer details:', error);
        }
    });
}

function deleteUser(uid,event) {
    event.preventDefault();
    debugger;
    var formData = {
        UId: uid.value,
        UName: '',
        UMobno: '',
        UEmail: '',
        UAddrss: '',
        UType: '',
        UPwd: '',
    }
    console.log(formData);
    Swal.fire({
        title: 'Are you sure to delete this user ?',
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
                url: 'https://localhost:7092/api/UserAPI/IUDUser?action=DELETE',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(formData),
                success: function (data1) {
                    debugger;
                    ValidationCallForSuccess(data1.outputMessage);
                    $('.dataTable').DataTable().ajax.reload();
                },
                error: function (error) {
                    console.error('Error fetching customer details:', error);
                }
            });
        }
    });
}
