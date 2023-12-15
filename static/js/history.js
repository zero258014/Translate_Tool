
/*  ハートマークの呼び出し */

let myFavoriteButton = document.getElementById("my-favorite-button")

myFavoriteButton.addEventListener("click", () => {
    fetch("/myFavorite", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            render_history(data)
        })
        .catch(e => {
            console.error("error msg:", e)
        })
})


/* tbody中のclickイベンド */
let tbody = document.getElementById("history-forloop")
let delete_translation_id = ""

tbody.addEventListener("click", event => {
    const target = event.target

    /*  ハートマーク機能  */
    if (target.classList.contains("fa-heart")) {
        let myFavorite_status = 0;
        let translation_id = target.getAttribute("data-value")

        if (target.classList.contains("fa-solid")) {
            target.classList.remove("fa-solid");
            target.classList.add("fa-regular");
            myFavorite_status = 1;
        } else {
            target.classList.remove("fa-regular");
            target.classList.add("fa-solid");
            myFavorite_status = 0;
        }
        const data = {
            translation_id: translation_id,
            myFavorite_status: myFavorite_status
        }

        // データベースの変更(0⇔1)
        //データをバッグエンドに送る
        fetch("/myFavorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.text()
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error("error:", error)
            })

    } else if (target.classList.contains("data-delete")) {
        /* 削除ボタン機能 */
        const dialog = document.getElementById("delete-dialog")
        dialog.showModal()
        delete_translation_id = target.getAttribute("data-value")

    } else if (target.tagName === "TD") {
        let dialog = document.getElementById("detail-dialog")
        let tr_contents = target.parentNode
        let td_contents = tr_contents.querySelectorAll("td")
        let td_texts = []
        td_contents.forEach(td => {
            td_texts.push(td.textContent)
        })

        let time = document.getElementById("detail-time")
        let input_lan = document.getElementById("input-lan")
        let output_lan = document.getElementById("output-lan")
        let input_text = document.getElementById("input-text")
        let output_text = document.getElementById("output-text")

        time.textContent = td_texts[1]
        input_lan.textContent = td_texts[2]
        output_lan.textContent = td_texts[4]
        input_text.textContent = td_texts[3]
        output_text.textContent = td_texts[5]

        dialog.showModal()
    }
})


/* 詳細内容のdialog */
const detail_dialog_btn = document.getElementById("detail-dialog-btn")

detail_dialog_btn.addEventListener("click", () => {
    let detail_dialog = document.getElementById("detail-dialog")
    detail_dialog.close()
})


/* data削除のdialogを開いたら、削除requestをバッグエンドに送る */
const delete_dialog = document.getElementById("delete-dialog")
const delete_yes = document.getElementById("delete-yes")
const delete_no = document.getElementById("delete-no")

delete_no.addEventListener("click", () => {
    delete_dialog.close()
})

delete_yes.addEventListener("click", () => {

    console.log(delete_translation_id)
    const data = {
        delete_translation_id: delete_translation_id,
    }
    fetch("/dataDelete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            delete_dialog.close()
            render_history(data)
        })
        .catch(e => {
            console.error("error:", e)
        })
})



/*  データベースに何かの処理をresqusetして、
    返してくるresponseを画面表示するfunctionです  */
function render_history(json_data) {
    let all_tr = document.getElementsByClassName("all-tr");
    // collectionをarrayに変換する。そうしないと、all-trを完全にされるできません。
    let all_tr_array = Array.from(all_tr);

    // all-trの中身を全部削除する
    all_tr_array.forEach(element => {
        element.remove();
    });

    json_data.forEach((d, index) => {
        let tbody = document.getElementById("history-forloop")
        let tr = document.createElement("tr")
        tr.className = "all-tr"
        for (let i = 0; i < d.length; i++) {
            index++

            //日にちを "YYYY-MM-DD HH:MM:SS"の形式にする
            if (i === 2) {
                let dateString = d[i];
                let dateObject = new Date(dateString);

                let year = dateObject.getUTCFullYear();
                let month = ('0' + (dateObject.getUTCMonth() + 1)).slice(-2);
                let day = ('0' + dateObject.getUTCDate()).slice(-2);
                let hours = ('0' + dateObject.getUTCHours()).slice(-2);
                let minutes = ('0' + dateObject.getUTCMinutes()).slice(-2);
                let seconds = ('0' + dateObject.getUTCSeconds()).slice(-2);

                let formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

                d[i] = formattedDate
            }

            if (i === 3 || i === 5) {
                switch (d[i]) {
                    case "Japanese":
                        d[i] = "日本語";
                        break;
                    case "Chinese":
                        d[i] = "中国語";
                        break;
                    case "English":
                        d[i] = "英語";
                        break;
                }
            }


            if (i === 1) {
                continue
            } else if (i == 7) {
                let td = document.createElement("td")
                let iElement = document.createElement("i");
                iElement.style.color = "#fb4b4b";
                iElement.setAttribute("data-value", d[0]);

                if (d[7] == 1) {
                    iElement.className = "fa-solid fa-heart fa-xl";
                } else {
                    iElement.className = "fa-regular fa-heart fa-xl";
                }

                td.appendChild(iElement)
                tr.appendChild(td)
            } else {
                let td = document.createElement("td")
                if (i === 0) {
                    td.textContent = index
                } else {
                    td.innerHTML = d[i]
                }
                tr.appendChild(td)
            }
        }
        let td = document.createElement("td")
        let button = document.createElement("button")
        button.textContent = "削除"
        button.className = "data-delete"
        button.setAttribute("data-value", d[0]);
        td.appendChild(button)
        tr.appendChild(td)
        tbody.appendChild(tr)
    })
}



// 検索条件のinputイベンド
let input_keyword = document.querySelectorAll(".input-keyword")

input_keyword.forEach(e => {
    e.addEventListener("focus", () => {
        e.removeAttribute('placeholder');
    })

    e.addEventListener("blur", () => {
        if (e.value === "") {
            e.setAttribute("placeholder", "Keyword")
        }
    })
})

