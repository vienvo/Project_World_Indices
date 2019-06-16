import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

#will need to create a config file for heroku database url
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/worldData.sqlite"

#create engine
engine = create_engine('sqlite:///db/worldData.sqlite')

#helps with caching
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = "0"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
World_Data = Base.classes.worldData

#start session
session = Session(engine)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("practice.html")


@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(World_Data).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (Years Data)
    return jsonify(list(df.columns)[3:])




if __name__ == "__main__":
    app.run(debug=True)