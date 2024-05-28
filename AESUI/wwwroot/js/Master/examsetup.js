$(document).ready(function () {
    debugger;
    $.noConflict();
    $('#exam_name').focus();
    addExamList();
    addStudentList();
    ViewExamWithStudents();
    // Set the default date in the textbox
    var currentDate = new Date();
    var formattedCurrentDate = currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate();
    $('#exam_date').val(formattedCurrentDate);

    // Initialize the datetimepicker
    $('.datepicker').datetimepicker({
        format: 'Y-m-d',
        timepicker: false,
        minDate: 0 // Set the minimum selectable date to the current date
    });

    $('.datepicker').on('click', function () {
        $(this).datetimepicker('show');
    });

    // Handle keydown events
    $('.datepicker').keydown(function (event) {
        switch (event.which) {
            case 13: // Enter key or Space key
            case 32:
                event.preventDefault();
                $(this).datetimepicker('show'); // Show the datetimepicker on Enter or Space key press
                break;
        }
    });


    // Initialize Clockpicker based on class name
    $('.timepicker').clockpicker({
        autoclose: true,
        twelvehour: true
    });
});
var studentData = []; //This array is declared for stored student id information in a tab;
var selectedRowForUpdate = -1; // Variable to store the currently selected row for update
function toggleTabs(tabId) {
    debugger;
    if (tabId === 'content1') {
        $('#content1').show();
        $('#content2').hide();
        $('#exam_name').focus();
    } else if (tabId === 'content2') {
        $('#content1').hide();
        $('#content2').show();
    }
}

$("#exam_name").on("change", function () {
    // Get the selected exam id
    debugger;
    var selectedExamId = $(this).val();
    console.log(selectedExamId);
    if (selectedExamId > 0) {
        $.ajax({
            type: 'GET',
            url: 'https://localhost:7092/api/ExamAPI/VIEWEXAM?action=AllById&exam_id=' + selectedExamId,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $('#exam_subject').val(data.examSubject);
                $('#exam_duration').val(data.examDuration);
                $('#exam_no_of_questions').val(data.tnoqans);
                $('#exam_pass_marks').val(data.passmark);
                $('#exam_description').val(data.examDescr);
            },
            error: function (error) {
                console.error('Error fetching exam details:', error);
            }
        })
    }
    else {
        $('#exam_subject').val('');
        $('#exam_duration').val('');
        $('#exam_no_of_questions').val('');
        $('#exam_pass_marks').val('');
        $('#exam_description').val('');
    }
});
function BindSelect2() {
    $(".sel2").select2({
        tags: false,
        placeholder: "----Select----",
        allowClear: true
    });
}
BindSelect2();
function addExamList() {
    debugger;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7092/api/UserAPI/GetListOfExamnameAndExamid',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            // Assuming data is an array of objects with properties ExamId and ExamName
            var select = $('#exam_name');

            // Clear existing options
            select.empty();

            // Add default option
            select.append($('<option>', {
                value: '',
                text: '--Select Exam--',
                disabled: true,
                selected: true
            }));

            // Iterate through the data and append options
            $.each(data, function (index, item) {
                select.append($('<option>', {
                    value: item.examId,
                    text: item.examName
                }));
            });
        },
        error: function (error) {
            console.error('Error fetching exam details:', error);
        }
    });
}
function addStudentList() {
    debugger;
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7092/api/StudentAPI/GetListOfStudentNameAndStudentId',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            // Assuming data is an array of objects with properties ExamId and ExamName
            var select = $('#std_name');

            // Clear existing options
            select.empty();

            // Add default option
            select.append($('<option>', {
                value: '',
                text: '--Select Student--',
                disabled: true,
                selected: true
            }));

            // Iterate through the data and append options
            $.each(data, function (index, item) {
                select.append($('<option>', {
                    value: item.stdId,
                    text: item.stdFrstname + " " + item.stdLstname
                }));
            });
        },
        error: function (error) {
            console.error('Error fetching student details:', error);
        }
    });
}
function ClearAllData() {
    // Clear the studentData array
    studentData = [];
    // Clear the table rows and hide the table header
    $('.datatable tbody').empty();
    $(".datatable thead").hide();
    // Reset other form fields
    $('#exam_name').val('').trigger('change');
    $('#exam_subject').val('');
    $('#exam_duration').val('');
    $('#exam_no_of_questions').val('');
    $('#exam_pass_marks').val('');
    $('#exam_date').val('');
    $('#from_time').val('');
    $('#to_time').val('');
    $('#std_name').val('').trigger('change');
    $('#exam_name').focus();
    $("#btn_submit").text("SUBMIT");
}
function ValidateExamSetup() {
    if (!$("#exam_name").val()) {
        $('#exam_name').focus();
        ValidationCallForInfo('Exam name cannot be  blank!!');
        return false;
    }
    if ($("#exam_date").val() === "" || $("#exam_date").val() === null) {
        ValidationCallForInfo("Exam date cannot be blank!!");
        //$('#exam_date').focus();
        return false;
    }
    if ($("#from_time").val() === "" || $("#from_time").val() === null) {
        $('#from_time').focus();
        ValidationCallForInfo('From time cannot be  blank!!');
        return false;
    }
    if ($("#to_time").val() === "" || $("#to_time").val() === null) {
        $('#to_time').focus();
        ValidationCallForInfo('To time cannot be  blank!!');
        return false;
    }
    //if (!$("#std_name").val()) {
    //    $('#std_name').focus();
    //    ValidationCallForInfo('Student name cannot be  blank!!');
    //    return false;
    //}
    return true;
}
//This function is used for when pressing enter buttton auto submit behaviour affected
$('form').keypress(function (e) {
    if (e.which === 13) {
        e.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting a form)
        if ($('#btn_cancel').is(':focus')) {
            e.stopPropagation();
            ClearAllData();
            $('#form_id :input:visible:enabled:first').focus();
        }
        else {
            addExamWithStudents(e); 
            $('#form_id :input:visible:enabled:first').focus();
        }
    }
});
//This function is used for when pressing escape buttton all field clear data behaviour affected
document.addEventListener('keydown', function (event) {
    // Check if the pressed key is Escape (key code 27)
    if (event.key === 'Escape') {
        ClearAllData();
        $('#form_id :input:visible:enabled:first').focus();
    }
});

