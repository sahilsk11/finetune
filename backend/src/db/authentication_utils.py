import hashlib
import pandas as pd
import datetime as dt
import os
import sys
import re
import smtplib
from email.message import EmailMessage
from uuid import uuid4



from sqlalchemy import false
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.crud import update_table, fetch_rows, update_authentication_token, delete_rows, update_user_password, fetch_user_info, add_report 
from src.db.models import User_Credentials, Profile_Page, Posts, Likes

def hash_password(password):
    """
        param password: password to be encoded
        returns: the encoded function to be uploaded to database
    """
    #convert string to byte equivalent
    password = password.encode()
    #feed the byte format to hash function
    result = hashlib.sha256(password)
    #hexadecimal equivalent of encoded string
    result = result.hexdigest()

    return result

#check if email is valid
def emailIsValid(email):
    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w+$'
    if(re.search(regex,email)):
        return True
    else:
        return False


def passwordIsValid(password):
    if(len(password) >= 8):
        return True
    else:
        return False
    

def insert_user_credentials(first_name, last_name, phone_number, username, email, password):
    #check if email or usename is already present in the database
    df = fetch_rows(User_Credentials)
    email_df = df["email"]
    username_df=df["username"]
    phone_number_df = df["phone_number"]
    first_name_df = df["first_name"]
    last_name_df = df["last_name"]

    # Check If username already exists
    if username in username_df.values:
        return False

    #if email is already present, don't upload the info to table
    if email in email_df.values:
        return False

    # if email format is invalid, don't upload info
    if not emailIsValid(email):
        return "Invalid Email"
    
    if not passwordIsValid(password):
        return "Password needs to be equal to or greater than 8 characters"

    # else, hash the password, and append the credentials to the related table
    hashed_password = hash_password(password)

    # data = {"name": [name], 'surname': [surname], "email": [email], "password":[hashed_password]}
    data = {"username": [username], "first_name": first_name, "last_name": last_name, "phone_number": phone_number,
    "email": [email], "password":[hashed_password]}

    new_df = pd.DataFrame(data)

    update_table(new_df, User_Credentials)
    return True

#check the email and password of a user in the database
def check_login_credentials_email(email, password):
    df = fetch_rows(User_Credentials)
    dfemail = df["email"] #load the email values into dfemail

    hashed_password = hash_password(password) #hash the password that is inputted

    dfpass = df["password"] #load the password values into dfpass

    #check if the email and the password exist in the database
    if email in dfemail.values and ((hashed_password  in dfpass.values) or (password in dfpass.values)):
        #check if the corresponding email has the corresponding password
        for index, row in df.iterrows():
            if row['email'] == email:
                if row['password'] == password or hashed_password:
                    return True

    return False

#check the email and password of a user in the database
def check_login_credentials_phone_number(phone_number, password):
    df = fetch_rows(User_Credentials)
    df_phone_number = df["phone_number"] #load the email values into dfemail

    hashed_password = hash_password(password) #hash the password that is inputted

    dfpass = df["password"] #load the password values into dfpass

    #check if the email and the password exist in the database
    if phone_number in df_phone_number.values and ((hashed_password  in dfpass.values) or (password in dfpass.values)):
        #check if the corresponding email has the corresponding password
        for index, row in df.iterrows():
            if row['phone_number'] == phone_number:
                if row['password'] == password or hashed_password:
                    return True

    return False

def token_validation(username, auth_token):
    try:
        df = fetch_rows(User_Credentials)
        df = df.loc[df['username'] == username]
        auth_db = df.iloc[0]['auth_token']
    except Exception as inst:
        return False

    if (auth_token == auth_db):
        return True
    else:
        return False


def create_auth_token(username):
    #append username with datetime
    time = dt.datetime.utcnow().strftime("%m/%d/%Y, %H:%M:%S")

    auth_string = username + time
    #hash the resulting string
    encrypted_auth_string = hash_password(auth_string)

    #update the authentication token of user
    update_authentication_token(User_Credentials, username, encrypted_auth_string)

    #return the encrypted string
    return encrypted_auth_string


def reset_auth_token(username, auth_token):
    df = fetch_rows(User_Credentials)

    df = df.loc[df['username'] == username]
    auth_db = df.iloc[0]['auth_token']

    if (auth_token == auth_db):
        update_authentication_token(User_Credentials, username, "")
        return True
    else:
        return False

# Get username by email, this is used for login
def get_username(email):
    df= fetch_rows(User_Credentials)
    df=df.loc[df['email']== email]
    username=df.iloc[0]['username']
    return username

# Get email from phone number, this is used for generating tokens when logging in with phone number
def get_email(phone_number):
    df= fetch_rows(User_Credentials)
    df=df.loc[df['phone_number']== phone_number]
    email=df.iloc[0]['email']
    return email

# Get hashed password by email, this is used for password recovery
def get_password(email):
    df= fetch_rows(User_Credentials)
    df=df.loc[df['email']== email]
    if df.empty:
        return False
    password=df.iloc[0]['password']
    return password


def update_password(username,new_password):
    hashed_password = hash_password(new_password)
    update_user_password(User_Credentials, username, hashed_password)



# for this sprint, only deleting frm these 2 tables
def delete_user_information(username):
    delete_rows(User_Credentials, username)
    delete_rows(Profile_Page, username)

# Recover password by spending an email to the user with their hashed password
def recover_user_password(email):
    token = uuid4()
    msg = EmailMessage()
    msg.set_content('Your recovery token is ' + str(token) + '. Please use this in place of your password as a temporary password, and then reset your password through the settings page.')
    msg['Subject'] = 'Finetune - Password recovery'
    msg['From'] = 'finetuneproject@gmail.com'
    msg['To'] = email
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login('finetuneproject@gmail.com', 'cs407project135!')

    server.send_message(msg)
    server.quit()
    username = get_username(email)
    update_user_password(User_Credentials, username, token)
    print(token)
    return token

def search_for_user_util(username):
    df= fetch_rows(User_Credentials)
    for index, row in df.iterrows():
        if username not in row['username']:
            df = df.drop(index)

    if df is None or df.empty:
        return []
    return df.to_dict('records')

def report_user_util(user_to_report, user_who_reported, report_reason):
    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter and the user_to_follow parameter
    user_to_report_df = user_credentials_df.loc[user_credentials_df['username'] == user_to_report]
    # get the user's following list and user_tf's followers list
    print(user_to_report_df)
    user_reports = user_to_report_df['reports'].values[0]
    if user_reports is None:
        report_str = [user_who_reported + ', ' + report_reason]

        add_report(User_Credentials, report_str, user_to_report)
        return True
    else:      
        user_reports.append(user_who_reported + ', ' + report_reason)
        add_report(User_Credentials, user_reports, user_to_report)
        return True

def get_user_reports_util(username):
    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter and the user_to_follow parameter
    user_to_report_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    return user_to_report_df['reports'].values[0]

