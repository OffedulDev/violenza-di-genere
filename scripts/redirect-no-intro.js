$(document).ready(() => {
    if (Cookies.get("didIntro") == undefined) {
        alert("Devi completare le istruzioni prima di poter accedere alle altre pagine! Verrai reindirizzato ora alla pagina principale.")
        window.location.href = "/"
    }
})