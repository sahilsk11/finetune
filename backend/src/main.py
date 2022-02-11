from db.authentication_utils import (
    insert_user_credentials,
    check_login_credentials,
    create_auth_token,
    reset_auth_token,
    token_validation,
    get_username,
)

from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template
import json

import os
import sys

sys.path.append(os.getcwd())

def make_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/sign_up", methods=["POST"])
    def create_account():
        username = request.headers.get("username")
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = insert_user_credentials(username, email, password)

        if status is False:
            return jsonify("Email or Username already exists!")
        elif status == "Invalid Email":
            return jsonify("Invalid Email!")

        auth_token = create_auth_token(username)
        # insert email and username to profile_table
        insert_profile_details(email, username)

        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/login", methods=["POST"])
    def check_login():
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = check_login_credentials(email, password)

        if status is False:
            return jsonify("Incorrect Password or Email!")

        # Get username based on the email
        username = get_username(email)

        # Create auth token based on username
        auth_token = create_auth_token(username)

        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/logout", methods=["POST"])
    def log_out():

        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        # reset authentication token associated with the username once user logs out
        try:
            if reset_auth_token(username, auth_token):
                return jsonify("success")
            else:
                return jsonify("failed")
        except Exception as e:
            print("logout exception")
            return jsonify("failed")

    return app