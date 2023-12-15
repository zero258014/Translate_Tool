import pymysql

# ----------------------------------------------------------------
#           データベースと接続して、データベースへの
#           追加、参照、更新、削除の処理を行うファイルです。
# ----------------------------------------------------------------

# 接続するdatabaseの情報
db = pymysql.connect(
    host='localhost',
    port=3306,
    user='shen',
    password='shen',
    database='translate_tool'
)


# ユーザーの追加
def create_user(username, password, email):
    cursor = db.cursor()
    try:
        db.begin()
        cursor.execute(
            "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)", (username, password, email))
        db.commit()
        return "success"
    except Exception as e:
        db.rollback()
        return "Error: " + str(e)


# ユーザーの確認、ログイン用
def authenticate_user(username, password):
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    if user:
        return True
    else:
        return False


# ユーザー名の確認、登録ページのユーザー名確認ボタン用
def username_check(username):
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE username = %s", (username))
    username = cursor.fetchone()
    if username:
        return True
    else:
        return False


# emailの確認、requestしてきたformの確認用
def email_check(email):
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM users WHERE email = %s", (email))
    email = cursor.fetchone()
    if email:
        return True
    else:
        return False


# 翻訳結果を保存する
def save_translation_result(user, time, inputLanguage, intputText, outputLanguage, translatedText):
    cursor = db.cursor()
    try:
        db.begin()
        cursor.execute(
            "INSERT INTO translation (user, translation_time, input_language, input_text, output_language, translated_text) \
             VALUES (%s, %s, %s, %s, %s, %s)",
            (user, time, inputLanguage, intputText, outputLanguage, translatedText))
        db.commit()
        return "success"
    except Exception as e:
        db.rollback()
        return "Error: " + str(e)


# 全履歴の呼び出し
def read_translation_all(user):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM translation WHERE user = %s", (user))
    history = cursor.fetchall()
    return history


# ハートマークの更新
def update_my_favorite(id, status):
    cursor = db.cursor()

    try:
        db.begin()
        if (status == 0):
            cursor.execute(
                "UPDATE translation SET my_favorite = 1 WHERE id = %s", (id))
        else:
            cursor.execute(
                "UPDATE translation SET my_favorite = 0 WHERE id = %s", (id))
        db.commit()
        return "success"
    except Exception as e:
        db.rollback()
        return "Error: " + str(e)


# ハートマークの呼び出し
def read_my_favorite(user):
    cursor = db.cursor()
    cursor.execute(
        "SELECT * FROM translation WHERE user = %s and my_favorite = 1", (user))
    history = cursor.fetchall()
    return history


# データの削除
def delete_data(id):
    cursor = db.cursor()
    try:
        db.begin()

        cursor.execute("DELETE FROM translation WHERE id = %s", (id))

        db.commit()
        return "success"
    except Exception as e:
        db.rollback()
        return "Error: " + str(e)


# 履歴の検索
def search(start_date, end_date, input_language, input_keyword, output_language, output_keyword):
    cursor = db.cursor()

    # 検索条件のリスト
    conditions = []
    # 引数
    params = []

    # 開始と終わりの日にち両方を選んだ場合
    # この日にちの間の履歴を検索する
    if start_date and end_date:
        conditions.append("DATE(translation_time) BETWEEN %s AND %s")
        params.extend([start_date, end_date])

    # 開始しか選んでない場合
    # この日にち以降すべての履歴を検索する
    if start_date and not end_date:
        conditions.append("translation_time >= %s")
        params.append(start_date + " 00:00:00")

    # 終わりしか選んでない場合
    # この日にち以前すべての履歴を検索する
    if end_date and not start_date:
        conditions.append("translation_time <= %s")
        params.append(end_date + " 23:59:59")

    # 入力言語
    if input_language:
        conditions.append("input_language = %s")
        params.append(input_language)

    # 入力文章のキーワード
    if input_keyword:
        conditions.append("input_text LIKE %s")
        params.append(f"%{input_keyword}%")

    # 出力言語
    if output_language:
        conditions.append("output_language = %s")
        params.append(output_language)

    # 結果のキーワード
    if output_keyword:
        conditions.append("translated_text LIKE %s")
        params.append(f"%{output_keyword}%")

    # sql文
    query = "SELECT * FROM translation"
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    print(query)
    # 検索のsql文を実行する
    cursor.execute(query, tuple(params))
    search_result = cursor.fetchall()
    return search_result


# 個人情報の呼び出し
def read_personal_info(user):
    cursor = db.cursor()
    cursor.execute(
        "SELECT username, email FROM users WHERE username = %s", (user))
    info = cursor.fetchall()
    return info


def info_update(user, email):
    cursor = db.cursor()
    try:
        db.begin()

        cursor.execute(
            "UPDATE users SET email = %s WHERE username = %s", (email, user))

        db.commit()
        return "success"
    except Exception as e:
        db.rollback()
        return "Error: " + str(e)


def pwd_update(user, new_pwd):
    cursor = db.cursor()
    try:
        db.begin()

        cursor.execute(
            "UPDATE users SET password = %s WHERE username = %s", (new_pwd, user))

        db.commit()
        return "success"
    except Exception as e:
        db.rollback()
        return "Error: " + str(e)
