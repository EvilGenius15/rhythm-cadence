# Backend

## Setup

```bash
pip install -r requirements.txt
python app.py
```

This starts a development server on `http://localhost:5000` with the following endpoints:

- `GET /goals` – returns the current list of active goals
- `POST /goals` – accepts a JSON payload with `title`, `assignedTo`, `status`, and `percentComplete` fields to add a new goal. `status` must be one of `On Track`, `At Risk`, or `Behind`. Posted goals are stored in `goals.json` so they persist across restarts. Invalid input returns **400**.
