from flask import Flask, render_template, send_from_directory, send_file
import os
import json
import mimetypes

app = Flask(__name__)

# Configure static files path and MIME types
static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')

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
    try:
        # Get file extension and MIME type
        _, ext = os.path.splitext(path)
        mime_type = mimetypes.types_map.get(ext, 'application/octet-stream')
        
        # Set cache control based on file type
        cache_control = 'public, max-age=86400' if ext == '.svg' else 'public, max-age=0, must-revalidate'
        
        response = send_from_directory('static', path, mimetype=mime_type)
        response.headers['Cache-Control'] = cache_control
        return response
    except Exception as e:
        print(f"Error serving static file {path}: {str(e)}")
        return f"Error serving static file: {path}", 404

# For Vercel deployment
app = app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
