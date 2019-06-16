import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import config

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################
url = config.url
#will need to create a config file for heroku database url
# app.config["SQLALCHEMY_DATABASE_URI"] = url

#create engine
engine = create_engine(url)

#helps with caching
# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = "0"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

df = pd.read_csv("Data/Combined_Data.csv")

df.to_sql(name="world_indices",con=engine, if_exists = 'replace', index_label='id')

with engine.connect() as con:
 con.execute('ALTER TABLE world_indices ADD PRIMARY KEY (id);')
# db = SQLAlchemy(app)
# db.init_app(app)

# df = pd.read_sql("SELECT * FROM world_indices", engine)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# # Save references to each table
World_Data = Base.classes.world_indices

#start session
session = Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("practice.html")


@app.route("/years")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    # stmt = db.session.query(world_indices).statement
    # df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (Years Data)
    return jsonify(list(df.columns)[3:])




if __name__ == "__main__":
    app.run(debug=True)