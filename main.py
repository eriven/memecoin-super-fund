from flask import Flask, render_template, send_from_directory
import os
import json

app = Flask(__name__)

# Configure static files path
static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

@app.route('/')
def index():
    # Mock performance data for the chart
    performance_data = {
        'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        'values': [1000.0, 1500.0, 1200.0, 2000.0, 1800.0, 3000.0]
    }
    return render_template('index.html', chart_data=json.dumps(performance_data))

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

# For Vercel deployment
app = app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
