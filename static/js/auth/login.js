class Signup {
    constructor() {}



    validateForm(data) {
        return (
            data.username.length >= 3 &&
            data.password.length >= 7
        );
    }

    run() {
        // Live validation
        $('#login-event').on('input', (event) => {
            const el = $(event.target);
            const value = el.val().trim();

            el.removeClass('is-valid is-invalid');

            if ((el.attr('id') === 'username') && value.length >= 3) {
                el.addClass('is-valid');

            } else if ((el.attr('id') === 'password') && value.length >= 7) {
                el.addClass('is-valid');

            } else {
                el.addClass('is-invalid');
            }
        });

        // Submit handler
        $('.btn-login').on('click', async (e) => {
            e.preventDefault();

            const data = {
                username: $('#username').val().trim(),
               
                phone: $('#phone').val().trim()
            };

            // Final validation before API
            if (!this.validateForm(data)) {
                alert('Invalid input. Please check all fields.');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Success:', result);
                    alert('Login successful');
                } else {
                    console.log('Error:', result);
                    alert(result.error || 'Login failed');
                }

            } catch (error) {
                console.error('Network error:', error);
                alert('Something went wrong');
            }
        });
    }
}


const l = new Signup();
l.run();