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
    email = Column(String, nullable=False)
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

if __name__ == "__main__":
    pass