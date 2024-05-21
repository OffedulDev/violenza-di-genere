const MESSAGES = [
    "#intro__section__0",
    "#intro__section__0-5",
    "#intro__section__0-75",
    "#intro__section__1",
    "#intro__section__2",
    "#intro__section__3",
    "#intro__section__4",
    "#intro__section__5",
    "#intro__section__6",
    "#intro__section__7",
    "#intro__section__8",
    "#intro__section__9 ",
]

function bounce(selector) {
    function loop() {
        if (!(selector.attr("data-stop-bounce") == "true")) {
            selector.animate({
                marginTop: "1rem"
            }, {
                done: () => {
                    selector.animate({
                        marginTop: "0.5rem"
                    }, {
                        done: () => {
                            loop()
                        }
                    })
                }
            })
        } else {
            let interID = setInterval(() => {
                if (selector.attr("data-stop-bounce") == "false") {
                    clearInterval(interID)
                    loop()
                }
            }, 1500)
        }
    }

    loop()
}

function loadPageNormally() {
    $("#hero__inner__container").hide()
    $("#hero__center").hover(() => {
        $("#hero__inner__container").slideDown("slow")

        // TITLES OUT
        $("#main__title").animate({
            fontSize: "1rem"
        })
        $("#sub__title").animate({
            fontSize: "1rem"
        })

        $("#hero__arrow__up").attr("data-stop-bounce", "true")
    }, () => {
        $("#hero__arrow__up").attr("data-stop-bounce", "false")

        // TITLES IN
        $("#main__title").animate({
            fontSize: "1.5rem"
        })
        $("#sub__title").animate({
            fontSize: "2rem"
        })

        $("#hero__inner__container").slideUp("slow")
    })
    
    bounce($("#hero__arrow__up"))
}

$(document).ready(() => {
    $.each($("a"), function(index, value){
        if (!$(value).hasClass("no-target")) {
            $(value).attr("target", "_blank")
        }
    })

    $(".stop-glow-on-hover").hover((event) => {
        $(event.target).off("mouseenter")
        $(event.target).removeClass("text-glow")
    })

    function acceptCookies() {
        Cookies.set("acceptedCookies", true, {
            expires: 1,
            path: ""
        })
        $("#cookies__box").slideUp("slow")
    }

    if (Cookies.get("acceptedCookies") != undefined) {
        $("#cookies__box").slideUp()
    } else {
        setTimeout(() => {
            if (Cookies.get("acceptedCookies") == undefined) {
                $("#cookies__box").children("span").text("Cookies accettati automaticamente")
                $("#cookies__box").children("button").hide()
                setTimeout(() => {
                    acceptCookies()
                }, 2500);
            }  
       }, 5500);
    }

    $("#accept__cookies").on("click", () => {
        acceptCookies()
    })
    $(function(){
        $(document).tooltip()
    })
    $(".intro-section").hide()

    if (Cookies.get("didIntro") == undefined) {
        $("#hero__section").hide()
        $("#intro__section").show()

        let currentMessageIndex = -1
        function continueNextSection() {
            currentMessageIndex += 1
            if (MESSAGES[currentMessageIndex] == undefined) {
                Cookies.set("didIntro", "true", {
                    expires: 7,
                    path: ""
                })
                $("#intro__section").fadeOut("slow", () => {
                    $("#hero__section").fadeIn("slow", () => {
                        loadPageNormally()
                    })
                })
            }

            if (currentMessageIndex == 3) {
                $(MESSAGES[currentMessageIndex]).slideDown("slow")
            } else {
                $(MESSAGES[currentMessageIndex]).fadeIn("slow")
            }
        }
        function nextSection() {
            if (MESSAGES[currentMessageIndex] != undefined) {
                $(MESSAGES[currentMessageIndex]).fadeOut("slow", () => {
                    continueNextSection()
                })
                return
            }
            
            continueNextSection()
        }

        nextSection()
        $(".next-intro-section").on("click", (event) => {
            nextSection()
            $(event.target).off("click")
        })
        return
    }

    loadPageNormally()
})