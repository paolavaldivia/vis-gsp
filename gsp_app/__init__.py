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
def updateSmooth(t=0.5):
    app.t = t;
    app.filter = gsp_app.getSmoothFilter(app.D, app.t)
    app.spectral = True
    return gsp_app.dumpFilter(app.D, app.filter)

@app.route("/filter/<float:t>", methods=['GET'])
def updateFilter(t=0.5):
    app.t = t;
    app.filter = gsp_app.getFilter(app.D, app.t)
    app.spectral = True
    return gsp_app.dumpFilter(app.D, app.filter)


@app.route("/mean", methods=['GET'])
def mean():
    app.filtered = gsp_app.meanFilter(app.G, app.fun)
    app.spectral = False
    return 'mean'

@app.route("/median", methods=['GET'])
def median():
    app.filtered = gsp_app.medianFilter(app.G, app.fun)
    app.spectral = False
    return 'median'

@app.route("/enhancement", methods=['GET'])
def updateEnhancement():
    app.filter = gsp_app.getEnhancement(app.D)
    return gsp_app.dumpFilter(app.D, app.filter)

@app.route("/getResult", methods=['GET'])
def getResult():
    if (app.spectral):
        app.filtered = gsp_app.filterFunction(app.U, app.filter, app.fun)
    return gsp_app.dumpFunGraph(app.filtered)
