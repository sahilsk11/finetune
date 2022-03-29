from db.authentication_utils import (
    insert_user_credentials,
    check_login_credentials_email,
    create_auth_token,
    reset_auth_token,
    token_validation,
    get_username,
    get_email,
    check_login_credentials_phone_number,
    delete_user_information,
    update_password,
    emailIsValid,
    recover_user_password,
    search_for_user
)

from db.profile_page_utils import (
    get_profile_details,
    update_profile_details,
    insert_profile_details,
    update_profile_image,
    update_user_spotify,
    update_username,
    update_email,
    update_user_phone_number,
    update_quiz_info
)

from db.post_utils import (
    save_or_unsave_post,
    get_saved_posts_by_user,
    vote_post_db,
    get_upvoted_posts_by_user,
    get_top_trending_songs,
    lookup_song,
    get_all_posts_with_genre,
    get_posts_for_feed,
    create_post_details,
    edit_post_details,
    fetch_own_posts
)

from db.following_utils import (
    follow_genre,
    unfollow_genre,
    follow_user_util
)

from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from flask import render_template, send_file
import json

import os
import sys

from werkzeug.utils import secure_filename

sys.path.append(os.getcwd())

def make_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/sign_up", methods=["POST"])
    def create_account():
        first_name = request.headers.get("first_name")
        last_name = request.headers.get("last_name")
        phone_number = request.headers.get("phone_number")
        username = request.headers.get("username")
        email = request.headers.get("email")
        password = request.headers.get("password")

        status = insert_user_credentials(first_name, last_name, phone_number, username, email, password)

        if status is False:
            return jsonify("Email or Username already exists!")
        elif status == "Invalid Email":
            return jsonify("Invalid Email!")
        elif status == "Password needs to be equal to or greater than 8 characters":
            return jsonify("Password needs to be equal to or greater than 8 characters")

        auth_token = create_auth_token(username)
        # insert email and username to profile_table
        insert_profile_details(email, username, phone_number)

        # return username and token
        return jsonify(username=username, auth_token=auth_token)

    @app.route("/login", methods=["POST"])
    def check_login():
        phone_number = request.headers.get("phone_number")
        email = request.headers.get("email")
        password = request.headers.get("password")

        if emailIsValid(email):
            status = check_login_credentials_email(email, password)
        else:
            status = check_login_credentials_phone_number(email,password)
            email = get_email(email)

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


    @app.route("/get_profile_page", methods=["POST"])
    def get_user_profile():
        # This is the user's username
        username = request.headers.get("username")
        # This is the username of the profile we want to get
        profile_user = request.headers.get("profile_user")
        print("profile_user:" + profile_user)
        # This is auth token front frontedn
        auth_token = request.headers.get("auth_token")

        # Check if the user is logged in, check the auth token
        if username != "null":
            # verify the token with username
            status = token_validation(username, auth_token)
            # print(status)
            if status:
                profile_details = get_profile_details(profile_user)
                return jsonify(profile_details)
            else:
                return jsonify("failed token validation")
        # If the user is not logged in and it requests other user's profile
        else:
            profile_details = get_profile_details(profile_user)
            return jsonify(profile_details)

    @app.route("/update_profile_page", methods=["POST"])
    def update_profile():
        email = request.headers.get("email")
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        phone_number = request.headers.get("tel")
        age = request.headers.get("age")
        about = request.headers.get("about")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if status:
            # update database with the related fields.
            update_status = update_profile_details(
                username, email, phone_number, age, about
            )
            if update_status == False:
                return jsonify("This email is already used!")

            return jsonify("success")

        else:
            return jsonify("failed")

    # Update user's profile image
    @app.route("/update_profile_photo/", methods=["POST"])
    def update_profile_photo():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        img_file = None

        if 'image' in request.files and request.files['image'].filename != '':
            img_file = request.files['image']

        status = token_validation(username, auth_token)
        if status:
            # this util perform sever-side validation to ensure
            # the user does not pass a malicious file to the backend
            filename = secure_filename(img_file.filename)

            update_profile_image(username, filename)

             # prepend the path to save to the static directory
            filename = "../static/"+filename
            img_file.save(filename)

            return jsonify("success")

        else:
            print("failed validation")
            return jsonify("failed")

    @app.route("/image/<filename>", methods=["GET"])
    def get_image(filename):
        print(filename)
        return send_file("../static/" + filename)

    @app.route("/change_password", methods=["POST"])
    def alter_password():
        username = request.headers.get("username")
        new_password = request.headers.get("new_password")
        auth_token = request.headers.get("auth_token")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if status:
            update_password(username, new_password)
            return jsonify("success")
        else:
            return jsonify("failed")

    @app.route("/change_username", methods=["POST"])
    def alter_username():
        old_username = request.headers.get("old_username")
        new_username = request.headers.get("new_username")
        auth_token = request.headers.get("auth_token")

        # check if the authentication token is valid
        status = token_validation(old_username, auth_token)

        if status:
            update_username(old_username, new_username)
            return jsonify("success")
        else:
            return jsonify("failed")


    @app.route("/change_email", methods=["POST"])
    def alter_email():
        username = request.headers.get("username")
        email = request.headers.get("email")
        auth_token = request.headers.get("auth_token")

        status = token_validation(username, auth_token)
        if status and emailIsValid(email):
                update_email(username, email)
                return jsonify("success")

        return jsonify("failed")


    @app.route("/change_phone", methods=["POST"])
    def alter_phone_number():
        username = request.headers.get("username")
        phone_number = request.headers.get("phone_number")
        auth_token = request.headers.get("auth_token")

        status = token_validation(username, auth_token)
        if status:
            update_user_phone_number(username, phone_number)
            return jsonify("success")

        return jsonify("failed")


    @app.route("/delete_user", methods=["POST"])
    def delete_user():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if status:
            delete_user_information(username)
            return jsonify("success")
        else:
            return jsonify("failed")

    @app.route("/recoverpassword", methods=["POST"])
    def recover_password():
        email = request.headers.get("email")
        password = recover_user_password(email)
        if password:
            return jsonify("success")
        else:
            return jsonify("failed")

    @app.route("/change_spotify", methods=["POST"])
    def alter_spotify():
        username = request.headers.get("username")
        spotify = request.headers.get("spotify")
        auth_token = request.headers.get("auth_token")

        status = token_validation(username, auth_token)
        if status:
            update_user_spotify(username, spotify)
            return jsonify("success")

        return jsonify("failed")


    ##### SPRINT 2
    # bookmark a post and specify which post is saved by the post_id, and the user who saved the post by username
    @app.route("/bookmark_post_user", methods=["POST"])
    def bookmark_post():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        post_id = request.headers.get("post_id")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        save_or_unsave_post(post_id, username)
        return jsonify("success")


    # gets all the posts that are saved by a user
    @app.route("/all_saved_posts", methods=["GET"])
    def get_bookmarked_posts():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        profile_user = request.headers.get("profile_user")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        result = get_saved_posts_by_user(profile_user)
        # returns an empty list or list of dictionaries including posts bookmarked by user
        return jsonify(result)


    #like or dislike a post
    @app.route("/vote", methods=["POST"])
    def vote_post():
        auth_token = request.headers.get("auth_token")
        # check if the authentication token is valid
        post_id = request.headers.get("post_id")
        username = request.headers.get("username")
        liked = request.headers.get("liked") == "true"
        disliked = request.headers.get("disliked") == "true"

        status = token_validation(username, auth_token)
        if not status:
            return jsonify({"message": "failed token verification"})

        if (liked and disliked): # or (not liked and not disliked):
            return jsonify({"message": "failed bool verification"})

        vote_post_db(post_id, username, liked, disliked)
        return jsonify("success")


    #get liked posts
    @app.route("/get_liked_posts_by_user", methods=["POST"])
    def get_liked_posts_by_user():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        # returns an empty list or list of dictionaries including posts liked by user
        return jsonify(get_upvoted_posts_by_user(username))


    #trending songs, limited to top 3 for now
    @app.route("/get_trending_songs", methods=["POST"])
    def get_trending_songs():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify({"message": "failed token verification"})

        return jsonify(get_top_trending_songs())


    @app.route("/search_song", methods=["POST"])
    def lookup_for_songs():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        song_name = request.headers.get("song_name")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        #returns an empty list or list of post details inclcudingn songs
        return jsonify(lookup_song(song_name))

    # for the quiz at the beginning
    @app.route("/genres", methods=["POST"])
    def send_genres():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        genres = ["house", "techno", "pop", "rock", "alternative rock", "rnb", "trap", "hiphop",
        "deep house", "melodic techno", "progressive house"]

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        return jsonify(genres)

    @app.route("/songs_by_genre", methods=["POST"])
    def send_songs_by_genre():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        genre = request.headers.get("genre")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")

        #returns an empty list or list of post details inclcudingn songs
        return jsonify(get_all_posts_with_genre(genre))

    @app.route("/follow_genre", methods=["POST"])
    def genre_follow():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        genre = request.headers.get("genre")

        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")
        else:
            status = follow_genre(username,genre)

        if status:
            return jsonify("success")

        return jsonify("failed")


    @app.route("/unfollow_genre", methods=["POST"])
    def genre_unfollow():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        genre = request.headers.get("genre")
        status = token_validation(username, auth_token)

        if not status:
            return jsonify("failed")
        else:
            status = unfollow_genre(username, genre)

        if status:
            return jsonify("success")
        return jsonify("failed")


    @app.route("/view_feed", methods=["GET"])
    def user_view_feed():
        #view posts of artists and genres you follow
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        status = token_validation(username, auth_token)

        if not status:
            return jsonify("failed")

        # returns an empty list or list of dictionaries including all post details
        return jsonify(get_posts_for_feed(username))

    #create post
    @app.route("/create_post", methods=["POST"])
    def insert_new_post():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        song_title = request.headers.get("song_title")
        description = request.headers.get("description")
        genre = request.headers.get("genre")

        if 'image' in request.files and request.files['image'].filename != '':
            img_file = request.files['image']
            image_filename = secure_filename(img_file.filename)

             # prepend the path to save to the static directory
            updated_filename = "../static/"+image_filename
            img_file.save(updated_filename)

        else:
            image_filename = ""

        if 'audio' in request.files and request.files['audio'].filename != '':
            audio_file = request.files['audio']
            audio_filename = secure_filename(audio_file.filename)

            # prepend the path to save to the static directory
            final_path = "../static/"+audio_filename
            audio_file.save(final_path)
        else:
            audio_filename = ""

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")
        else:
            create_post_details(username, song_title, description, image_filename, genre, audio_filename)

        return jsonify("success")


    #edit post: lets make Song title and audio file unchangeable, so that we can idenitfy the post
    # artist can change decription, image, etc , or just create another post for diff title and audio
    @app.route("/edit_post", methods=["POST"])
    def edit_existing_post():
        username = request.headers.get("username")
        auth_token = request.headers.get("auth_token")
        song_title = request.headers.get("song_title")
        new_description = request.headers.get("description")

        new_genre = request.headers.get("genre")

        if 'image' in request.files and request.files['image'].filename != '':
            img_file = request.files['image']
            image_filename = secure_filename(img_file.filename)
             # prepend the path to save to the static directory
            updated_filename = "../static/"+image_filename
            img_file.save(updated_filename)
        else:
            image_filename = ""

        # check if the authentication token is valid
        status = token_validation(username, auth_token)
        if not status:
            return jsonify("failed")
        else:
            edit_post_details(username, song_title, new_description, image_filename, new_genre)

        return jsonify("success")


    #show user's own posts
    @app.route("/user_posts", methods=["GET"])
    def show_user_posts():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")


        return jsonify(fetch_own_posts(username))

    #store quiz results in the database
    @app.route("/store_quiz", methods=["POST"])
    def store_quiz():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        status = token_validation(username, auth_token)

        if not status:
            return jsonify({"message":"failed token verification"})

        arr = []
        for i in range(1, 11):
            arr.append(request.headers.get("checked" + str(i)))
        return jsonify(update_quiz_info(username, arr))

    @app.route("/search_for_user", methods=["GET"])
    def search_for_user():
        #view posts of artists and genres you follow
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        status = token_validation(username, auth_token)

        if not status:
            return jsonify({"message":"failed token verification"})

        return jsonify(search_for_user(username))

    @app.route("/follow_user", methods=["POST"])
    def follow_user():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        user_to_follow = request.headers.get("user_to_follow")
        status = token_validation(username, auth_token)

        if not status:
            return jsonify({"message":"failed token verification"})

        return jsonify(follow_user_util(username, user_to_follow))

    @app.route("/unfollow_user", methods=["POST"])
    def unfollow_user():
        auth_token = request.headers.get("auth_token")
        username = request.headers.get("username")
        user_to_unfollow = request.headers.get("user_to_follow")
        status = token_validation(username, auth_token)

        if not status:
            return jsonify({"message":"failed token verification"})

        return jsonify(unfollow_user_util(username, user_to_unfollow))




    return app