//CRUD FOR STUDENT NAME LIST IN UI
function addTable() {
    debugger;
    var selectedStudentId = parseInt($('#std_name').val(), 10);
    if (!selectedStudentId) {
        ValidationCallForInfo("Please select a student name!");
        return;
    }
    var selectedStudentName = $('#std_name option:selected').text();
    if (studentData.length >= 0) {
        $(".datatable thead").show();
    }
    // Check if the student is already added
    if (isStudentAdded(selectedStudentId)) {
        ValidationCallForInfo("This student is already added!");
        return;
    }

    var deleteBtnId = 'deleteBtn_' + selectedStudentId;
    var deleteBtn = '<button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" type="button" onclick="deleteRow(\'' + selectedStudentId + '\')"></button>';

    var tbody = $('.datatable tbody');
    var row = '<tr data-studentid="' + selectedStudentId + '">' +
        '<td>' + selectedStudentName + '</td>' +
        '<td>' + deleteBtn + '</td>' +
        '</tr>';
    tbody.append(row);

    // Reset the dropdown value and text
    $('#std_name').val('').trigger('change');

    // Add the selected student to the array
    var student = {
        studentId: selectedStudentId
    };
    studentData.push(student);
    alert(studentData.length);
}
function deleteRow(studentId) {
    // Remove the row from the table
    debugger;
    $('.datatable tbody tr[data-studentid="' + studentId + '"]').remove();

    // Convert studentId to integer for consistent comparison
    var parsedStudentId = parseInt(studentId, 10);

    // Remove the corresponding data from the array
    studentData = studentData.filter(function (student) {
        return student.studentId !== parsedStudentId;
    });

    if (studentData.length === 0) {
        $(".datatable thead").hide();
    }
    alert(studentData.length);
}
function isStudentAdded(studentId) {
    return studentData.some(function (student) {
        return student.studentId === studentId;
    });
}
function formatDate(date) {
    var examDate = new Date(date);
    var year = examDate.getFullYear();
    var month = String(examDate.getMonth() + 1).padStart(2, '0');
    var day = String(examDate.getDate()).padStart(2, '0');
    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

//CRUD FOR EXAM WITH STUDENT IN API
function addExamWithStudents(event) {
    event.preventDefault();
    debugger;
    if (ValidateExamSetup() == true) {
        // Update the formData object with the formatted time values
        var currentDate = new Date();

        var formData = {
            ExamId: parseInt($('#exam_name').val(), 10),
            ExamDate: $('#exam_date').val(),
            FromTime: $('#from_time').val(),
            ToTime: $('#to_time').val(),
            DFlag: 0,
            CreatedBy: 0,
            CreatedDate: formatDate(currentDate),
            CreatedIp: "",
            ModifyBy: 0,
            ModifyDate: formatDate(currentDate),
            ModifyIp: "",
            Students: studentData
        };

        console.log(formData);
        var type = "";
        var url = "";
        if ($("#btn_submit").text() === "SUBMIT") {
            // Code to handle the button being in "SUBMIT" state
            type = "POST";
            url = "https://localhost:7092/api/ExamSetupAPI/InsertExamWithStudents"
        } else {
            // Code to handle the button being in "UPDATE" state
            if (selectedRowForUpdate !== -1) {
                type = "PUT";
                url = "https://localhost:7092/api/ExamSetupAPI/updateExamWithStudents/" + selectedRowForUpdate;
            }
        }
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
                ValidationCallForSuccess(data);
                ClearAllData();
                studentData = [];//Clear all student data
                $('.dataTable').DataTable().ajax.reload();
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error,
                });
            }
        });
    }
}
function ViewExamWithStudents() {
    debugger;
    var apiUrl = 'https://localhost:7092/api/ExamSetupAPI/GetExamAndSetupData';
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
            {
                "className": "text-center",
                data: 'examDate',
                render: function (data) {
                    return formatDate(data);
                }
            },
            {
                "className": "text-center",
                data: 'fromtime',
                //render: function (data) {
                //    var fromTime = new Date('1970-01-01T' + data); // Concatenate with a date for parsing
                //    return fromTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format fromtime
                //}
            },
            {
                "className": "text-center",
                data: 'totime',
            },
            {
                class: "details-control text-center",
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var buttonsHtml = `
        <div class='btn-group'>
                <button class='jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-success edit-btn' value='${row.examsetupId}' onclick='editES(this, event)'></button> &nbsp;
                <button class='jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn' value='${row.examsetupId}' onclick='deleteES(this, event)'></button> &nbsp;
                    <button class='jsgrid-button jsgrid-info-button ti-info-alt btn btn-info info-btn' data-question-id='${row.examsetupId}' onclick='getstudents(${row.examsetupId})'></button>
        </div>`;
                    return buttonsHtml;
                }
            }
        ],
        "order": [[0, 'asc']]
    });
}
function getstudents(id) {
    debugger;
    var apiUrl = 'https://localhost:7092/api/ExamSetupAPI/GetStudentWithExamSetupId/' + id;
    $.ajax({
        type: 'GET',
        url: apiUrl,
        contentType: "application/json",
        success: function (data) {
            createStudentsTable(id, data);
        },
        error: function (error) {
            console.error(error);  // Log the error for debugging
            alert("Error sending data..Please check console!");
        }
    });
}
function createStudentsTable(examsetupId, studentsData) {
    debugger;
    // Check if the options table is already visible
    var isTableVisible = $('#studentsTable_' + examsetupId).length > 0;
    // If the table is visible, hide it and remove it
    if (isTableVisible) {
        $('#studentsTable_' + examsetupId).remove();
        $('.students-table-container').remove();
    } else {
        // Remove all rows and data from the table
        $('.students-table-container').remove();

        // Create a new table row
        var tablerow = $('<tr class="students-table-container"></tr>');

        // Create a new cell (td) with colspan="4"
        var colspanCell = $('<td colspan="6"></td>');

        // Append the colspan cell to the row
        tablerow.append(colspanCell);

        // Create a new table for options
        var studentsTable = $('<table class="table table-hover table-bordered table-striped w-100"></table>');

        // Create the table head
        var tableHead = $('<thead></thead>');
        var tableHeadRow = $('<tr style="text-align:center"></tr>');
        tableHeadRow.append('<th style="text-align:center">Eligible Student Name</th>');
        tableHead.append(tableHeadRow);
        studentsTable.append(tableHead);

        // Create the table body
        var tableBody = $('<tbody></tbody>');
        //If no students are added for this exam then this message will be displayed in table
        if (studentsData.length === 0) {
            var optionRow = $('<tr style="text-align:center"></tr>');
            optionRow.append('<td style="text-align:center"> STUDENTS ARE NOT ELIGIBLE FOR THIS EXAM... </td>');
            tableBody.append(optionRow);
        }
        else {
            for (var i = 0; i < studentsData.length; i++) {
                var students = studentsData[i];
                var optionRow = $('<tr style="text-align:center"></tr>');
                optionRow.append('<td style="text-align:center">' + students.stdName + '</td>');
                tableBody.append(optionRow);
            }
        }
        studentsTable.append(tableBody);

        // Add a unique ID to the new table
        studentsTable.attr('id', 'studentsTable_' + examsetupId);

        // Append the inner table to the colspan cell
        colspanCell.append(studentsTable);

        // Find the row of the "+" button
        var plusButtonRow = $('button[data-question-id="' + examsetupId + '"]').closest('tr');

        // Insert the new options table below the row with the "+" button
        plusButtonRow.after(tablerow);
    }
}
function editES(id, event) {
    debugger;
    event.preventDefault();
    var apiUrl = 'https://localhost:7092/api/ExamSetupAPI/GetExamWithStudents/' + id.value;
    selectedRowForUpdate = id.value;
    $.ajax({
        type: 'GET',
        url: apiUrl,
        contentType: 'application/json',
        success: function (data) {
            debugger;
            toggleTabs('content1');
            //Populate the Add tab
            $("#exam_name").val(data.examId).trigger('change');
            $("#exam_date").val(formatDate(data.examDate));
            $("#from_time").val(data.fromTime);
            $("#to_time").val(data.toTime);

            //Clear existing students in the table
            $('.datatable tbody').empty();
            if (data.students.length === 0) {
                $('.datatable thead').hide();
            }
            else {
                $('.datatable thead').show();
            }

            //Add students to the table
            studentData = []; //Clear the student data array
            for (var i = 0; i < data.students.length; i++) {
                var student = data.students[i];
                var deleteBtn = '<button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" type="button" onclick="deleteRow(' + student.studentId + ')"></button>';

                var tbody = $('.datatable tbody');
                var row = '<tr data-studentid="' + student.studentId + '">'+
                    '<td>' + student.studentName + '</td>' +
                    '<td>' + deleteBtn + '</td>' +
                    '</tr>';
                tbody.append(row);
                // Update optionData array
                studentData.push({
                    studentId: student.studentId
                });
            }
            $('#exam_name').focus();
            // Change submit button text to "Update"
            $("#btn_submit").text("UPDATE");
        },
        error: function (error) {
            console.error(error);
            alert("Error fetching data. Please check console!");
        }
    });
}
function deleteES(id, event) {
    event.preventDefault();
    debugger;
    Swal.fire({
        title: 'Are you sure to delete this question and options ?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            debugger;
            $.ajax({
                type: 'DELETE',
                url: 'https://localhost:7092/api/ExamSetupAPI/DeleteExamWithStudents/' + id.value,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    ValidationCallForSuccess(data);
                    $('#exam_name').focus();
                    $('.dataTable').DataTable().ajax.reload();
                },
                error: function (error) {
                    console.error('Error fetching customer details:', error);
                }
            });
        }
    });
}