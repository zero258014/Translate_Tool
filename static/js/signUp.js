
// formをrequestする前にform内容を確認
let form = document.getElementById("sign-up-form")
let wraning = document.getElementById("warning")
// let msg = document.getElementById("msg")
form.addEventListener("submit", (event) => {
    let username = document.getElementById("username")
    let email = document.getElementById("email")
    let password = document.getElementById("password").value
    let password_check = document.getElementById("password-check").value

    if (username === "" || email === "" || password === "" || password_check === "") {
        wraning.innerText = "空欄を入力してください"
        wraning.style.color = "red"
        event.preventDefault();
    } else {
        if (password !== password_check) {
            // msg.innerText = ""
            wraning.innerText = "パスワードは一致しないので、ご確認ください。"
            wraning.style.color = "red"
            event.preventDefault();
        }
    }
})



// ユーザー名確認
let usernameCheck = document.getElementById("username-check")

usernameCheck.addEventListener("click", () => {
    let username = document.getElementById("username").value
    let check_msg = document.getElementById("check-name-msg")

    if (username === "") {
        check_msg.innerText = "ユーザー名を入力してください"
        check_msg.style.color = "red"
    } else {
        let formData = new FormData(form)

        fetch("/usernameCheck", {
            method: "POST",
            body: formData
        })
            .then(response => {
                return response.text()
            })
            .then(data => {
                if (data === "True") {
                    check_msg.innerText = "ユーザー名は既に存在しています"
                    check_msg.style.color = "red"
                } else {
                    check_msg.innerText = "OK"
                    check_msg.style.color = "green"
                }
            })
            .catch(e => {
                console.error("error:", e)
            })
    }
})


let redirect = document.getElementById("redirect-login")

redirect.addEventListener("click", () => {
    window.location.href = "/signIn";
})