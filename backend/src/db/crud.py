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

def delete_rows(BaseClass, username):
    session = Session()
    session.query(BaseClass).filter(BaseClass.username == username).delete()
    session.commit()
    session.close()

#create_tables()


if __name__ == '__main__':
    pass