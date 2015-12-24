import numpy as np
import networkx as nx

def eig(G):
    L = nx.laplacian_matrix(G)
    D, U = np.linalg.eig(L.toarray())
    idx = D.argsort()
    D = D[idx]
    U = U[:,idx]
    return D, U

def getSmoothFilter(D, t):
    h = np.exp(-t*D)
    return h

def smoothFunction(U, h, f):
    H = np.dot(U, (h*U).T)
    f_s = np.dot(H, f.T)
    return f_s.T
