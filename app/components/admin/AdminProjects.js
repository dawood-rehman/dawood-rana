'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    github: '',
    live: '',
    gradient: 'from-blue-500 to-cyan-500',
    icon: 'FaCode',
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const data = getFromStorage(STORAGE_KEYS.PROJECTS, []);
    setProjects(data);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tech: '',
      github: '',
      live: '',
      gradient: 'from-blue-500 to-cyan-500',
      icon: 'FaCode',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const techArray = formData.tech
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    if (editingId) {
      const updatedProjects = projects.map((p) =>
        p.id === editingId
          ? { ...p, ...formData, tech: techArray }
          : p
      );
      setProjects(updatedProjects);
      saveToStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
      toast.success('Project updated successfully');
    } else {
      const newProject = {
        id: Date.now().toString(),
        ...formData,
        tech: techArray,
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveToStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
      toast.success('Project added successfully');
    }

    resetForm();
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech.join(', '),
      github: project.github,
      live: project.live,
      gradient: project.gradient,
      icon: project.icon,
    });
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter((p) => p.id !== id);
      setProjects(updatedProjects);
      saveToStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
      toast.success('Project deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Manage Projects</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start font-medium duration-150"
          >
            <FaPlus /> Add Project
          </button>
        )}
      </div>

      {/* Form */}
      {isAdding && (
        <div
          className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 sm:p-6 border border-slate-600 transition-all duration-200"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Gradient Class
                </label>
                <input
                  type="text"
                  value={formData.gradient}
                  onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={formData.tech}
                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                placeholder="Next.js, MongoDB, Redux"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">
                  Live URL
                </label>
                <input
                  type="text"
                  value={formData.live}
                  onChange={(e) => setFormData({ ...formData, live: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm sm:text-base font-medium duration-150"
              >
                {editingId ? 'Update Project' : 'Add Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm sm:text-base font-medium duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No projects yet</div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 sm:p-6 border border-slate-600 hover:border-slate-500 transition-all duration-150"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-slate-400 mb-3 text-sm sm:text-base">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 sm:px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs sm:text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        GitHub
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                        Live
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 sm:flex-none p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded transition-all duration-150 font-medium"
                    title="Edit project"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 sm:flex-none p-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded transition-all duration-150 font-medium"
                    title="Delete project"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
