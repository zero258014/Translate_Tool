let email_edit_btn = document.getElementById("email-edit-btn")
let email_input = document.getElementById("email")
let email_input_value = email_input.value
let info_submit = document.getElementById("info-submit")
let cancel = document.getElementById("update-cancel-btn")
let errorMsg = document.getElementById("errorMsg")

email_edit_btn.addEventListener("click", () => {
    email_input.disabled = false
    email_input.style.border = "1px black solid"
    email_input.style.borderRadius = "5px"
    email_input.style.backgroundColor = "white"
    email_input.style.color = "black"
    info_submit.style.display = "inline"
    cancel.style.display = "inline"
})


info_submit.addEventListener("click", (event) => {
    let email_value = document.getElementById("email").value
    if (email_input_value === email_value) {
        event.preventDefault()
        errorMsg.textContent = "新しいemailを入力してください。"
    } else {

    }
})

cancel.addEventListener("click", () => {
    window.location.href = "/info";
})


let pwd_change_btn = document.getElementById("pwd-change-button")
let info_form = document.getElementById("info-form")
let pwd_form = document.getElementById("pwd-form")
let pwd_submit = document.getElementById("pwd-submit")
let pwd_cancel = document.getElementById("pwd-cancel-btn")


pwd_change_btn.addEventListener("click", () => {
    info_form.style.display = "none"
    pwd_form.style.display = "inline"
})

pwd_cancel.addEventListener("click", () => {
    window.location.href = "/info";
})

pwd_submit.addEventListener("click", (event) => {
    let old_pwd = document.getElementById("old-pwd").value
    let new_pwd = document.getElementById("new-pwd").value
    let new_pwd_check = document.getElementById("new-pwd-check").value
    if (old_pwd === "" || new_pwd === "" || new_pwd_check === "") {
        console.log(old_pwd + "," + new_pwd + "," + new_pwd_check)
        event.preventDefault()
        errorMsg.textContent = "空欄を入力してください。"
    } else {
        if (new_pwd !== new_pwd_check) {
            event.preventDefault()
            errorMsg.textContent = "新しいパスワードは一致しないので、ご確認ください。"
        } else if (new_pwd === old_pwd) {
            event.preventDefault()
            errorMsg.textContent = "古いパスワードと違うパスワードを入力してください。"
        }
    }
})


let dialog_btn = document.getElementById("dialog-btn")

dialog_btn.addEventListener("click", () => {
    console.log("aaaaa")
    let result_dialog = document.getElementById("result-dialog")
    result_dialog.close()
})
