from flask import Flask, render_template, request, session, redirect, url_for, jsonify
import translate
import databaseCRUD
import secrets
import datetime

app = Flask(__name__)

# sessionを使用するためのkeyを設置
random_key = secrets.token_hex(16)
app.secret_key = random_key

# ---------------------------------------------------------
# --------------------ホームページ----------------------------
# ---------------------------------------------------------


@app.route("/")
def index():
    if "username" in session:
        username = session["username"]
        return render_template("index.html", username=username)
    else:
        return render_template("index.html")


# ---------------------------------------------------------
# --------------------翻訳ページ----------------------------
# ---------------------------------------------------------

@app.route("/translatePage",  methods=['GET', 'POST'])
# 翻訳ページ
def translatePage():
    if (request.method == "POST"):

        inputLanguage = request.form['inputLanguage']
        print(inputLanguage)

        outputLanguage = request.form['outputLanguage']
        print(outputLanguage)

        text = request.form["textToTranslate"]
        print(text)
        result = translate.translate(inputLanguage, outputLanguage, text)
        if "username" in session:
            user = session["username"]
            translation_time = datetime.datetime.now()
            saveMsg = databaseCRUD.save_translation_result(
                user, translation_time, inputLanguage, text, outputLanguage, result)
            print(saveMsg)
        return result
    else:
        if "username" in session:
            username = session["username"]
            return render_template("translatePage.html", username=username)
        else:
            return render_template("translatePage.html")


# ---------------------------------------------------------
# ----------------------履歴検索ページ----------------------------
# ---------------------------------------------------------

@app.route("/history", methods=["GET", "POST"])
# 履歴検索ページ
def historyPage():
    if (request.method == "POST"):
        username = session["username"]
        start_date = request.form.get("start_date")
        end_date = request.form.get("end_date")
        input_language = request.form.get("input_language")
        input_keyword = request.form.get("input_keyword")
        output_language = request.form.get("output_language")
        output_keyword = request.form.get("output_keyword")
        print(start_date, ",", end_date, ",", input_language, ",",
              input_keyword, ",", output_language, ",", output_keyword)

        search_result = databaseCRUD.search(start_date, end_date, input_language,
                                            input_keyword, output_language, output_keyword)

        search_result_jp = turn_to_jp(search_result)

        return render_template("history.html", username=username, history=search_result_jp)
    else:
        if "username" in session:
            username = session["username"]
            history = databaseCRUD.read_translation_all(username)
            print(type(history))
            history_jp = turn_to_jp(history)
            return render_template("history.html", username=username, history=history_jp)
        else:
            return render_template("history.html", errorMsg="ログインしていません。ログインしてください")


# ハートマーク機能の処理
@app.route("/myFavorite", methods=["GET", "POST"])
def myFavorite():
    if (request.method == "POST"):
        data = request.get_json()
        translation_id = data.get('translation_id')
        myFavorite_status = data.get('myFavorite_status')

        result = databaseCRUD.update_my_favorite(
            translation_id, myFavorite_status)

        return result
    else:
        if "username" in session:
            username = session["username"]
            history = databaseCRUD.read_my_favorite(username)
            history_json = jsonify(history)
            return history_json
        else:
            return "failed"


@app.route("/dataDelete", methods=["POST"])
def dataDelete():
    if (request.method == "POST"):
        data = request.get_json()
        delete_translation_id = data.get('delete_translation_id')
        result = databaseCRUD.delete_data(delete_translation_id)
        if (result == "success"):
            username = session["username"]
            history = databaseCRUD.read_translation_all(username)
            history_json = jsonify(history)
            return history_json
        else:
            return result


# databaseに保存された言語を英語から日本語に変換する(例：English > 英語)
def turn_to_jp(history_result):
    history_result_list = list(history_result)
    for i, h_row, in enumerate(history_result_list):
        print(type(h_row))
        h_row_list = list(h_row)
        for j, h in enumerate(h_row_list):
            if j == 3 or j == 5:
                if h == "Japanese":
                    h_row_list[j] = "日本語"
                elif h == "Chinese":
                    h_row_list[j] = "中国語"
                elif h == "English":
                    h_row_list[j] = "英語"
        history_result_list[i] = tuple(h_row_list)

    history_result_tuple = tuple(history_result_list)
    print(history_result_tuple)
    return history_result_tuple


