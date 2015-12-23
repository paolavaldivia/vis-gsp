import networkx as nx
from numpy.random import rand
from numpy import genfromtxt
from numpy import newaxis
from numpy import squeeze
import json
import os


def loadGraph(fileName):
    G  = nx.read_adjlist( fileName + '.adjlist', nodetype=int)
    xy  = genfromtxt( fileName + '.xy', delimiter=' ')
    return G, xy

def loadGraphEig(fileName):
    D = None
    U = None
    if os.path.isfile(fileName+'.U'):
        U = genfromtxt(fileName + '.U', delimiter=' ')
        D = squeeze( genfromtxt(fileName + '.D', delimiter=' '))
    return D, U

def dumpGraph(G, xy):
    return json.dumps({"nodes": [{"x": xy[i][0], "y": xy[i][1]} for i in range(xy.shape[0]) ],
                       "links": [{"source": l[0], "target": l[1]} for l in G.edges_iter() ]})

def randFunGraph():
    fp = rand(1,1200)
    return fp

def testFunGraph(fileName):
    fp = genfromtxt(fileName + '.val', delimiter=' ')
    return fp[10,:][newaxis]

def dumpFunGraph(fp):
    return json.dumps({'data': fp.tolist()[0]})

def dumpFilter(D, h):
    return json.dumps({'xvalues': D.tolist(), 'yvalues': h.tolist()})
