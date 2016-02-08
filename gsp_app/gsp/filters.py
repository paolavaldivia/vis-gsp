import numpy as np
import networkx as nx

def g(x):
    x = np.array(x)
    y = np.zeros(x.shape)

    x1    = 1
    x2    = 2
    alpha = 2
    beta  = 2

    r1 = x < x1
    r2 = (x1 <= x) & (x <= x2)
    r3 = x> x2


    y[r1] =  (x1 ** (-alpha)) * (x[r1] ** alpha)
    y[r2] = -5 + 11 * x[r2] - 6 * x[r2] * x[r2] + x[r2]**3
    y[r3] = (x2 ** beta) * (x[r3] ** (-beta))


    return y

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

def getFilter(D, t):
    h = 1.0/(1.0 + t*D)
    return h

def getEnhancement(D):
    s = D[-1]/3.0
    h = g(s * D) + 1;
    return h

def filterFunction(U, h, f):
    H = np.dot(U, (h*U).T)
    f_s = np.dot(H, f.T)
    return f_s.T

def meanFilter(G,f):
    f_f = np.zeros(f.shape)
    for n in G.nodes():
        x = nx.neighbors(G,n)
        x = np.append(x, n)
        f_f[:,n] = np.mean(f[:,x])
    return f_f

def medianFilter(G,f):
    f_f = np.zeros(f.shape)
    for n in G.nodes():
        x = nx.neighbors(G,n)
        x = np.append(x, n)
        f_f[:,n] = np.median(f[:,x])
    return f_f

