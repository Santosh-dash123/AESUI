$(document).ready(function () {
    $.noConflict();
    $('#exam_name').focus();
    addExamList();
    ViewQuestionAndOptions();
});
var quill1 = new Quill('#editor_question', {
    theme: 'snow'
});
var quill2 = new Quill('#editor_option', {
    theme: 'snow'
});
//This function is used for when pressing enter buttton auto submit behaviour affected
$('form').keypress(function (e) {
    if (e.which === 13) {
        e.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting a form)
        if ($('#btn_cancel').is(':focus')) {
            e.stopPropagation();
            clearAllData();
            $('#form_id :input:visible:enabled:first').focus();
        }
        else {
            addQuestionAndOptions();
            $('#form_id :input:visible:enabled:first').focus();
        }
    }
});
//This function is used for when pressing escape buttton all field clear data behaviour affected
document.addEventListener('keydown', function (event) {
    // Check if the pressed key is Escape (key code 27)
    if (event.key === 'Escape') {
        clearAllData();
        $('#form_id :input:visible:enabled:first').focus();
    }
});
//This function is used for toggle between two tabs
function toggleTabs(tabId) {
    if (tabId === 'content1') {
        $('#content1').show();
        $('#content2').hide();
        $('#exam_name').focus();
    } else if (tabId === 'content2') {
        $('#content1').hide();
        $('#content2').show();
    }
}
var selectedRowIndex = -1; // Variable to store the currently selected row index
var selectedRowForUpdate = -1; // Variable to store the currently selected row for update
var optionData = [];
function BindSelect2() {
    $(".sel2").select2({
        tags: false,
        placeholder: "----Select----",
        allowClear: true
    });
}
BindSelect2();
function clearAllData() {
    $('.datatable tbody').empty();
    quill1.setText('');
    $('#exam_name').val('').trigger('change');
    $('.datatable thead').hide();
    $('#exam_name').focus();
    $("#btn_submit").text("SUBMIT");
}
function ValidateUser() {
    if (!$('#exam_name').val()) {
        $('#exam_name').focus();
        ValidationCallForInfo('Exam name cannot be  blank!!');
        return false;
    }
    if (!quill1.getText().replace(/\n/g, '')) {
        $('#editor_question').focus();
        ValidationCallForInfo('Question name cannot be  blank!!');
        return false;
    }
    if (!quill2.getText().replace(/\n/g, '') && optionData.length === 0) {
        $('#editor_option').focus();
        ValidationCallForInfo('Options cannot be  blank!!');
        return false;
    }
    return true;
}
//CRUD FOR UI OPTIONS
function addTable() {
    debugger;
    if (optionData.length >= 0) {
        $('.datatable thead').show();
    }
    var editorContent = quill2.getText().replace(/\n/g, '');

    var toggleBtnId = 'toggleBtn_' + optionData.length;
    var toggleBtn = '<div id="' + toggleBtnId + '" class="toggle-switch" style="transform: translateX(0px);" onclick="toggleOption(' + optionData.length + ')">' +
        '<div class="toggle-button"></div>' +
        '</div>';

    var statusTextId = 'statusText_' + optionData.length;
    var statusText = '<div id="' + statusTextId + '" class="option-status-text">False</div>';

    var deleteBtnId = 'deleteBtn_' + optionData.length;
    var deleteBtn = '<button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" type="button" onclick="deleteRow(' + optionData.length + ')"></button>';

    var updateBtnId = 'updateBtn_' + optionData.length;
    var updateBtn = '<button class="jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-primary edit-btn" type="button" onclick="updateRow(' + optionData.length + ')"></button>';

    if ($("#add_option").text() === "Add") {
        var option = {
            content: editorContent,
            status: 'false'
        };
        optionData.push(option);

        var tbody = $('.datatable tbody');
        var row = '<tr>' +
            '<td class="option-content">' + editorContent + '</td>' +
            '<td>' + statusText + '</td>' +
            '<td>' + toggleBtn + '</td>' +
            '<td>' + updateBtn + '&nbsp;' + deleteBtn + '</td>' +
            '</tr>';
        tbody.append(row);
        quill2.setText('');
    } else if ($("#add_option").text() === "Update") {
        if (selectedRowIndex !== -1) {
            // Update only the content cell of the existing row
            $('.datatable tbody tr').eq(selectedRowIndex).find('.option-content').text(editorContent);

            // Update the corresponding entry in the optionData array
            optionData[selectedRowIndex].content = editorContent;

            quill2.setText('');
            $("#add_option").text("Add");
            selectedRowIndex = -1;
        }
    }
}
function toggleOption(index) {
    var button = document.getElementById('toggleBtn_' + index);
    var text = document.getElementById('statusText_' + index);

    if (button.classList.contains('toggle-active')) {
        button.style.transform = 'translateX(0)';
        button.classList.remove('toggle-active');
        text.textContent = 'False';
        optionData[index].status = 'false';
    } else {
        button.style.transform = 'translateX(0)'; // Adjust the distance you want to move
        button.classList.add('toggle-active');
        text.textContent = 'True';
        optionData[index].status = 'true';
    }
}
function updateRow(index) {
    debugger;
    var selectedContent = optionData[index].content;
    quill2.setText(selectedContent);
    $("#add_option").text("Update");
    selectedRowIndex = index;
}
function deleteRow(index) {
    // Remove the corresponding row from the table and optionData array
    optionData.splice(index, 1); // Remove the deleted option from the array
    var tbody = $('.datatable tbody');
    tbody.find('tr').eq(index).remove(); // Remove the corresponding row from the table
    if (optionData.length === 0) {
        $('.datatable thead').hide();
    }
}
//CRUD FOR API DATA QUESTION AND OPTIONS
function addQuestionAndOptions(event) {
    event.preventDefault();

    if (ValidateUser() == true) {
        debugger;
        var formData = {
            ExamId: parseInt($('#exam_name').val(), 10),
            QuestionContent: quill1.getText().replace(/\n/g, ''),
            Options: optionData
        };
        var type = "";
        var url = "";
        if ($("#btn_submit").text() === "SUBMIT") {
            // Code to handle the button being in "SUBMIT" state
            type = "POST";
            url = "https://localhost:7092/api/UserAPI/InsertQuestionWithOptions"
        } else {
            // Code to handle the button being in "UPDATE" state
            if (selectedRowForUpdate !== -1) {
                type = "PUT";
                url = "https://localhost:7092/api/UserAPI/updateQuestionAndOptions/" + selectedRowForUpdate;
            }
        }

        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (data) {
                ValidationCallForSuccess(data);
                clearAllData(); // Clear data after successful submission
                optionData = []; // Clear the optionData array
                // Change submit button text to "Submit"
                $("#btn_submit").text("SUBMIT");
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
function ViewQuestionAndOptions() {
    debugger;
    var apiUrl = 'https://localhost:7092/api/UserAPI/GetQuestionAndOptionsData';
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
            { data: 'examName' },      // Define a column for 'examId'
            { data: 'qansContent' },     // Define a column for 'qansContent'
            {
                class: "details-control text-center",
                orderable: false,
                data: null,
                render: function (data, type, row) {
                    var buttonsHtml = `
    <div class='btn-group'>
        <button class='jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-success edit-btn' value='${row.qansId}' onclick='editQO(this, event)'></button> &nbsp;
        <button class='jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn' value='${row.qansId}' onclick='deleteQO(this, event)'></button> &nbsp;
        <button class='jsgrid-button jsgrid-info-button ti-info-alt btn btn-info info-btn' data-question-id='${row.qansId}' onclick='getoptions(${row.qansId})'></button>
    </div>`;
                    return buttonsHtml;
                }

            }
        ],
        "order": [[0, 'asc']]
    });
}
function getoptions(id) {
    debugger;
    var apiUrl = 'https://localhost:7092/api/UserAPI/GetOptionsByQuestionId/' + id;
    $.ajax({
        type: 'GET',
        url: apiUrl,
        contentType: "application/json",
        success: function (data) {
            createOptionsTable(id, data);
        },
        error: function (error) {
            console.error(error);  // Log the error for debugging
            alert("Error sending data..Please check console!");
        }
    });
}
function createOptionsTable(questionId, optionsData) {
    // Check if the options table is already visible
    var isTableVisible = $('#optionsTable_' + questionId).length > 0;

    // If the table is visible, hide it and remove it
    if (isTableVisible) {
        $('#optionsTable_' + questionId).remove();
        $('.options-table-container').remove();
    } else {
        // Remove all rows and data from the table
        $('.options-table-container').remove();

        // Create a new table row
        var tablerow = $('<tr class="options-table-container"></tr>');

        // Create a new cell (td) with colspan="4"
        var colspanCell = $('<td colspan="4"></td>');

        // Append the colspan cell to the row
        tablerow.append(colspanCell);

        // Create a new table for options
        var optionsTable = $('<table class="table table-hover table-bordered table-striped w-100"></table>');

        // Create the table head
        var tableHead = $('<thead></thead>');
        var tableHeadRow = $('<tr style="text-align:center"></tr>');
        tableHeadRow.append('<th>Option Content</th>');
        tableHeadRow.append('<th style="text-align:center">Option Status</th>');
        tableHead.append(tableHeadRow);
        optionsTable.append(tableHead);

        // Create the table body
        var tableBody = $('<tbody></tbody>');
        for (var i = 0; i < optionsData.length; i++) {
            var option = optionsData[i];
            var optionRow = $('<tr style="text-align:center"></tr>');
            optionRow.append('<td>' + option.optionContent + '</td>');
            optionRow.append('<td style="text-align:center">' + option.optionStatus + '</td>');
            tableBody.append(optionRow);
        }
        optionsTable.append(tableBody);

        // Add a unique ID to the new table
        optionsTable.attr('id', 'optionsTable_' + questionId);

        // Append the inner table to the colspan cell
        colspanCell.append(optionsTable);

        // Find the row of the "+" button
        var plusButtonRow = $('button[data-question-id="' + questionId + '"]').closest('tr');

        // Insert the new options table below the row with the "+" button
        plusButtonRow.after(tablerow);
    }
}
function editQO(id, event) {
    event.preventDefault();
    var apiUrl = 'https://localhost:7092/api/UserAPI/getQuestionAndOptions/' + id.value;
    selectedRowForUpdate = id.value;
    $.ajax({
        type: 'GET',
        url: apiUrl,
        contentType: "application/json",
        success: function (data) {
            debugger;
            toggleTabs('content1');
            // Populate data in the "Add" tab
            $('#exam_name').val(data.examId).trigger('change'); // Select the exam by setting the value and triggering change event
            quill1.setText(data.questionContent); // Set the question content

            // Clear existing options in the table
            $('.datatable tbody').empty();
            $('.datatable thead').show();

            // Add options to the table
            optionData = []; // Clear the optionData array
            for (var i = 0; i < data.options.length; i++) {
                var option = data.options[i];
                var toggleBtnId = 'toggleBtn_' + i;
                var toggleBtnClass = option.status === 'true' ? 'toggle-switch toggle-active' : 'toggle-switch';

                var toggleBtn = '<div id="' + toggleBtnId + '" class="' + toggleBtnClass + '" style="transform: translateX(0px);" onclick="toggleOption(' + i + ')">' +
                    '<div class="toggle-button"></div>' +
                    '</div>';

                var statusTextId = 'statusText_' + i;
                var statusText = '<div id="' + statusTextId + '" class="option-status-text">' + (option.status === 'true' ? 'True' : 'False') + '</div>';

                var deleteBtnId = 'deleteBtn_' + i;
                var deleteBtn = '<button class="jsgrid-button jsgrid-delete-button ti-trash btn btn-danger delete-btn" type="button" onclick="deleteRow(' + i + ')"></button>';

                var updateBtnId = 'updateBtn_' + i;
                var updateBtn = '<button class="jsgrid-button jsgrid-edit-button ti-pencil-alt btn btn-primary edit-btn" type="button" onclick="updateRow(' + i + ')"></button>';

                var tbody = $('.datatable tbody');
                var row = '<tr>' +
                    '<td class="option-content">' + option.content + '</td>' +
                    '<td>' + statusText + '</td>' +
                    '<td>' + toggleBtn + '</td>' +
                    '<td>' + updateBtn + '&nbsp;' + deleteBtn + '</td>' +
                    '</tr>';
                tbody.append(row);

                // Update optionData array
                optionData.push({
                    content: option.content,
                    status: option.status
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
function deleteQO(id, event) {
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
                url: 'https://localhost:7092/api/UserAPI/DeleteQuestionAndOptions/' + id.value,
                contentType: "application/json; charset=utf-8",
                success: function (data1) {
                    ValidationCallForSuccess(data1);
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
            console.error('Error fetching customer details:', error);
        }
    });
}