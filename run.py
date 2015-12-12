# Run a test server.
from app import app
print('Magic happens at port 8080')
app.run(host='0.0.0.0', port=8080, debug=True)

