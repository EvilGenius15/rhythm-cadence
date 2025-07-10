from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

GOALS_FILE = os.path.join(os.path.dirname(__file__), 'goals.json')

# Default goals used when the data file doesn't exist
DEFAULT_GOALS = [
    {
        "title": "Launch new website",
        "assignedTo": "Alice",
        "status": "On Track",
        "percentComplete": 50,
    },
    {
        "title": "Expand sales team",
        "assignedTo": "Bob",
        "status": "At Risk",
        "percentComplete": 30,
    },
    {
        "title": "Increase revenue by 20%",
        "assignedTo": "Charlie",
        "status": "Behind",
        "percentComplete": 10,
    },
]

# Acceptable values for the status field when creating a goal
VALID_STATUSES = {"On Track", "At Risk", "Behind"}

def load_goals():
    """Load goals from the JSON file or initialize defaults."""
    if os.path.exists(GOALS_FILE):
        try:
            with open(GOALS_FILE) as f:
                return json.load(f)
        except json.JSONDecodeError:
            pass
    # If file missing or invalid, initialize with defaults
    with open(GOALS_FILE, 'w') as f:
        json.dump(DEFAULT_GOALS, f, indent=2)
    return DEFAULT_GOALS

def save_goals(goals):
    """Persist goals list to the JSON file."""
    with open(GOALS_FILE, 'w') as f:
        json.dump(goals, f, indent=2)


GOALS = load_goals()

@app.route('/goals', methods=['GET', 'POST'])
def goals_handler():
    """Get all goals or create a new goal."""
    if request.method == 'POST':
        data = request.get_json() or {}
        # Validate required fields
        required = {'title', 'assignedTo', 'status', 'percentComplete'}
        if not required.issubset(data):
            abort(400, 'Missing required goal fields')
        if data['status'] not in VALID_STATUSES:
            abort(400, 'Invalid status value')
        GOALS.append({
            'title': data['title'],
            'assignedTo': data['assignedTo'],
            'status': data['status'],
            'percentComplete': data['percentComplete'],
        })
        save_goals(GOALS)
        return jsonify({'message': 'Goal added'}), 201

    return jsonify(GOALS)

if __name__ == '__main__':
    app.run(debug=True)
