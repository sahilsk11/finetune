from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime as dt
from sqlalchemy import(
    Column,
    Boolean,
    String,
    Integer,
    Float,
    DateTime,
    JSON,
    ARRAY,
    ForeignKey
)

Base = declarative_base()

class User_Credentials(Base):
    __tablename__ = "user_credentials"
    username = Column (String, primary_key=True ,nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    password = Column(String, nullable=False)
    auth_token = Column(String, nullable=True)
    followers = Column(ARRAY(String), nullable=True)
    following = Column(ARRAY(String), nullable=True)
    genres_following = Column(ARRAY(String), nullable=True)

class Profile_Page(Base):
    __tablename__ = "profile_page"
    username = Column(String, primary_key=True, nullable=False)
    email = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    age = Column(String, nullable=True)
    about = Column(String, nullable=True)
    image = Column(String, nullable=True)
    spotify = Column(String, nullable=True)

class Posts(Base):
    __tablename__ = "posts"
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    song_title = Column(String, nullable=False)
    likes = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    audio = Column(String, nullable=False)
    date_created = Column(String, nullable=True)
    
class Likes(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    liked = Column(Boolean, nullable=True)

class Comments(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)
    post_id = Column(Integer, nullable=False)
    comment = Column(String, nullable=False)
    post_time = Column(String, nullable=True)


if __name__ == "__main__":
    pass