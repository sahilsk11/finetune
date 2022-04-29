import pandas as pd
import datetime as dt
import os
import sys

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
from src.db.crud import fetch_rows, fetch_comments_by_user, update_table, fetch_post
from src.db.models import Comments, Posts
from src.db.post_utils import generate_notification


def save_comment(username, post_id, comment):

    post_df = fetch_rows(Posts)
    post_user = post_df.loc[post_df['post_id'] == post_id]['username'].to_string()
    generate_notification(post_user[5:], 'comment', username + ' commented on your post!')

    # check for an empty comment
    if len(comment) == 0:
        return False

    # duplicate comments are not allowed
    user_df = fetch_comments_by_user(username, post_id)
    comment_copy = comment.lower()
    if not user_df.empty:
        user_df["comment"] = user_df["comment"].str.lower()
        if comment_copy in user_df["comment"].values:
            return False

    data = {
        "username": [username],
        "post_id": [post_id],
        "comment": [comment],
        "post_time": dt.datetime.utcnow(),
    }

    new_df = pd.DataFrame(data)
    update_table(new_df, Comments)
    return True


def get_commented_posts_by_username(username):
    df = fetch_rows(Comments).to_dict("records")

    # Make another arr to store the comments made by the user
    arr = []
    for record in df:
        if record["username"] == username:
            # print(record["username"])
            arr.append(record)

    # print(arr)
    if len(arr) == 0:
        return []

    result = []
    for record in arr:
        post_df = fetch_post(Posts, record["post_id"]).to_dict("records")
        result += post_df

    return result


def get_commented_posts_by_id(post_id):
    df = fetch_rows(Comments).to_dict("records")
    result = []
    for record in df:
        if record["post_id"] == int(post_id):
            result.append(record)

    return result
