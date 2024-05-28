//This function is used for use swal info
function ValidationCallForInfo(type) {
    Swal.fire(
        {
            icon: 'info',
            title: 'Info',
            text: type,
            didOpen: () => {
                // Use a timeout to ensure the Swal modal is rendered before attempting to set focus
                setTimeout(() => {
                    const okButton = document.querySelector('.swal2-confirm');
                    if (okButton) {
                        okButton.focus();
                    }
                }, 0);
            },
        }
    );
}

//This function is used for use swal success
function ValidationCallForSuccess(type) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: type,
        didOpen: () => {
            // Use a timeout to ensure the Swal modal is rendered before attempting to set focus
            setTimeout(() => {
                const okButton = document.querySelector('.swal2-confirm');
                if (okButton) {
                    okButton.focus();
                }
            }, 0);
        }
    })
}

//In phone no field we can't entry character
function validateInput(input) {
    // Remove any non-numeric characters
    input.value = input.value.replace(/\D/g, '');
}