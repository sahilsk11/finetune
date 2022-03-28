import logging
import pandas as pd
from sqlalchemy import func, create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import User_Credentials, Base, Profile_Page, Posts, Likes, Comments
from src.config import postgres_config

logger = logging.getLogger(__name__)
conn_str = f"postgresql://{postgres_config['user']}:{postgres_config['password']}@{postgres_config['host']}/{postgres_config['database']}"
engine = create_engine(conn_str)
Session = sessionmaker(bind=engine)

def create_tables():
    logger.info("Creating the database if it does not already exist")
    Base.metadata.create_all(bind=engine)

def fetch_rows(BaseClass):
    """
    :param BaseClass: Base child-class object from /src/db/models.py
    :returns: pandas.DataFrame
    """
    session = Session()

    try:
        result = session.query(BaseClass)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None

def update_table(new_df, BaseClass):
    """"
    :param new_df: pandas.DataFrame containing rows to be loaded into Postgres
    :param BaseClass: Base child-class (sqlalchemy model)
    """""

    session = Session()
    session.bulk_insert_mappings(
        BaseClass,
        new_df.to_dict(orient="records"))
    session.commit()
    session.close()


def insert_row_posts(username, song_title, likes, dislikes, description, image, genre, audio, date_created):
    session = Session()
    new_post = Posts(username= username, song_title = song_title, likes = likes, 
                    dislikes = dislikes, description = description, image = image, genre = genre, audio = audio, date_created = date_created)
    session.add(new_post)
    session.commit()
    session.close()


def update_authentication_token(BaseClass, username, token):
    """
    :param BaseClass: Base child-class (sqlalchemy model)
    :param email: Email whose authentication token will be updated
    :param token: token assigned to user in each login
    """
    session = Session()
    session.query(BaseClass).filter(BaseClass.username == username).update({BaseClass.auth_token: token})
    session.commit()
    session.close()


# Update user profile info including email, phone_number, age, about
def update_user_profile(BaseClass, username, email, phone_number, age, about):
    """
    :param BaseClass: Base child-class (sqlalchemy model)
    :param email: Email whose authentication token will be updated
    :param token: token assigned to user in each login
    """
    session = Session()
    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.email: email,
            BaseClass.phone_number: phone_number,
            BaseClass.age: age,
            BaseClass.about: about
        }
    )
    session.commit()
    session.close()

def update_profile_photo(BaseClass, username, image):
    session = Session()
    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
           BaseClass.image: image
        }
    )
    session.commit()
    session.close()

# Update user email in credentials
def update_user_credentials(BaseClass, username, email):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.email: email,

        }
    )
    session.commit()
    session.close()

def update_user_password(BaseClass, username, password):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.password: password,

        }
    )
    session.commit()
    session.close()


def update_user_email(BaseClass, username, email):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.email: email,

        }
    )
    session.commit()
    session.close()

def update_phone_number(BaseClass, username, phone_number):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.phone_number: phone_number,

        }
    )
    session.commit()
    session.close()

def change_username(BaseClass, old_username, new_username):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == old_username).update(
        {
            BaseClass.username: new_username,

        }
    )
    session.commit()
    session.close()

# Update user's spotify link
def change_spotify(BaseClass, username, spotify):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.spotify: spotify,

        }
    )
    session.commit()
    session.close()

def delete_rows(BaseClass, username):
    session = Session()
    session.query(BaseClass).filter(BaseClass.username == username).delete()
    session.commit()
    session.close()


def fetch_post(BaseClass, post_id):
    session = Session()

    try:
        result = session.query(BaseClass).filter(BaseClass.post_id == post_id)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None


def update_post_saved(post_id, saved_users):
    session = Session()
    session.query(Posts).filter(Posts.post_id == post_id).update(
            {
            Posts.saved: saved_users
            }
    )
    session.commit()
    session.close()


def delete_row_likes(BaseClass, post_id, username):
    session = Session()
    session.query(BaseClass).filter(BaseClass.post_id == post_id).filter(BaseClass.username == username).delete()
    session.commit()
    session.close()


# Update post likes and dislikes
def update_post_likes(post_id, like, dislike):
    session = Session()

    session.query(Posts).filter(Posts.post_id == post_id).update(
        {
            Posts.likes: like,
            Posts.dislikes: dislike

        }
    )
    session.commit()
    session.close()

# fetches liked posts by user
def fetch_liked_posts_by_user(username):
    session = Session()

    try:
        result = session.query(Likes).filter(Likes.username == username)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None

def fetch_post_by_songname(song_name):
    session = Session()

    try:
        result = session.query(Posts).filter(Posts.song_title == song_name)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None


def fetch_posts_by_genre(genre):
    session = Session()

    try:
        result = session.query(Posts).filter(Posts.genre == genre)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None


def update_user_genres(username, genres):
    session = Session()
    session.query(User_Credentials).filter(User_Credentials.username == username).update(
            {
            User_Credentials.genres_following: genres
            }
    )
    session.commit()
    session.close()


def fetch_user_info(username):
    session = Session()

    try:
        result = session.query(User_Credentials).filter(User_Credentials.username == username)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None


def fetch_user_post(username):
    session = Session()

    try:
        result = session.query(Posts).filter(Posts.username == username)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None

def fetch_genres_following(username):
    session = Session()

    try:
        result = session.query(User_Credentials.genres_following).filter(User_Credentials.username == username)

    finally:
        session.close()

    if result is not None:
        df = pd.read_sql(result.statement, result.session.bind)
        return df

    else:
        return None

def update_post_details(username, song_title, description, image, genre):
    session = Session()

    session.query(Posts).filter(Posts.username == username).filter(Posts.song_title == song_title).update(
        {
            Posts.description: description,
            Posts.image: image,
            Posts.genre: genre
        }
    )
    session.commit()
    session.close()

def update_quiz_information(BaseClass, username, genres_str):
    session = Session()

    session.query(BaseClass).filter(BaseClass.username == username).update(
        {
            BaseClass.genres_following: genres_str,

        }
    )
    session.commit()
    session.close()


create_tables()


if __name__ == '__main__':
    pass