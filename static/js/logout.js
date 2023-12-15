const logout = document.getElementById("logout")
const logout_no = document.getElementById("logout-no")
const logout_yes = document.getElementById("logout-yes")
const logout_dialog = document.getElementById("logout-dialog")
logout.addEventListener("click", () => {
    console.log("logout click")
    logout_dialog.showModal()
})

logout_no.addEventListener("click", () => {
    logout_dialog.close()
})

logout_yes.addEventListener("click", () => {

    fetch("/logout", {
        method: "GET"
    })
        .then(() => {
            window.location.href = "/";
        })
        .catch(error => {
            console.error("errorMsg:", error)
        })
})