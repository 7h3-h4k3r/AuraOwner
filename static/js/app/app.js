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