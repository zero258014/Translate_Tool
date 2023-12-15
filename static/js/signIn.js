
//登録成功メッセージ
if (document.getElementById("close")) {


    let dialog_close = document.getElementById("close")

    dialog_close.addEventListener("click", () => {
        console.log("click")
        document.querySelector("dialog").close()
    })

}


let redirect = document.getElementById("redirect-sign-up")

redirect.addEventListener("click", () => {
    window.location.href = "/signUp";
})
