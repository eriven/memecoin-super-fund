from flask import Flask, render_template, jsonify
import json
import requests
from datetime import datetime
import time

app = Flask(__name__)

# Token list to track (popular meme coins)
TOKENS = ['DOGE', 'PEPE', 'SHIB', 'FLOKI']
API_BASE_URL = "https://api.dexscreener.com/latest/dex"
LAST_REQUEST_TIME = 0
REQUEST_LIMIT = 250  # requests per minute
REQUEST_INTERVAL = 60 / REQUEST_LIMIT  # minimum time between requests

def get_token_price(token):
    global LAST_REQUEST_TIME
    current_time = time.time()
    
    # Rate limiting
    if current_time - LAST_REQUEST_TIME < REQUEST_INTERVAL:
        time.sleep(REQUEST_INTERVAL - (current_time - LAST_REQUEST_TIME))
    
    try:
        response = requests.get(f"{API_BASE_URL}/search?q={token}")
        LAST_REQUEST_TIME = time.time()
        
        if response.status_code == 429:  # Rate limit exceeded
            return None, "Rate limit exceeded"
        
        if response.status_code == 200:
            data = response.json()
            if data.get('pairs') and len(data['pairs']) > 0:
                # Get the first USDT or USDC pair
                for pair in data['pairs']:
                    if 'USDT' in pair['quoteToken']['symbol'] or 'USDC' in pair['quoteToken']['symbol']:
                        return float(pair['priceUsd']), None
            return None, "No valid price pairs found"
        
        return None, f"API Error: {response.status_code}"
    except Exception as e:
        return None, f"Request Error: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html', chart_data=json.dumps({"labels": TOKENS, "values": [0] * len(TOKENS)}))

@app.route('/api/prices')
def get_prices():
    prices = []
    errors = []
    
    for token in TOKENS:
        price, error = get_token_price(token)
        if price is not None:
            prices.append(price)
        else:
            prices.append(0)
            errors.append(f"{token}: {error}")
    
    return jsonify({
        "labels": TOKENS,
        "values": prices,
        "errors": errors,
        "timestamp": datetime.now().strftime("%H:%M:%S")
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
