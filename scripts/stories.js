$.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

$(document).ready(() => {
    let currentScroll = 0
    $("#forward__scroll").on("click", () => {
        currentScroll = $.clamp(currentScroll + 300, 0, document.getElementById("main__carousel").scrollWidth - document.getElementById("main__carousel").clientWidth)
        $("#forward__scroll").prop("disabled", true)
        $("#main__carousel").animate({
            scrollLeft: currentScroll
        }, 200, function() {
            $("#forward__scroll").prop("disabled", null)
        })
    })
    $("#back__scroll").on("click", () => {
        currentScroll = $.clamp(currentScroll - 300, 0, document.getElementById("main__carousel").scrollWidth - document.getElementById("main__carousel").clientWidth)
        $("#back__scroll").prop("disabled", true)
        $("#main__carousel").animate({
            scrollLeft: currentScroll
        }, 200, function() {
            $("#back__scroll").prop("disabled", null)
        })
    })

    $.getJSON("stories/data.json", function (data) {
        $.each(data.stories, function(key, value){
            let clonedElement = $("#card__template").clone()

            $(clonedElement).attr("id", null)
            $(clonedElement).children(".card-subtitle").text(value.source)
            $(clonedElement).children(".card-heading").text(value.title)
            $(clonedElement).children("img").attr("src", value.image)
            $(clonedElement).on("click", () => {
                window.location.href = `./storyviewer.html?story=${value.markdown}`
            })
            $(clonedElement).appendTo("#main__carousel")
            $(clonedElement).slideDown("slow")
        })
    })
})