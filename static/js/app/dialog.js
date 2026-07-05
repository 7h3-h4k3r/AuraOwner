class Dialog {
    constructor({ 
        title = "", 
        content = "", 
        size = "md",
        backdrop = true,     // true | false | 'static'
        keyboard = true      // ESC key
    } = {}) {
        this.id = "dlg-" + Math.random().toString(36).substr(2, 9);
        this.title = title;
        this.content = content;
        this.size = size;
        this.backdrop = backdrop;
        this.keyboard = keyboard;
        this.buttons = [];
    }

    setButtons(buttons = []) {
        this.buttons = buttons;
        return this;
    }

    render() {
        let sizeClass = {
            sm: "modal-sm",
            md: "",
            lg: "modal-lg",
            xl: "modal-xl"
        }[this.size] || "";

        const modalHTML = `
        <div class="modal fade" id="${this.id}" tabindex="-1">
            <div class="modal-dialog  modal-dialog-centered ${sizeClass}">
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <h5 class="modal-title">${this.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        ${this.content}
                    </div>

                    <div class="modal-footer"></div>

                </div>
            </div>
        </div>
        `;

       document.querySelector("main").insertAdjacentHTML("beforeend", modalHTML);

        const modalEl = $('#' + this.id);

        // Render buttons properly
        const footer = modalEl.find('.modal-footer');
        this.buttons.forEach(btn => {
            const button = $(`
                <button type="${btn.type || 'button'}" class="btn ${btn.class || 'btn-primary'}">
                    ${btn.text || 'Button'}
                </button>
            `);

            if (btn.dismiss) {
                button.attr('data-bs-dismiss', 'modal');
            }

            if (typeof btn.onClick === "function") {
                button.on('click', (e) => btn.onClick(e, modalEl));
            }

            footer.append(button);
        });

        modalEl.on('submit', 'form', function (e) {
            e.preventDefault();
            modalEl.find('[type="submit"]').first().click();
        });

        modalEl.on('hidden.bs.modal', function () {
            modalEl.remove();
        });


        const bsModal = new bootstrap.Modal(modalEl[0], {
            backdrop: this.backdrop,
            keyboard: this.keyboard
        });
        bsModal.show();

        return modalEl;
    }
}

// const content = `
// <form>
//     <input type="text" class="form-control mb-2" placeholder="Username">
//     <input type="password" class="form-control mb-2" placeholder="Password">
//     <button type="submit" class="btn btn-primary w-100">Login</button>
// </form>
// `;

// new Dialog({
//     title: "Login",
//     content: content,
//     size: "sm"
// })

// .setButtons([
//     {
//         text: "Cancel",
//         class: "btn-secondary",
//         dismiss: true
//     },
//     {
//         text: "Login",
//         class: "btn-primary",
//         onClick: (e, modal) => {
//             const username = modal.find('[name="username"]').val();
//             const password = modal.find('[name="password"]').val();

//             console.log(username, password);

//             // your API call here
//         }
//     }
// ])
// .render();