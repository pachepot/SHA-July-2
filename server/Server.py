from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import mysql.connector
import bcrypt
import uuid
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

db = mysql.connector.connect(
    host="database-login.c98wygeiir6f.ap-northeast-2.rds.amazonaws.com",
    user="admin",
    password="kimmin0411!",
    database="database_login"
)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # 비밀번호 해싱
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cursor = db.cursor()
    cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
    db.commit()
    cursor.close()

    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if user:
        stored_password_hash = user['password']

        try:
            # 입력 비밀번호를 해싱된 비밀번호와 비교
            if bcrypt.checkpw(password.encode('utf-8'), stored_password_hash.encode('utf-8')):
                session_id = str(uuid.uuid4())
                cursor.execute("update users set session = %s where username = %s", (session_id, username))
                db.commit()

                user_info = {"username": username}

                resp = make_response(jsonify({'message': 'Login successful'}))
                resp.set_cookie(
                    'session',
                    json.dumps(user_info),
                    httponly=False,  # JavaScript에서 접근 가능
                    samesite='Lax',  # 또는 'None' (HTTPS를 사용해야 함)
                    secure=False,  # HTTPS를 사용하는 경우 True로 설정
                    path='/'  # 쿠키가 모든 경로에서 사용 가능하도록 설정
                )
                return resp
            else:
                return jsonify({"message": "Invalid username or password"}), 401
        except ValueError as e:
            # 해싱된 비밀번호가 올바르지 않을 때 발생하는 오류 처리
            return jsonify({"message": f"Error in password hash: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid username or password"}), 401


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)