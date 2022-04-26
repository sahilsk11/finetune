import pandas as pd
import datetime as dt
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import update_table, fetch_rows, update_authentication_token, update_user_profile, update_user_credentials, update_profile_photo, change_username, update_user_email, update_phone_number, change_spotify, update_quiz_information, update_user_blocklist

from src.db.models import User_Credentials, Profile_Page


# def insert_profile_details(email, name, surname):
def insert_profile_details(email, username, phone_number):
    data = {"email": [email], "username": [username], "phone_number": [phone_number]}

    new_df = pd.DataFrame(data)
    update_table(new_df,Profile_Page)


# def get_profile_details(email):
def get_profile_details(username):
    """
        param email: the email associated with the user
        returns: name, surname, email, phone number, age, and about info of the user
    """
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_credentials_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the required parameters from the row.

        email=user_credentials_df.iloc[0]['email']

        # fetch data in the profile page table
        profile_page_df = fetch_rows(Profile_Page)

        # get the row associated with the email parameter
        profile_page_df = profile_page_df.loc[profile_page_df['username'] == username]

        #get the required parameters
        phone_number = profile_page_df.iloc[0]['phone_number']
        age = profile_page_df.iloc[0]['age']
        about = profile_page_df.iloc[0]['about']
        spotify = profile_page_df.iloc[0]['spotify']

        image=profile_page_df.iloc[0]['image']
    except Exception as inst:
        return {"error": "can not get profile"}

    return {"email": email, "username": username, "phone_number": phone_number, "age": age, "about": about, "image": image, "spotify": spotify}


def update_profile_details(username, email, phone_number, age, about):
    """
        param email: String, email associated with user
        param phone_number: String, phone number associated with user
        param age: String, age associated with user
        param about: String, description associated with user
    """
    # Check if email already exists in the database and it is not the user's
    df = fetch_rows(User_Credentials)
    email_df = df["email"]
    user_email=df.loc[df['username']==username].iloc[0]["email"]

    if email in email_df.values and email!=user_email:
        return False

    update_user_profile(Profile_Page, username, email, phone_number, age, about)
    update_user_credentials(User_Credentials, username, email)

    return True

# Update user's profile photo
def update_profile_image(username, image):
    update_profile_photo(Profile_Page, username, image)
    return True

# Update username
def update_username(old_username, new_username):
    change_username(Profile_Page, old_username, new_username)
    change_username(User_Credentials, old_username, new_username)
    return True

#update_phone
def update_user_phone_number(username, phone_number):
    update_phone_number(Profile_Page, username, phone_number)
    update_phone_number(User_Credentials, username, phone_number)
    return True


def update_email(username, email):
    update_user_email(User_Credentials, username, email)
    update_user_email(Profile_Page, username, email)
    return True

def update_user_spotify(username, spotify):
    change_spotify(Profile_Page, username, spotify)
    return True

def update_quiz_info(username, arr):
    genres_arr_given = ['house', 'techno', 'pop', 'alternative rock', 'rnb', 'trap', 'hiphop', 'deep house', 'melodic techno', 'progressive house'] 
    genres_arr_solved = []
    for index, element in enumerate(arr):
        if element == 'true':
            genres_arr_solved.append(genres_arr_given[index])

    update_quiz_information(User_Credentials, username, genres_arr_solved)
    return True


def block_or_unblock_user(username, blocked_user):
    try:
        # fetch data in user credentials
        user_credentials_df = fetch_rows(User_Credentials)

        # get the row associated with the user parameter
        user_df = user_credentials_df.loc[user_credentials_df['username'] == username]

        # get the user's blocked list
        user_blocked_list = user_df['blocked'].values[0]

        # add accordingly
        if user_blocked_list is None:
            user_blocked_list = [blocked_user]
        else:
            if blocked_user not in user_blocked_list:
                user_blocked_list.append(blocked_user)
            else:
                #unblock
                user_blocked_list.remove(blocked_user)

        # call database to make changes
        update_user_blocklist(username, user_blocked_list)

    except Exception as ex:
        return False

    return True