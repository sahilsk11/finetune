import pandas as pd
import datetime as dt
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import User_Credentials, Profile_Page, Posts, Likes

from src.db.crud import (
    update_table, 
    fetch_rows, 
    fetch_post,
    update_user_genres
)

def follow_genre(username, genre):
    user_credentials_df = fetch_rows(User_Credentials)

    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    # get the user's topics list
    user_genres = user_df['genres_following'].values[0]

    if user_genres is None:
            user_genres = [genre]
    else:
        if genre not in user_genres:
            user_genres.append(genre)
        else:
            return False
    
    update_user_genres(username, user_genres)
    return True

def unfollow_genre(username, genre):
    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    # get the user's topics list
    user_genres = user_df['genres_following'].values[0]

    if user_genres is None:
            return False
    else:
        if genre not in user_genres:
            return False
        else:
            user_genres.remove(genre)

    update_user_genres(username, user_genres)
    return True