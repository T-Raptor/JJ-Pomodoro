import { useState } from 'react';
import './AdminMenu.css';

const AdminMenu = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange, 
  onSkipToBreak, 
  onSkipToLongBreak, 
  onSkipToWork, 
  onGoBackSession,
  currentState 
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleInputChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
    }));
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      workMinutes: 25,
      breakMinutes: 5,
      longBreakMinutes: 15,
      sessionsUntilLongBreak: 4
    };
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-menu">
        <div className="admin-header">
          <h2>⚙️ Admin Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="admin-content">
          <div className="setting-group">
            <label htmlFor="workMinutes">
              🍅 Work Session (minutes)
            </label>
            <input
              id="workMinutes"
              type="number"
              min="1"
              max="60"
              value={localSettings.workMinutes}
              onChange={(e) => handleInputChange('workMinutes', e.target.value)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="breakMinutes">
              ☕ Short Break (minutes)
            </label>
            <input
              id="breakMinutes"
              type="number"
              min="1"
              max="30"
              value={localSettings.breakMinutes}
              onChange={(e) => handleInputChange('breakMinutes', e.target.value)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="longBreakMinutes">
              🌟 Long Break (minutes)
            </label>
            <input
              id="longBreakMinutes"
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakMinutes}
              onChange={(e) => handleInputChange('longBreakMinutes', e.target.value)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="sessionsUntilLongBreak">
              🔄 Sessions until Long Break
            </label>            <input
              id="sessionsUntilLongBreak"
              type="number"
              min="2"
              max="10"
              value={localSettings.sessionsUntilLongBreak}
              onChange={(e) => handleInputChange('sessionsUntilLongBreak', e.target.value)}
            />
          </div>
        </div>

        {/* Timer Navigation Section */}
        <div className="admin-content">
          <h3 className="section-title">🎯 Timer Navigation</h3>
          
          <div className="navigation-buttons">
            <button 
              className="nav-btn work-btn" 
              onClick={() => { onSkipToWork(); onClose(); }}
              disabled={!currentState.isBreak && !currentState.isLongBreak}
            >
              🍅 Go to Work Session
            </button>
            
            <button 
              className="nav-btn break-btn" 
              onClick={() => { onSkipToBreak(); onClose(); }}
              disabled={currentState.isBreak}
            >
              ☕ Skip to Short Break
            </button>
            
            <button 
              className="nav-btn long-break-btn" 
              onClick={() => { onSkipToLongBreak(); onClose(); }}
              disabled={currentState.isLongBreak}
            >
              🌟 Skip to Long Break
            </button>
            
            {currentState.completedSessions > 0 && (
              <button 
                className="nav-btn back-btn" 
                onClick={() => { onGoBackSession(); onClose(); }}
              >
                ⏪ Go Back One Session
              </button>
            )}
          </div>
        </div>

        <div className="admin-actions">
          <button className="save-btn" onClick={handleSave}>
            💾 Save Settings
          </button>
          <button className="reset-btn" onClick={handleReset}>
            🔄 Reset to Default
          </button>
          <button className="cancel-btn" onClick={onClose}>
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
