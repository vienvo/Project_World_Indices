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
app.config["SQLALCHEMY_DATABASE_URI"] = url

#create engine
engine = create_engine(url)

#helps with caching
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = "0"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
db.init_app(app)

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
def years():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(World_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (Years Data)
    return jsonify(list(df.columns)[4:])

@app.route("/world_data")
def world_data():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(World_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    years_columns =[str(x) for x in (range(1960,2017))]

    new_table = pd.pivot_table(df, values=years_columns, index= ['CountryName'], columns=["Index"])
    return new_table.to_json(orient='records')



if __name__ == "__main__":
    app.run(debug=True)