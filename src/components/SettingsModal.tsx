"use client";

import { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Cpu, Key, Layers, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAIConfig, saveAIConfig, getCustomSkills, saveCustomSkills } from "@/lib/storage";
import { AIConfig, Skill } from "@/lib/types";
import "./SettingsModal.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"ai" | "skills">("ai");
  const [config, setConfig] = useState<AIConfig>({
    modelName: "gemini-3-flash-preview",
    apiKey: "",
    service: "gemini",
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const savedConfig = getAIConfig();
    if (savedConfig) setConfig(savedConfig);
    setSkills(getCustomSkills());
  }, [isOpen]);

  const handleSaveAI = () => {
    saveAIConfig(config);
    alert("AI Configuration Saved!");
  };

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.description) return;
    
    // Generate a vibrant random gradient
    const hues = [200, 260, 320, 160, 40];
    const hue = hues[Math.floor(Math.random() * hues.length)];
    const bgGradient = `linear-gradient(135deg, hsla(${hue}, 80%, 50%, 0.2) 0%, hsla(${hue + 40}, 80%, 50%, 0.2) 100%)`;
    const color = `hsla(${hue}, 80%, 60%, 1)`;

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      description: newSkill.description,
      color,
      bgGradient,
    };

    const updatedSkills = [...skills, skill];
    setSkills(updatedSkills);
    saveCustomSkills(updatedSkills);
    setNewSkill({ name: "", description: "" });
  };

  const handleDeleteSkill = (id: string) => {
    const updatedSkills = skills.filter(s => s.id !== id);
    setSkills(updatedSkills);
    saveCustomSkills(updatedSkills);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="settings-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="settings-content"
          >
            {/* Header */}
            <div className="settings-header">
              <div className="settings-header-left">
                <div className="settings-icon-box">
                  <Sparkles size={20} color="white" />
                </div>
                <div>
                  <h2 className="settings-title">Console Configuration</h2>
                  <p className="settings-subtitle">Nexus Protocol v2.4</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="settings-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="settings-tabs">
              <button 
                onClick={() => setActiveTab("ai")}
                className={`settings-tab settings-tab-ai ${activeTab === "ai" ? 'active' : ''}`}
              >
                <Cpu size={14} /> AI Core
              </button>
              <button 
                onClick={() => setActiveTab("skills")}
                className={`settings-tab settings-tab-skills ${activeTab === "skills" ? 'active' : ''}`}
              >
                <Layers size={14} /> My Specializations
              </button>
            </div>

            {/* Content */}
            <div className="settings-body custom-scrollbar">
              {activeTab === "ai" ? (
                <div>
                  <div className="settings-form-group">
                    <label className="settings-label">
                      <Cpu size={12} /> Model Selection
                    </label>
                    <select 
                      value={["gemini-3-flash-preview", "gemini-1.5-pro", "gpt-4o", "gpt-4o-mini"].includes(config.modelName) ? config.modelName : "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                          setConfig({ ...config, modelName: "" });
                        } else {
                          let service: "gemini" | "openai" = "gemini";
                          if (val.includes("gpt")) service = "openai";
                          setConfig({ ...config, modelName: val, service });
                        }
                      }}
                      className="settings-input"
                    >
                      <option value="gemini-3-flash-preview">Gemini 3 Flash (Optimized)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Powerful)</option>
                      <option value="gpt-4o">GPT-4o (Experimental)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                      <option value="custom">Custom Model...</option>
                    </select>
                  </div>

                  {!["gemini-3-flash-preview", "gemini-1.5-pro", "gpt-4o", "gpt-4o-mini"].includes(config.modelName) && (
                    <div className="settings-form-group settings-flex-row">
                      <select
                        value={config.service}
                        onChange={(e) => setConfig({ ...config, service: e.target.value as "gemini" | "openai" })}
                        className="settings-input settings-flex-1"
                      >
                        <option value="gemini">Gemini API</option>
                        <option value="openai">OpenAI API</option>
                      </select>
                      <input 
                        type="text"
                        value={config.modelName}
                        onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                        placeholder={config.service === "gemini" ? "e.g., gemini-1.5-flash" : "e.g., gpt-3.5-turbo"}
                        className="settings-input settings-flex-2"
                      />
                    </div>
                  )}

                  <div className="settings-form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="settings-label">
                      <Key size={12} /> Master API Key
                    </label>
                    <input 
                      type="password"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      placeholder="Enter your API key..."
                      className="settings-input"
                    />
                    <p className="settings-help-text">
                      Your key is stored locally and never sent to our servers.
                    </p>
                  </div>

                  <button 
                    onClick={handleSaveAI}
                    className="btn-primary u-w-full u-justify-center"
                    style={{ marginTop: '2rem' }}
                  >
                    <Save size={18} /> Sync Configuration
                  </button>
                </div>
              ) : (
                <div>
                  {/* Add New Skill */}
                  <div className="settings-card">
                     <h3 className="settings-card-title">Add New Domain</h3>
                     <input 
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Specialization Name (e.g. AI Architect)"
                      className="settings-input"
                    />
                    <textarea 
                      value={newSkill.description}
                      onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                      placeholder="Brief description of the role..."
                      rows={2}
                      className="settings-input"
                    />
                    <button 
                      onClick={handleAddSkill}
                      className="settings-btn-add"
                    >
                      <Plus size={16} /> Append to Database
                    </button>
                  </div>

                  {/* Skills List */}
                  <div>
                    <h3 className="settings-card-title" style={{ marginBottom: '1rem' }}>Registered User Specializations</h3>
                    {skills.length === 0 ? (
                      <div className="settings-empty">No custom specializations found.</div>
                    ) : (
                      <div className="settings-list">
                        {skills.map(skill => (
                          <div key={skill.id} className="settings-list-item">
                            <div className="settings-item-left">
                              <div className="settings-item-color" style={{ background: skill.color }} />
                              <div>
                                <h4 className="settings-item-title">{skill.name}</h4>
                                <p className="settings-item-desc">{skill.description}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="settings-btn-delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="settings-footer">
               <span className="settings-footer-text">End of Transmission</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
