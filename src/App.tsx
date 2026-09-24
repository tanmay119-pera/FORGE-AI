import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ThemeMode, VoiceState, AgoraConfig, ToolCallExecution, MCPLogEntry } from './types';
import { Navbar } from './components/Navbar';
import { UserExperienceWindow } from './components/UserExperienceWindow';
import { EnterpriseFooter } from './components/EnterpriseFooter';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { agoraVoiceService } from './services/agoraService';
import { orchestrator } from './services/voiceAgentOrchestrator';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('forge_theme') as ThemeMode;
    return saved || 'dark';
  });

  // User Profile (Apple ID / Google ID)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('forge_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: 'Tanmay (Adesh Srivastava)',
      email: 'forge.ai@gmail.com',
      avatar: '',
      provider: 'google',
      tier: 'Executive'
    };
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [assistantSpeech, setAssistantSpeech] = useState<string>('');
  const [audioVolume, setAudioVolume] = useState<number>(0);

  const [executions, setExecutions] = useState<ToolCallExecution[]>([]);
  const [mcpLogs, setMcpLogs] = useState<MCPLogEntry[]>([]);

  const [agoraConfig, setAgoraConfig] = useState<AgoraConfig>(() => {
    const saved = localStorage.getItem('forge_agora_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      appId: '',
      channel: 'forge-voice-copilot',
      token: '',
      uid: Math.floor(1000 + Math.random() * 9000)
    };
  });

  const [agoraConnected, setAgoraConnected] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('forge_theme', theme);
  }, [theme]);

  useEffect(() => {
    orchestrator.registerCallbacks({
      onVoiceStateChange: (state) => setVoiceState(state),
      onTranscriptUpdate: (text, _isFinal) => {
        setTranscript(text);
      },
      onAssistantSpeech: (text) => setAssistantSpeech(text),
      onToolExecuted: (execution) => {
        setExecutions(prev => [execution, ...prev]);

        if (execution.toolName === 'cab_dispatch') {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      },
      onMCPLog: (log) => setMcpLogs(prev => [log, ...prev])
    });

    agoraVoiceService.onVolumeChange = (vol) => {
      setAudioVolume(vol);
    };

    agoraVoiceService.onStateChange = (state) => {
      setAgoraConnected(state === 'connected');
    };

    return () => {
      agoraVoiceService.disconnect();
    };
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('forge_user', JSON.stringify(user));
    const firstName = user.name.split(' ')[0];
    const greetingText = `Welcome back, ${firstName}. What would you like to handle?`;
    setAssistantSpeech(greetingText);
    orchestrator.handleUserInput(`Hello Forge, I am ${firstName}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('forge_user');
  };

  // Smooth Circular Morphing Theme Transition
  const handleToggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = (document as any).startViewTransition(() => {
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];

        document.documentElement.animate(
          {
            clipPath: nextTheme === 'dark' ? [...clipPath].reverse() : clipPath
          },
          {
            duration: 480,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: nextTheme === 'dark' ? '::view-transition-old(root)' : '::view-transition-new(root)'
          }
        );
      });
    } else {
      setTheme(nextTheme);
    }
  };

  const handleToggleAgora = async () => {
    if (agoraConnected) {
      await agoraVoiceService.disconnect();
    } else {
      await agoraVoiceService.connect(agoraConfig);
    }
  };

  const handleSaveAgoraConfig = (newConfig: AgoraConfig) => {
    setAgoraConfig(newConfig);
    localStorage.setItem('forge_agora_config', JSON.stringify(newConfig));
  };

  const handleStartListening = () => {
    orchestrator.startListening();
  };

  const handleStopListening = () => {
    orchestrator.stopListening();
  };

  const handleSelectPrompt = (promptText: string) => {
    setTranscript(promptText);
    orchestrator.handleUserInput(promptText);
  };

  const isPureBlack = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans flex flex-col ${
      isPureBlack
        ? 'bg-[#000000] text-[#ededed]'
        : 'bg-[#ffffff] text-[#111111]'
    }`}>
      {/* 1. Enterprise SaaS Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        agoraConnected={agoraConnected}
        agoraConfig={agoraConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        volume={audioVolume}
      />

      {/* 2. Pure User Experience Window (No AI-made boxes, completely frictionless) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10">
        <UserExperienceWindow
          voiceState={voiceState}
          onStartListening={handleStartListening}
          onStopListening={handleStopListening}
          onTextSubmit={handleSelectPrompt}
          transcript={transcript}
          assistantSpeech={assistantSpeech}
          theme={theme}
          audioVolume={audioVolume}
          currentUser={currentUser}
          executions={executions}
        />
      </main>

      {/* 3. Enterprise Multi-Column Footer */}
      <EnterpriseFooter theme={theme} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={agoraConfig}
        onSaveConfig={handleSaveAgoraConfig}
        theme={theme}
      />

      {/* Apple / Google ID Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        theme={theme}
      />
    </div>
  );
}
