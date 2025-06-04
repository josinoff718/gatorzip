import React, { useState, useEffect } from "react";
import { Task } from "@/api/entities/Task";

// Simple UI components defined inline to avoid external dependencies
const Button = ({ children, onClick, variant = "primary", size = "md", className = "", ...props }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "outline":
        return "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
      case "ghost":
        return "bg-transparent text-gray-600 hover:bg-gray-100";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1 px-2 text-sm";
      case "md":
        return "py-2 px-4";
      case "lg":
        return "py-3 px-6 text-lg";
      default:
        return "py-2 px-4";
    }
  };

  return (
    <button
      className={`rounded font-medium inline-flex items-center justify-center ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    {...props}
  />
);

const Select = ({ options, value, onChange, className = "", ...props }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "danger":
        return "bg-red-100 text-red-800";
      case "outline":
        return "bg-white border border-gray-300 text-gray-700";
      default:
        return className;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariantClasses()} ${className}`}
    >
      {children}
    </span>
  );
};

// Icons - simplified versions as SVGs
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const ArrowUpCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="16 12 12 8 8 12"></polyline>
    <line x1="12" y1="16" x2="12" y2="8"></line>
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

// Main component
export default function TasksStandalone() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: "all", priority: "all", category: "all" });

  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category: "personal",
    due_date: ""
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await Task.list();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      // Continue with empty tasks array if there's an error
      setTasks([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setCurrentTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        await Task.update(editingTask.id, currentTask);
      } else {
        await Task.create(currentTask);
      }
      
      resetForm();
      loadTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Could not save task. Please try again.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setCurrentTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      category: task.category || "personal",
      due_date: task.due_date
    });
    setShowForm(true);
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await Task.update(task.id, { ...task, status: newStatus });
      loadTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const resetForm = () => {
    setEditingTask(null);
    setCurrentTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      category: "personal",
      due_date: ""
    });
    setShowForm(false);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "work", label: "Work" },
    { value: "personal", label: "Personal" },
    { value: "shopping", label: "Shopping" },
    { value: "health", label: "Health" },
    { value: "learning", label: "Learning" }
  ];

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filters.status === "all" || task.status === filters.status;
    const priorityMatch = filters.priority === "all" || task.priority === filters.priority;
    const categoryMatch = filters.category === "all" || task.category === filters.category;
    return statusMatch && priorityMatch && categoryMatch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo":
        return <CircleIcon />;
      case "in_progress":
        return <ArrowUpCircleIcon />;
      case "done":
        return <CheckCircleIcon />;
      default:
        return <CircleIcon />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case "work":
        return "bg-indigo-100 text-indigo-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "shopping":
        return "bg-pink-100 text-pink-800";
      case "health":
        return "bg-green-100 text-green-800";
      case "learning":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5", 
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "2rem 1rem"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#111" }}>Tasks</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <PlusIcon /> <span style={{ marginLeft: "0.5rem" }}>Add Task</span>
          </Button>
        </div>

        {showForm && (
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "0.75rem", 
            padding: "1.5rem", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)", 
            marginBottom: "2rem" 
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <Input
                  placeholder="Task title"
                  name="title"
                  value={currentTask.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div style={{ marginBottom: "1rem" }}>
                <Textarea
                  placeholder="Description (optional)"
                  name="description"
                  value={currentTask.description}
                  onChange={handleInputChange}
                  style={{ height: "6rem" }}
                />
              </div>
              
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "1rem", 
                marginBottom: "1rem" 
              }}>
                <div style={{ minWidth: "150px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Status</label>
                  <Select 
                    options={[
                      { value: "todo", label: "To Do" },
                      { value: "in_progress", label: "In Progress" },
                      { value: "done", label: "Done" }
                    ]}
                    value={currentTask.status}
                    onChange={(value) => handleSelectChange("status", value)}
                  />
                </div>
                
                <div style={{ minWidth: "150px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Priority</label>
                  <Select 
                    options={[
                      { value: "low", label: "Low" },
                      { value: "medium", label: "Medium" },
                      { value: "high", label: "High" }
                    ]}
                    value={currentTask.priority}
                    onChange={(value) => handleSelectChange("priority", value)}
                  />
                </div>
                
                <div style={{ minWidth: "150px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Category</label>
                  <Select 
                    options={[
                      { value: "work", label: "Work" },
                      { value: "personal", label: "Personal" },
                      { value: "shopping", label: "Shopping" },
                      { value: "health", label: "Health" },
                      { value: "learning", label: "Learning" }
                    ]}
                    value={currentTask.category}
                    onChange={(value) => handleSelectChange("category", value)}
                  />
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <Button variant="outline" type="button" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? "Update" : "Create"} Task
                </Button>
              </div>
            </form>
          </div>
        )}

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "0.75rem", 
          padding: "1.5rem", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          marginBottom: "1.5rem"
        }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "1rem" }}>Filters</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem" }}>
                Status
              </label>
              <Select 
                options={statusOptions}
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                style={{ width: "140px" }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem" }}>
                Priority
              </label>
              <Select 
                options={priorityOptions}
                value={filters.priority}
                onChange={(value) => handleFilterChange("priority", value)}
                style={{ width: "140px" }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", color: "#666", marginBottom: "0.25rem" }}>
                Category
              </label>
              <Select 
                options={categoryOptions}
                value={filters.category}
                onChange={(value) => handleFilterChange("category", value)}
                style={{ width: "140px" }}
              />
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem", 
            backgroundColor: "white", 
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
          }}>
            <p style={{ color: "#666" }}>
              {tasks.length === 0 
                ? "No tasks yet. Click 'Add Task' to create one!"
                : "No tasks match your filters."}
            </p>
          </div>
        ) : (
          <div>
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                style={{ 
                  backgroundColor: "white", 
                  borderRadius: "0.5rem",
                  padding: "1.25rem", 
                  marginBottom: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button 
                      onClick={() => {
                        const newStatus = 
                          task.status === 'todo' ? 'in_progress' : 
                          task.status === 'in_progress' ? 'done' : 'todo';
                        handleStatusChange(task, newStatus);
                      }}
                      style={{ marginTop: "0.25rem", background: "none", border: "none", cursor: "pointer" }}
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    
                    <div>
                      <h3 style={{ 
                        fontWeight: "500", 
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        color: task.status === 'done' ? '#9ca3af' : '#111'
                      }}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p style={{ color: "#666", marginTop: "0.25rem", fontSize: "0.875rem" }}>
                          {task.description}
                        </p>
                      )}
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
                        <Badge className={getPriorityClass(task.priority)}>
                          {task.priority} priority
                        </Badge>
                        
                        {task.category && (
                          <Badge className={getCategoryClass(task.category)}>
                            {task.category}
                          </Badge>
                        )}
                        
                        {task.due_date && (
                          <Badge variant="outline">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(task)}
                  >
                    <PencilIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
