$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}

$(document).ready(() => {
    let story_name = $.urlParam("story")
    let story_path = `stories/markdown/${story_name}.md`

    $("#text__block").attr("src", story_path)
    $(".go-back").on("click", () => {
        window.location.href = "/stories.html"
    })
})