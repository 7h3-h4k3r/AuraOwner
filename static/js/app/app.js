const animateCSS = (element, animation, prefix = 'animate__') =>
  new Promise((resolve) => {

    const node = (typeof element === "string")
        ? document.querySelector(element)
        : element;

    if (!node) return;

    const animationName = `${prefix}${animation}`;
    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
});

$('.top-bar-btn').on('click',function(){
    $(this).toggleClass('collapsed').attr('aria-expanded', $(this).attr('aria-expanded') !== 'true');
    $('#navigation').toggleClass('show')
    
})

$('.profile-toggle').on('click', function(){
    console.log(this)
    console.log('profile click')
    let parent = $(this).closest('.nav-item');

    parent.toggleClass('open');
    parent.find('.submenu').slideToggle(200);
});

$('.btn-add-catogory').on('click',function(){
    $.get('/api/v1/dialog/create/catogory',function(data){
       
       var dialog = new Dialog({
            title: 'Add Category',
            content: data,
            size: 'lg',
            backdrop: true // or true / false
        });
        dialog.setButtons([
            {
                text: "Create",
                name:'create',
                class : 'my-btn-secondary btn-create-catogory',
                onClick : (e,modal) => {
                    var name = $('#catogory-name').val().trim()
                    var desc = $('#description-area').val().trim()
                    if (name.length >= 3 && desc.length >= 5){
                        console.log('yes its good')
                    }else{
                        animateCSS(modal.find('.btn-create-catogory')[0], 'shakeX');
                    }

                }
            },
            {
                text: "Cancel",
                class: "btn-secondary",
                dismiss: true
            },
        ])
        dialog.render()
    })
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
})

