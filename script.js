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

$(document).ready(() => {
    $("#hero__inner_container").hide()
    $("#hero__center").hover(() => {
        $("#hero__inner_container").slideDown("slow")

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

        $("#hero__inner_container").slideUp("slow")
    })
    
    bounce($("#hero__arrow__up"))
})