import pandas as pd
import datetime as dt
import os
import sys
from flask import request, jsonify

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import User_Credentials, Profile_Page, Posts, Likes, Notifications
from src.db.crud import (
    update_table,
    fetch_rows,
    fetch_post,
    update_post_saved,
    delete_row_likes,
    update_post_likes,
    fetch_liked_posts_by_user,
    fetch_post_by_songname,
    fetch_posts_by_genre,
    fetch_user_info,
    fetch_user_post,
    fetch_genres_following,
    update_post_details,
    insert_row_posts,
    update_private_like_info,
    add_post_report,
    update_viewed_notif
)

#Might bhave trouble i naudio files - check
def create_post_details(username, song_title, description, image, genre, audio):

    users_follow_arr = []
    user_df = fetch_rows(User_Credentials)
    for index, row in user_df.iterrows():
        if genre in row['genres_following']:
            generate_notification(row['username'], 'new_song', 'Song ' + song_title + ' posted in your followed genre ' + genre )

    data = {
        "username": [username],
        "song_title": [song_title],
        "likes": 0,
        "dislikes":0,
        "description": [description],
        "image": [image],
        "genre": [genre],
        "audio": [audio],
        "date_created": dt.datetime.utcnow(),
    }

    new_df = pd.DataFrame(data)
    #insert_row_posts(username, song_title, 0,0, description, image, genre, audio, dt.datetime.utcnow())
    update_table(new_df, Posts)

def edit_post_details(username, song_title, description, image, genre):
    update_post_details(username, song_title, description, image, genre)

def get_post_by_id(post_id):
    return fetch_post(Posts, post_id).to_dict("records")


#Sprint 2 story 5: save a post, or unsave
def save_or_unsave_post(post_id, username):
    # get the post associated with the post id
    df = get_post_by_id(post_id)

    if df[0]['saved'] is None:
        df[0]['saved'] = []
        df[0]['saved'].append(username)

    # if the username is already bookmarked, remove the username, (the user wants to remove bookmark)
    elif username in df[0]['saved']:
        df[0]['saved'].remove(username)
    else:
        df[0]['saved'].append(username)

    update_post_saved(post_id, df[0]['saved'])

#Story 6, view saved posts
def get_saved_posts_by_user(username):
    df = fetch_rows(Posts)
    if df is None or df.empty:
        return []

    df = df.to_dict("records")
    filtered_dict = []

    for record in df:
        if record['saved'] is not None and username in record['saved']:
            filtered_dict.append(record)

    return filtered_dict


def check_repeated_vote(post_id, username, liked, disliked):
    # fetch likes in likes table with post id
    post_id_likes_df = fetch_post(Likes, post_id)

    # if there is no data with the post id return false
    if post_id_likes_df.empty:
        return False

    # filter to specified username
    post_id_likes_df = post_id_likes_df.loc[post_id_likes_df["username"] == username]

    # if there is no data about the post id with specified user return false
    if post_id_likes_df.empty:
        return False

    # if the user is trying to repeat same voting
    if liked and post_id_likes_df["liked"].bool():
        return True
    elif disliked and post_id_likes_df["disliked"].bool():
        return True

    # delete the row in likes
    delete_row_likes(Likes, post_id, username)

    post_df = fetch_post(Posts, post_id)
    likes = post_df.iloc[0]["likes"].item()
    dislikes = post_df.iloc[0]["dislikes"].item()

    if liked:
        dislikes -= 1
        update_post_likes(post_id, likes, dislikes)
    elif disliked:
        likes -= 1
        update_post_likes(post_id, likes, dislikes)

    return False


def vote_post_db(post_id, username, liked, disliked):
    if check_repeated_vote(post_id, username, liked, disliked):
        return

    data = {
        "post_id": post_id,
        "username": [username],
        "liked": liked,
        "disliked": disliked,
    }

    new_df = pd.DataFrame(data)

    update_table(new_df, Likes)

    post_df = fetch_post(Posts, post_id)
    likes = post_df.iloc[0]["likes"].item()
    dislikes = post_df.iloc[0]["dislikes"].item()

    if liked:
        likes += 1
    else:
        dislikes += 1

    update_post_likes(post_id, likes, dislikes)


def get_upvoted_posts_by_user(username):
    user_votes = fetch_liked_posts_by_user(username)

    if user_votes.empty:
        return []

    result = []

    upvotes = user_votes.loc[(user_votes['liked'] == True)]

    if upvotes.empty:
        return []

    post_ids = upvotes['post_id'].to_dict()

    for postid in post_ids:
        post_df = fetch_post(Posts, post_ids[postid]).to_dict("records")
        result += post_df

    return result


