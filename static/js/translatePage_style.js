let in_lan_opt = document.querySelectorAll(".input-language-opt");
let out_lan_opt = document.querySelectorAll(".output-language-opt");

opt_color_change(in_lan_opt)
opt_color_change(out_lan_opt)

function opt_color_change(opt) {
    opt.forEach(element => {
        element.addEventListener("click", () => {
            opt.forEach(e => {
                e.style.backgroundColor = "#f6f6f6"
            })
            element.style.backgroundColor = "rgb(255, 233, 143)"
        })
    });
}


let clear_btn = document.getElementById("clear-btn")

clear_btn.addEventListener("click", () => {
    let input_text = document.getElementById("input-text")

    if (input_text.value !== "") {
        input_text.value = ""
    }
})


let copy_btn = document.getElementById("copy")

copy_btn.addEventListener("click", () => {
    let result = document.getElementById("result")
    let copied = document.getElementById("copied")
    navigator.clipboard.writeText(result.innerText)
        .then(() => {
            copied.style.visibility = "visible"
            copied.style.transform = "translateY(-60px)"
            copied.style.transition = "transform 1.5s ease-out"
            copied.addEventListener("transitionend", () => {
                copied.style.visibility = "hidden"
                copied.style.transform = "translateY(0)"
            })

        })
        .catch(error => console.log(error))
})