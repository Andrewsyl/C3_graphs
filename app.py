from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = '172.20.213.43'
MONGODB_PORT = 27080
DBS_NAME = 'ftrack'

FIELDS = {'episode': True, 'start_date': True, 'completed_date': True, 'completed_time_difference': True, 'shot': True,
          'user': True, 'completed_locked_difference': True, 'locked_schedule_date': True,
          'start_completed_difference': True, 'project': True}


@app.route('/animworkprint/mn107/112')
def one():
    return render_template('animworkprint/mn107/112.html')


@app.route('/animworkprint/mn107/113')
def two():
    return render_template('animworkprint/mn107/113.html')


@app.route('/animworkprint/mn107/114')
def three():
    return render_template('animworkprint/mn107/114.html')


@app.route('/animworkprint/mn107/115')
def four():
    return render_template('animworkprint/mn107/115.html')


@app.route('/animworkprint/mn107/116')
def five():
    return render_template('animworkprint/mn107/116.html')


@app.route('/animworkprint/mn107/117')
def six():
    return render_template('animworkprint/mn107/117.html')


@app.route('/animworkprint/mn107/118')
def seven():
    return render_template('animworkprint/mn107/118.html')


@app.route('/animworkprint/mn107/119')
def eight():
    return render_template('animworkprint/mn107/119.html')


@app.route('/animworkprint/mn107/120')
def nine():
    return render_template('animworkprint/mn107/120.html')


@app.route('/animworkprint/mn107/121')
def ten():
    return render_template('animworkprint/mn107/121.html')


@app.route('/animworkprint/mn107/122')
def eleven():
    return render_template('animworkprint/mn107/122.html')


@app.route('/animworkprint/mn107/123')
def twelve():
    return render_template('animworkprint/mn107/123.html')


@app.route('/mn107/retakesperep')
def retakesPerEp():
    return render_template('retakesPerEp.html')


@app.route('/mn107/retakesperuser')
def retakesPerUser():
    return render_template('retakesUserandEp.html')


@app.route("/ftrack/projects")
def donor_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    COLLECTION_NAME = 'AnimWorkprintComplete'
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects


@app.route("/ftrack/retakesperuser")
def mn107retakesperuser():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    COLLECTION_NAME = 'RetakesEpandUser'
    collection = connection[DBS_NAME][COLLECTION_NAME]
    FIELDS = {'retakes': True, 'episode': True}
    projects = collection.find({"project": 'MN107'})
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects


@app.route("/ftrack/mn107/retakes")
def mn107retakes():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    COLLECTION_NAME = 'RetakesPerEpisode'
    collection = connection[DBS_NAME][COLLECTION_NAME]
    FIELDS = {'retakes': True, 'episode': True}
    projects = collection.find({"project": 'MN107'})
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
