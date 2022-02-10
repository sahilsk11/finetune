import logging
import pandas as pd
from sqlalchemy import func, create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import sessionmaker

import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.db.models import User_Credentials, Base, Profile_Page, Posts, Likes, Topics, Comments
from src.config import postgres_config

logger = logging.getLogger(__name__)
conn_str = f"postgresql://{postgres_config['user']}:{postgres_config['password']}@{postgres_config['host']}/{postgres_config['database']}"
engine = create_engine(conn_str)
Session = sessionmaker(bind=engine)