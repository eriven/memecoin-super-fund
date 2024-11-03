from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Mock performance data for the chart
    performance_data = {
        'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        'values': [1000, 1500, 1200, 2000, 1800, 3000]
    }
    return render_template('index.html', performance_data=performance_data)
