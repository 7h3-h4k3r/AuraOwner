class Signup {
    constructor() {}

    validateTenDigits(number){
        const regex = /^\d{10}$/;
        return regex.test(number);
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validateForm(data) {
        return (
            data.username.length >= 3 &&
            this.validateEmail(data.email) &&
            this.validateTenDigits(data.phone) &&
            data.password.length >= 7
        );
    }

    run() {
        // Live validation
        $('#signup-event').on('input', (event) => {
            const el = $(event.target);
            const value = el.val().trim();

            el.removeClass('is-valid is-invalid');

            if ((el.attr('id') === 'username') && value.length >= 3) {
                el.addClass('is-valid');

            } else if ((el.attr('id') === 'email') && this.validateEmail(value)) {
                el.addClass('is-valid');

            } else if ((el.attr('id') === 'phone') && this.validateTenDigits(value)) {
                el.addClass('is-valid');

            } else if ((el.attr('id') === 'password') && value.length >= 7) {
                el.addClass('is-valid');

            } else {
                el.addClass('is-invalid');
            }
        });

        // Submit handler
        $('.btn-signup').on('click', async (e) => {
            e.preventDefault();

            const data = {
                username: $('#username').val().trim(),
                email: $('#email').val().trim(),
                password: $('#password').val().trim(),
                phone: $('#phone').val().trim()
            };

            // Final validation before API
            if (!this.validateForm(data)) {
                alert('Invalid input. Please check all fields.');
                return;
            }

            const response = await fetch('/api/v1/auth/signup', {
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
                alert("Credentials alreay exist Signup failed");
            }

    });
    }
}

const l = new Signup();
l.run();