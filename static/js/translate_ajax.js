let form = document.getElementById("myForm");



form.addEventListener("submit", function (event) {
    event.preventDefault();
    let resultP = document.getElementById("result")
    let input_text = document.getElementById("input-text").value
    if (input_text === "") {
        console.log("no text")
        resultP.style.color = "red"
        resultP.textContent = "文章を入力してください"
    } else {
        let formData = new FormData(form)
        let loading = document.getElementById("loading")
        let check = document.getElementById("check")

        check.style.visibility = "hidden"
        loading.style.visibility = "visible"

        fetch("/translatePage", {
            method: "POST",
            body: formData
        })
            .then(response => {
                return response.text()
            })
            .then(data => {
                resultP.style.color = "black"
                resultP.textContent = data
                loading.style.visibility = "hidden"
                check.style.visibility = "visible"
            })
            .catch(e => {
                console.error("error:", e)
            })
    }
});