def get_top_trending_songs(number_of_songs):
    df = fetch_rows(Posts)
    
    if df is None or df.empty:
        return []

    sorted_df = df.sort_values(by=['likes'], ascending=False)
    number_to_sort = 0

    if number_of_songs >= len(df):
        number_to_sort = len(df)
    else:
        number_to_sort = number_of_songs

    result = sorted_df.head(number_to_sort).to_dict("records")
    return result


def lookup_song(song_name):
    df= fetch_rows(Posts)
    for index, row in df.iterrows():
        if song_name not in row['song_title']:
            df = df.drop(index)

    if df is None or df.empty:
        return []
    return df.to_dict('records')



def get_all_posts_with_genre(genre):
    df = fetch_posts_by_genre(genre)
    if df is None or df.empty:
        return []

    return df.to_dict("records")


def get_posts_for_feed(username):
    user_df = fetch_user_info(username)
    if user_df is None or user_df.empty:
        return []

    artists_following = user_df['following'].values[0]

    result = []
    own_posts = fetch_user_post(username)
    if own_posts is not None:
        result += own_posts.to_dict("records")

    #if the user is following anyone fetch records
    if artists_following:
        for user in artists_following:
            result += fetch_user_post(user).to_dict("records")


    genres_following = fetch_genres_following(username)
    genres_following = genres_following.iloc[0]['genres_following']

    #if the user is following any genre fetch genres
    if genres_following:
        #fetch posts associated with the genres
        for genre in genres_following:
            result += fetch_posts_by_genre(genre).to_dict("records")

    #convert to dataframe to easily drop duplicates from combined df
    result = pd.DataFrame(result).drop_duplicates(subset='date_created', keep='first')
    return result.to_dict('records')


def fetch_own_posts(username):
    df = fetch_user_post(username)
    if df is None or df.empty:
        return []

    return df.to_dict("records")


def fetch_user_genres(username):
    df = fetch_genres_following(username)
    if df is None or df.empty:
        return []

    return df.to_dict("records")


def private_like(username, post_id):
    try:
        likes_df = fetch_rows(Likes)

        # get the row associated with the user parameter
        user_liked_post_df = likes_df[ (likes_df['username'] == username) & (likes_df['post_id'] == post_id)]

        user_liked_post_df_private = user_liked_post_df['private'].values[0]

        if user_liked_post_df_private is None:
            user_liked_post_df_private = True

        else:
            # make it public
            if user_liked_post_df_private:
                user_liked_post_df_private = False

            # make it private
            else:
                user_liked_post_df_private = True


        # call database to make changes
        update_private_like_info(username, post_id, user_liked_post_df_private)

    except Exception as ex:
        return False

    return True


def fetch_private_likes(username):
    likes_df = fetch_liked_posts_by_user(username)
    liked_posts = likes_df[ (likes_df['liked'] == True) & (likes_df['private'] == True)]

    if liked_posts.empty:
        return []

    result = liked_posts['post_id'].tolist()

    return result

def report_post_util(post_to_report, user_who_reported, report_reason):
    post_df = fetch_rows(Posts)
    # get the row associated with the user parameter and the user_to_follow parameter
    post_to_report_df = post_df.loc[post_df['post_id'] == post_to_report]
    # get the user's following list and user_tf's followers list
    print(post_to_report)
    post_reports = post_to_report_df['reports'].values[0]
    if post_reports is None:
        report_str = [user_who_reported + ', ' + report_reason]

        add_post_report(Posts, report_str, post_to_report)
        return True
    else:
        post_reports.append(user_who_reported + ', ' + report_reason)
        add_post_report(Posts, post_reports, post_to_report)
        return True

def get_post_reports_util(post_id):
    post_df = fetch_rows(Posts)
    # get the row associated with the user parameter and the user_to_follow parameter
    post_to_report_df = post_df.loc[post_df['post_id'] == post_id]
    if post_to_report_df['reports'].values == None:
        return 0
    return post_to_report_df['reports'].values[0]

def generate_notification(username, notification_type, notification_content):
    data = {
        "username": [username],
        "notification_type": [notification_type],
        "notification_content": [notification_content],
        "date_created": [dt.datetime.utcnow()],
        "viewed": [False]
    }
    new_df = pd.DataFrame(data)

    print(new_df)

    update_table(new_df, Notifications)

def get_notifications(username):
    df= fetch_rows(Notifications)
    notif_df = df.loc[df['username'] == username]
    return notif_df.to_json(orient='records')

def view_notification_util(notif_id):
    update_viewed_notif(Notifications, notif_id)
    return True


