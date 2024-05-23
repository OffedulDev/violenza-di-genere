function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
            costs[j] = j;
        else {
            if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
            }
        }
        }
        if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

$.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
};

$(document).ready(() => {
    let currentCoursesElements = []
    $.getJSON("./courses/header.json",
        function (data) {
            $.each(data.courses, function(key, value){
                let clonedElement = $("#course__template").clone()

                $(clonedElement).attr("id", null)
                $(clonedElement).children(".card-subtitle").text(value.description)
                $(clonedElement).children(".card-heading").text(value.title)

                let hasAlreadyFinished = false
                if (Cookies.get(`course-${value.cookie_name}`) != undefined) {
                    hasAlreadyFinished = true
                    $(clonedElement).children("button").text("Guarda un altra volta")
                    $(clonedElement).children("button").addClass("button-secondary")
                    $(clonedElement).children("button").removeClass("button-primary")
                }
                $(clonedElement).children("button").on("click", () => {
                    if (hasAlreadyFinished) {
                        let dialog = $("<div></div>")
                        $(dialog).attr("title", "Sei sicuro di voler riaprire questo corso?")
                        $(dialog).appendTo("body");
                        
                        let dialog_text = $("<p></p>")
                        $(dialog_text).html(`Sembra che tu abbia già completato il percorso <strong>${value.title}</strong>, sei sicuro di volerlo riaprire?`)
                        
                        let confirm_button = $("<button></button>")
                        $(confirm_button).text("Si")
                        
                        $(dialog_text).appendTo(dialog)
                        $(confirm_button).appendTo(dialog)
                        $(confirm_button).on("click", () => {
                            window.location.href = `./courseviewer.html?course=${value.file}`
                        })
                        $(dialog).dialog()

                        return
                    }

                    window.location.href = `./courseviewer.html?course=${value.file}`
                })
                $(clonedElement).appendTo("#courses__container")
                $(clonedElement).slideDown("slow")


                currentCoursesElements.push(clonedElement)
            })
        }
    );

    $("#search__course").on("change", () => {
        let input_value = $("#search__course").val()
        $.each(currentCoursesElements, function(key, value){
            if (input_value.length === 0) {
                $(value).slideDown("slow")
                return
            } 

            if ($(value).children(".card-heading").text().toLowerCase().includes(input_value)) {
                $(value).slideDown("slow")
            } else {
                if (similarity($(value).children(".card-heading").text(), input_value) > 0.6) {
                    $(value).slideDown("slow")
                    return
                }
                $(value).slideUp("slow")
            }
        })
    })
})

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

    $.getJSON("./stories/data.json", function (data) {
        $.each(data.stories, function(key, value){
            let clonedElement = $("#card__template").clone()

            $(clonedElement).attr("id", null)
            $(clonedElement).children(".card-subtitle").text(value.source)
            $(clonedElement).children(".card-heading").text(value.title)
            $(clonedElement).children("img").attr("src", value.image)
            $(clonedElement).children("a").on("click", () => {
                window.location.href = `./storyviewer.html?story=${value.markdown}`
            })
            $(clonedElement).appendTo("#main__carousel")
            $(clonedElement).slideDown("slow")
        })
    })
})