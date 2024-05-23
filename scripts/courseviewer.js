function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}

let currentCourse = null
let currentSectionElement = null
let currentSectionIndex = -1
$.loadSection = function() {
    if (currentSectionIndex >= currentCourse.sections.length) {
        window.location.href = "./stories.html"
        Cookies.set(`course-${currentCourse.cookie_name}`, true, {
            expires: 365
        })
    }
    let currentSectionData = currentCourse.sections[currentSectionIndex]
    let clonedElement = $("#section__template").clone()
    
    $(clonedElement).attr("id", null)
    if (currentSectionData.big_title != undefined) {
        $(clonedElement).children(".big-title").text(currentSectionData.big_title)
    } else {
        $(clonedElement).children(".big-title").hide()
    }

    $(clonedElement).children("md-block").html(currentSectionData.markdown)
    if (currentSectionData.continue_requirement != undefined) {
        $(clonedElement).children("button").prop("disabled", true)
        $(clonedElement).children("button").addClass("disabled")
        waitForElm(".text-glow").then(() => {
            $(".text-glow").hover(() => {
                console.log("hover")
                $(clonedElement).children("button").prop("disabled", null)
                $(clonedElement).children("button").removeClass("disabled")
                $(".text-glow").removeClass("text-glow")
            })
        })
    }

    $(clonedElement).children("button").text(currentSectionData.button_text)
    $(clonedElement).children("button").on("click", () => {
        $.unloadCurrentSectionAndLoadNextSection()
    })

    $(clonedElement).appendTo("#course__section")
    $(clonedElement).slideDown("slow")
    $(function(){
        $(document).tooltip()
    })
    currentSectionElement = clonedElement
}

$.unloadCurrentSectionAndLoadNextSection = function() {
    currentSectionIndex += 1
    
    let currentSection = currentCourse.sections[currentSectionIndex]
    if (currentSectionElement != null) {
        $(currentSectionElement).fadeOut("slow", () => {
            $(currentSectionElement).remove()
            $.loadSection()
        })
        return
    } 

    $.loadSection()
}

$.loadCourse = function(courseData) {
    currentCourse = courseData
    $.unloadCurrentSectionAndLoadNextSection()
}

$(document).ready(() => {
    let course_name = $.urlParam("course")
    let course_path = `./courses/${course_name}.json`

    $.getJSON(course_path,
        function (data) {
            $.loadCourse(data)
        }
    );
})