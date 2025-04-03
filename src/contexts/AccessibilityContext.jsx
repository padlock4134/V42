import { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('medium'); // small, medium, large
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(false);

  // Load accessibility preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      const dyslexicFont = localStorage.getItem('porkchop_dyslexic_font') === 'true';
      const highContrast = localStorage.getItem('porkchop_high_contrast') === 'true';
      const size = localStorage.getItem('porkchop_text_size') || 'medium';
      const screenReader = localStorage.getItem('porkchop_screen_reader') === 'true';
      const voiceCommands = localStorage.getItem('porkchop_voice_commands') === 'true';

      setIsDyslexicFont(dyslexicFont);
      setIsHighContrast(highContrast);
      setTextSize(size);
      setIsScreenReaderEnabled(screenReader);
      setVoiceCommandsEnabled(voiceCommands);

      // Apply settings to document
      applySettings(dyslexicFont, highContrast, size);
    };

    loadPreferences();
  }, []);

  // Apply accessibility settings to the document
  const applySettings = (dyslexicFont, highContrast, size) => {
    // Apply dyslexic font
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }

    // Apply high contrast
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply text size
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (size) {
      case 'small':
        document.body.classList.add('text-sm');
        break;
      case 'large':
        document.body.classList.add('text-lg');
        break;
      default:
        document.body.classList.add('text-base');
    }
  };

  // Toggle dyslexic font
  const toggleDyslexicFont = () => {
    const newValue = !isDyslexicFont;
    setIsDyslexicFont(newValue);
    localStorage.setItem('porkchop_dyslexic_font', newValue.toString());
    applySettings(newValue, isHighContrast, textSize);
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('porkchop_high_contrast', newValue.toString());
    applySettings(isDyslexicFont, newValue, textSize);
  };

  // Set text size
  const changeTextSize = (size) => {
    setTextSize(size);
    localStorage.setItem('porkchop_text_size', size);
    applySettings(isDyslexicFont, isHighContrast, size);
  };

  // Toggle screen reader
  const toggleScreenReader = () => {
    const newValue = !isScreenReaderEnabled;
    setIsScreenReaderEnabled(newValue);
    localStorage.setItem('porkchop_screen_reader', newValue.toString());
  };

  // Toggle voice commands
  const toggleVoiceCommands = () => {
    const newValue = !voiceCommandsEnabled;
    setVoiceCommandsEnabled(newValue);
    localStorage.setItem('porkchop_voice_commands', newValue.toString());
  };

  const value = {
    isDyslexicFont,
    isHighContrast,
    textSize,
    isScreenReaderEnabled,
    voiceCommandsEnabled,
    toggleDyslexicFont,
    toggleHighContrast,
    changeTextSize,
    toggleScreenReader,
    toggleVoiceCommands
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;
