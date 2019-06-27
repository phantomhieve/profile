$(document).ready(function() {
    var scrolllink = $('.scroll');

    // Smooth scrolling
    scrolllink.click(function(event) {
        event.preventDefault();
        $('body,html').animate({
            scrollTop: $(this.hash).offset().top
        }, 1000);
    });

    //Active link switching
    $(window).scroll(function() {
        var scrollbarLocation = $(this).scrollTop();
        scrolllink.each(function() {
            var sectionOffset = $(this.hash).offset().top - 20;
          
            if ( sectionOffset <= scrollbarLocation ) {
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
            }
        })
    })
});