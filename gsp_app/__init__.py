# Import flask and template operators
from flask import Flask
from flask import render_template

import os

import gsp_app.gsp
from gsp_app.gsp import *

app = Flask(__name__)
app.config.from_object('config')


@app.route("/")
def index():
    return render_template("index.html", test='Pao')

@app.route("/data/graph/<path:fileName>")
def loadDumpGraph(fileName):
    fileName = os.path.join(app.config['DATA_DIR'], fileName, fileName)
    G, xy = gsp_app.loadGraph(fileName)
    D, U = gsp_app.loadGraphEig(fileName)
    if D is None:
        print("calculating")
        D, U = gsp_app.eig(G)
        np.savetxt(fileName + '.U', U)
        np.savetxt(fileName + '.D', D)
    app.G = G
    app.D = D
    app.U = U
    return gsp_app.dumpGraph(G, xy)

@app.route("/data/randomFunction")
def loadRandFunction():
    app.fun = gsp_app.randFunGraph()
    return gsp_app.dumpFunGraph(app.fun)

@app.route("/data/testFunction")
def loadTestFunction():
    name = 'DS'
    fileName =  os.path.join(app.config['DATA_DIR'], name, name)
    app.fun = gsp_app.testFunGraph(fileName)
    return gsp_app.dumpFunGraph(app.fun)


@app.route("/smooth/<float:t>", methods=['GET'])
def updateFilter(t=0.5):
    app.t = t;
    app.filter = gsp_app.getSmoothFilter(app.D, app.t)
    return gsp_app.dumpFilter(app.D, app.filter)

@app.route("/getResult", methods=['GET'])
def getResult():
    smoothed = gsp_app.smoothFunction(app.U, app.filter, app.fun)
    return gsp_app.dumpFunGraph(smoothed)
