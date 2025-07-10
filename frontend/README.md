# Frontend

## Setup

```bash
npm install
npm run dev
```

This will start Vite on `http://localhost:5173`.

The dashboard fetches goals from the backend and includes a form to submit new
goals. Submissions are sent to the Flask API at `POST /goals`. Each goal row
displays a progress bar showing its percent complete and a color coded status
(green for **On Track**, yellow for **At Risk**, red for **Behind**).
