import React, { useEffect, useState } from 'react';

const statusColors = {
  'On Track': 'bg-green-100 text-green-800',
  'At Risk': 'bg-yellow-100 text-yellow-800',
  'Behind': 'bg-red-100 text-red-800',
};

const statusTextColors = {
  'On Track': 'text-green-600',
  'At Risk': 'text-yellow-600',
  'Behind': 'text-red-600',
};

export default function App() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: '',
    assignedTo: '',
    status: 'On Track',
    percentComplete: 0,
  });

  const fetchGoals = () => {
    fetch('http://localhost:5000/goals')
      .then((res) => res.json())
      .then(setGoals)
      .catch(console.error);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        assignedTo: form.assignedTo,
        status: form.status,
        percentComplete: Number(form.percentComplete),
      }),
    })
      .then(() => {
        setForm({ title: '', assignedTo: '', status: 'On Track', percentComplete: 0 });
        fetchGoals();
      })
      .catch(console.error);
  };

  const summary = {
    total: goals.length,
    onTrack: goals.filter((g) => g.status === 'On Track').length,
    atRisk: goals.filter((g) => g.status === 'At Risk').length,
    behind: goals.filter((g) => g.status === 'Behind').length,
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Goals Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Goals" value={summary.total} />
        <SummaryCard label="On Track" value={summary.onTrack} color={statusTextColors['On Track']} />
        <SummaryCard label="At Risk" value={summary.atRisk} color={statusTextColors['At Risk']} />
        <SummaryCard label="Behind" value={summary.behind} color={statusTextColors['Behind']} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 space-y-4 mb-6">
        <h2 className="text-xl font-semibold">Add Goal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border rounded px-2 py-1"
            required
          />
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            placeholder="Owner"
            className="border rounded px-2 py-1"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded px-2 py-1"
          >
            <option>On Track</option>
            <option>At Risk</option>
            <option>Behind</option>
          </select>
          <input
            type="number"
            name="percentComplete"
            value={form.percentComplete}
            onChange={handleChange}
            placeholder="% Complete"
            className="border rounded px-2 py-1"
            min="0"
            max="100"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Goal</button>
      </form>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Title</th>
              <th className="px-4 py-2 text-left font-medium">Owner</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {goals.map((goal, idx) => (
              <tr key={idx} className="bg-white">
                <td className="px-4 py-2">{goal.title}</td>
                <td className="px-4 py-2">{goal.assignedTo}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${statusColors[goal.status]}`}>{goal.status}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div
                        className="h-2 bg-blue-600 rounded"
                        style={{ width: `${goal.percentComplete}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{goal.percentComplete}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${color || ''}`}>{value}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  );
}
