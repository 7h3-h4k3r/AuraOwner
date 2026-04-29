class Login {
    constructor() {}



    validateForm(data) {
        return (
            data.username &&
            data.password &&
            data.username.trim().length >= 3 &&
            data.password.trim().length >= 7
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
               
                password: $('#password').val().trim(),
            };
            
            // Final validation before API
            if (!this.validateForm(data)) {
                alert('Invalid input. Please check all fields.');
                return;
            }

            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            let result;
            try {
                result = await response.json();
            } catch (e) {
                console.error("Response is not JSON");
                const text = await response.text();
                console.log("RAW RESPONSE:", text);
                return;
            }

            if (response.ok) {
                window.location.href = result.redirect;
            } else {
                alert("in valid Credentials Signin failed");
            }
        });
    }
}


const l = new Login();
l.run();