# ---------------------------------------------------------
# ----------------------会員登録ページ------------------------
# ---------------------------------------------------------


@app.route("/signUp", methods=['GET', 'POST'])
# 会員登録ページ
def signUpPage():
    if (request.method == "POST"):
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        if databaseCRUD.username_check(username) and databaseCRUD.email_check(email):
            msg = "ユーザー名とemailもう使用されている"
        elif databaseCRUD.username_check(username):
            msg = "ユーザー名もう使用されている"
        elif databaseCRUD.email_check(email):
            msg = "emailもう使用されている"
        else:
            msg = databaseCRUD.create_user(username, password, email)

        if (msg == "success"):
            session['signUp_msg'] = '会員登録成功、ログインしてください'
            return redirect(url_for("signIn"))
        else:
            return render_template("signUp.html", msg=msg)
    else:
        return render_template("signUp.html", msg="")


@app.route("/usernameCheck", methods=["POST"])
# username確認のfunction（username確認のボタン押すと、ここで処理する）
def usernameCheck():
    if (request.method == "POST"):
        username = request.form.get("username")

        result = databaseCRUD.username_check(username)
        if (result):
            return "True"
        else:
            return "False"


# ---------------------------------------------------------
# --------------------ログインページ----------------------
# ---------------------------------------------------------

@app.route("/signIn", methods=["GET", "POST"])
# ログインページ
def signIn():
    if (request.method == "POST"):
        username = request.form.get("username")
        password = request.form.get("password")
        result = databaseCRUD.authenticate_user(username, password)

        if (result):
            session['username'] = username
            return redirect(url_for("index"))
        else:
            return render_template("signIn.html", errorMsg="ユーザーネームまたはパスワードが間違えました")
    else:
        signUpMsg = session.pop("signUp_msg", None)
        return render_template("signIn.html", signUpMsg=signUpMsg)


# ---------------------------------------------------------
# --------------------ログアウト----------------------
# ---------------------------------------------------------

@app.route("/logout")
def logout():
    session.pop("username", None)
    # return redirect(url_for("index"))
    return "OK"


# ---------------------------------------------------------
# --------------------個人情報ページ----------------------
# ---------------------------------------------------------

@app.route("/info", methods=["GET", "POST"])
def info():
    if (request.method == "POST"):
        username = session["username"]
        result = ""
        warningMsg = ""
        if request.form.get("email"):
            email = request.form.get("email")
            info_update_result = databaseCRUD.info_update(username, email)
            if info_update_result == "success":
                result = "個人情報更新成功"
            else:
                warningMsg = "個人情報更新失敗"
        else:
            old_pwd = request.form.get("old_pwd")
            new_pwd = request.form.get("new_pwd")

            pwd_check_result = databaseCRUD.authenticate_user(
                username, old_pwd)
            if (pwd_check_result == True):
                pwd_update_result = databaseCRUD.pwd_update(username, new_pwd)
                if pwd_update_result == "success":
                    result = "パスワード更新成功"
                else:
                    warningMsg = "パスワード更新失敗"
            else:
                warningMsg = "古いパスワードが間違っています"

        info = databaseCRUD.read_personal_info(username)

        return render_template("info.html", username=username, info=info, result=result, warningMsg=warningMsg)
    else:
        if "username" in session:
            username = session["username"]
            info = databaseCRUD.read_personal_info(username)

            return render_template("info.html", username=username, info=info)
        else:
            return render_template("info.html", errorMsg="ログインしていません。ログインしてください")


# ---------------------------------------------------------
# --------------------他の言語ページ----------------------
# ---------------------------------------------------------


@app.route("/english")
def english():
    return render_template("english.html")


@app.route("/chinese")
def chinese():
    return render_template("chinese.html")


if __name__ == '__main__':
    app.run(debug=True)
