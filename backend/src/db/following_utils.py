import pandas as pd
import datetime as dt
import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import Notifications, User_Credentials, Profile_Page, Posts, Likes

from src.db.crud import (
    update_table, 
    fetch_rows, 
    fetch_post,
    update_user_genres,
    add_follower,
    add_following,
    fetch_liked_posts_by_user
)

from src.db.post_utils import (
    generate_notification
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

def follow_user_util(username, user_to_follow):

    generate_notification(user_to_follow, 'follow', username + ' followed you!')

    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter and the user_to_follow parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    user_tf_df = user_credentials_df.loc[user_credentials_df['username'] == user_to_follow]
    # get the user's following list and user_tf's followers list
    user_following = user_df['following'].values[0]
    user_tf_followers = user_tf_df['followers'].values[0]
    if user_following is None and user_tf_followers is None:
        follower_str = [username]
        following_str = [user_to_follow]

        add_follower(User_Credentials, follower_str, user_to_follow)
        add_following(User_Credentials, following_str, username)
        return True
    else:
        if (user_tf_followers is not None and username in user_tf_followers) or (user_following is not None and user_to_follow in user_following):
            return False
        else:
            if user_tf_followers is not None:
                user_tf_followers.append(username)
                follower_str = user_tf_followers
            else:
                follower_str = [username]
            if user_following is not None:
                user_following.append(user_to_follow)
                following_str = user_following
            else:
                following_str = [user_to_follow]

            add_follower(User_Credentials, follower_str, user_to_follow)
            add_following(User_Credentials, following_str, username)
            return True

def unfollow_user_util(username, user_to_unfollow):
    user_credentials_df = fetch_rows(User_Credentials)
    # get the row associated with the user parameter and the user_to_unfollow parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    user_tf_df = user_credentials_df.loc[user_credentials_df['username'] == user_to_unfollow]
    # get the user's following list and user_tf's followers list
    user_following = user_df['following'].values[0]
    user_tf_followers = user_tf_df['followers'].values[0]
    if user_following is None or user_tf_followers is None:
        return False
    else:
        if (user_tf_followers is not None and username not in user_tf_followers) or (user_following is not None and user_to_unfollow not in user_following):
            return False
        else:
            user_tf_followers.remove(username)
            follower_str = user_tf_followers


            user_following.remove(user_to_unfollow)
            following_str = user_following

            add_follower(User_Credentials, follower_str, user_to_unfollow)
            add_following(User_Credentials, following_str, username)
            return True

def get_user_follows_util(username):
    user_credentials_df = fetch_rows(User_Credentials)
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    return user_df['following'].values[0]

def get_user_followers_util(username):
    user_credentials_df = fetch_rows(User_Credentials)
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    return user_df['followers'].values[0]


def get_liked_posts_of_followed_users(username):
    user_credentials_df = fetch_rows(User_Credentials)

    # get the row associated with the user parameter
    user_df = user_credentials_df.loc[user_credentials_df['username'] == username]
    follower_list = user_df['following'].values[0]

    if not follower_list:
        return "The user is not following anyone"
  
    post_ids = []
    for follower in follower_list:
        post_id_df = fetch_liked_posts_by_user(follower)
        liked_post_df = post_id_df[post_id_df["liked"]==True]

        if not liked_post_df.empty:
            post_ids_of_user = liked_post_df['post_id'].values.tolist()
            post_ids += post_ids_of_user

    # remove duplicate ids
    clean_duplicate_ids = []
    for post_id in post_ids:
        if post_id not in clean_duplicate_ids:
            clean_duplicate_ids.append(post_id)
    
    # fetch posts by id
    final_post_df = []
    for post_id in clean_duplicate_ids:
        post_df = fetch_post(Posts, post_id).to_dict("records")
        final_post_df += post_df
    
    return final_post_df


follow_user_util('fgfg', 'aswin')





