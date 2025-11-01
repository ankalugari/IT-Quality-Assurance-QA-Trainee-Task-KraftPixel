
import React, { useState } from 'react';
import { Bug, Severity } from '../types';

interface AddBugFormProps {
  onAddBug: (bug: Omit<Bug, 'id' | 'projectId'>) => void;
  onCancel: () => void;
}

const AddBugForm: React.FC<AddBugFormProps> = ({ onAddBug, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>(Severity.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onAddBug({ title, description, severity });
      setTitle('');
      setDescription('');
      setSeverity(Severity.Medium);
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-lg mb-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-content-100">Report a New Bug</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-content-200 mb-1">Bug Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Login button not working on mobile"
            className="w-full bg-base-300 border border-base-300 text-content-100 rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-content-200 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of the bug..."
            rows={4}
            className="w-full bg-base-300 border border-base-300 text-content-100 rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="severity" className="block text-sm font-medium text-content-200 mb-1">Severity</label>
          <select
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity)}
            className="w-full bg-base-300 border border-base-300 text-content-100 rounded-md p-2 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition"
          >
            {Object.values(Severity).map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-base-300 text-content-100 rounded-md hover:bg-opacity-80 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-md hover:bg-brand-primary transition"
          >
            Add Bug
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBugForm;
