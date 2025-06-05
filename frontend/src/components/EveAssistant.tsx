import React, { useState, useEffect, useRef } from "react";
import { useSettings } from "../hooks/useSettings";
import ParticleBackground from "./visualEffects/ParticleBackground";
import FloatingMessages from "./FloatingMessages";
import FloatingMap from "./FloatingMap";
import FloatingTextInput from "./FloatingTextInput";
import { EveApiService } from "../services/eveApi";
import { X } from 'lucide-react';

type AssistantState = "idle" | "listening" | "processing" | "speaking" | "active";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: string;
  mapEmbed?: string;
}

const EveAssistant = () => {
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isMapMinimized, setIsMapMinimized] = useState(false);
  const [currentMapUrl, setCurrentMapUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [discRotation, setDiscRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [startDragX, setStartDragX] = useState(0);
  const [isStartingCall, setIsStartingCall] = useState(false);
  
  const { settings } = useSettings();
  const lottiePlayerRef = useRef<any>(null);
  const secondLottiePlayerRef = useRef<any>(null);
  const apiServiceRef = useRef<EveApiService | null>(null);
  const discContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize API service when backend URL changes
  useEffect(() => {
    if (settings.backendUrl) {
      apiServiceRef.current = new EveApiService(settings.backendUrl);
    }
  }, [settings.backendUrl]);

  // Poll for map updates during voice calls
  useEffect(() => {
    if (!isVoiceCallActive) {
      setCurrentMapUrl(undefined);
      return;
    }

    let retryCount = 0;
    let maxRetries = 3;
    let baseInterval = 2000;  // 2 seconds between polls
    let timer: ReturnType<typeof setTimeout>;
    let isPolling = true;

    const poll = async () => {
      if (!isPolling) return;

      try {
        const response = await fetch(`${settings.backendUrl}/map-status`);
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.type === "map" && data.mapEmbed) {
          console.log("🗺️ Map data received:", data.mapEmbed);
          if (isPolling && data.mapEmbed !== currentMapUrl) {
            setCurrentMapUrl(data.mapEmbed);
            setIsMapMinimized(false);
          }
          retryCount = 0;
        }

        if (isPolling) {
          timer = setTimeout(poll, baseInterval);
        }

      } catch (err) {
        console.error("❌ Map polling error:", err);
        retryCount++;
        
        if (retryCount >= maxRetries) {
          console.log("⚠️ Max retries reached, stopping map polling");
          setIsVoiceCallActive(false);
          setCurrentMapUrl(undefined);
          return;
        }

        const retryDelay = Math.min(baseInterval * Math.pow(2, retryCount), 5000);
        if (isPolling) {
          timer = setTimeout(poll, retryDelay);
        }
      }
    };

    poll();

    return () => {
      isPolling = false;
      clearTimeout(timer);
      setCurrentMapUrl(undefined);
    };
  }, [isVoiceCallActive, settings.backendUrl]);

  // Set up Lottie players
  useEffect(() => {
    setTimeout(() => {
      const orbLottie = document.getElementById('eve-lottie') as any;
      const discLottie = document.getElementById('eve-disc-lottie') as any;
      
      if (orbLottie) {
        lottiePlayerRef.current = orbLottie;
        if (orbLottie.setSpeed) {
          orbLottie.setSpeed(0.2);
        }
      }
      
      if (discLottie) {
        secondLottiePlayerRef.current = discLottie;
        if (discLottie.setSpeed) {
          discLottie.setSpeed(0.5);
        }
      }
      
      updateOrbAnimation();
    }, 1000);
  }, []);
  
  // Update orb animation based on state
  const updateOrbAnimation = () => {
    const orbElement = document.getElementById('eve-lottie');
    
    if (!orbElement) return;
    
    switch (assistantState) {
      case "idle":
        orbElement.style.transform = 'scale(1)';
        orbElement.style.filter = 'drop-shadow(0 0 5px rgba(0, 191, 255, 0.3))';
        if (lottiePlayerRef.current?.setSpeed) {
          lottiePlayerRef.current.setSpeed(0.2);
        }
        break;
      case "listening":
        orbElement.style.transform = 'scale(1.1)';
        orbElement.style.filter = 'drop-shadow(0 0 15px rgba(0, 191, 255, 0.7))';
        if (lottiePlayerRef.current?.setSpeed) {
          lottiePlayerRef.current.setSpeed(0.5);
        }
        break;
      case "processing":
        orbElement.style.transform = 'scale(1.05)';
        orbElement.style.filter = 'drop-shadow(0 0 20px rgba(0, 191, 255, 0.8))';
        if (lottiePlayerRef.current?.setSpeed) {
          lottiePlayerRef.current.setSpeed(0.8);
        }
        break;
      case "speaking":
        orbElement.style.transform = 'scale(1.15)';
        orbElement.style.filter = 'drop-shadow(0 0 25px rgba(0, 191, 255, 0.9))';
        if (lottiePlayerRef.current?.setSpeed) {
          lottiePlayerRef.current.setSpeed(1.0);
        }
        break;
      case "active":
        orbElement.style.transform = 'scale(1.1)';
        orbElement.style.filter = 'drop-shadow(0 0 15px rgba(0, 191, 255, 0.6))';
        if (lottiePlayerRef.current?.setSpeed) {
          lottiePlayerRef.current.setSpeed(0.6);
        }
        break;
    }
    
    // Update second animation
    if (secondLottiePlayerRef.current?.setSpeed) {
      const speeds = {
        idle: 0.5,
        listening: 0.7,
        processing: 1.0,
        speaking: 1.2,
        active: 0.8
      };
      secondLottiePlayerRef.current.setSpeed(speeds[assistantState]);
    }
  };
  
  useEffect(() => {
    updateOrbAnimation();
  }, [assistantState]);

  // Handle voice agent response
  const handleVoiceResponse = async (transcript: string) => {
    console.log('🎤 Voice transcript:', transcript);
    
    try {
      // Send query to backend
      const response = await fetch(`${settings.backendUrl}/voice-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: transcript })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 Voice query response:', data);

        // If we got a map, display it
        if (data.type === 'map' && data.mapEmbed) {
          console.log('🗺️ Showing map:', data.mapEmbed);
          setCurrentMapUrl(data.mapEmbed);
          setIsMapMinimized(false);
        }
      }
    } catch (error) {
      console.error('❌ Error handling voice response:', error);
    }
  };

  // Start voice conversation
  const startVoiceCall = async () => {
    if (!apiServiceRef.current || isStartingCall) return;

    setIsStartingCall(true);
    
    try {
      // First try to end any existing call
      await endVoiceCall();
      
      // Clear any existing map data
      setCurrentMapUrl(undefined);
      setIsMapMinimized(false);

      console.log('🎤 Starting voice call at:', settings.backendUrl);
      const response = await fetch(`${settings.backendUrl}/start-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Voice call started successfully');
        setIsVoiceCallActive(true);
        setAssistantState("listening");
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed to start voice call: ${response.status}`, errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error("❌ Failed to start voice call:", err);
      setAssistantState("idle");
      // Show error to user
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, I couldn't start the voice call. Please check your connection and try again.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsStartingCall(false);
    }
  };

  // End voice call
  const endVoiceCall = async () => {
    if (!apiServiceRef.current || !isVoiceCallActive) return;

    try {
      // Immediately set states to prevent multiple calls
      setIsVoiceCallActive(false);
      setAssistantState("idle");
      
      // Clear map state
      setCurrentMapUrl(undefined);
      setIsMapMinimized(false);

      // Stop any playing audio
      const audioElements = document.getElementsByTagName('audio');
      for (let i = 0; i < audioElements.length; i++) {
        try {
          audioElements[i].pause();
          audioElements[i].currentTime = 0;
        } catch (e) {
          console.error('Error stopping audio:', e);
        }
      }

      // Clear map data and end call on backend
      await Promise.all([
        fetch(`${settings.backendUrl}/clear-map`, {
          method: 'POST',
        }),
        fetch(`${settings.backendUrl}/end-call`, {
          method: 'POST'
        })
      ]);

      console.log('📞 Call ended successfully');
    } catch (error) {
      console.error('❌ Error ending call:', error);
      // Don't revert the states even if the backend calls fail
      // This ensures the UI remains consistent
    }
  };

  // Function to play base64 audio
  const playAudio = async (base64Audio: string) => {
    try {
      console.log('🔊 Playing audio, length:', base64Audio.length);
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      
      audio.onerror = (e) => {
        console.error('❌ Audio error:', e);
      };
      
      audio.onloadeddata = () => {
        console.log('✅ Audio loaded successfully');
      };
      
      // Add a check for call state before playing
      if (!isVoiceCallActive) {
        console.log('❌ Call ended, not playing audio');
        return;
      }
      
      await audio.play();
      console.log('▶️ Audio playback started');
      
      return new Promise((resolve) => {
        const checkCallState = () => {
          if (!isVoiceCallActive) {
            audio.pause();
            audio.currentTime = 0;
            resolve(undefined);
            return;
          }
        };

        // Check call state periodically
        const stateCheckInterval = setInterval(checkCallState, 100);
        
        audio.onended = () => {
          clearInterval(stateCheckInterval);
          console.log('⏹️ Audio playback finished');
          resolve(undefined);
        };

        // Also clear interval if audio is stopped
        audio.onpause = () => {
          clearInterval(stateCheckInterval);
          resolve(undefined);
        };
      });
    } catch (error) {
      console.error('❌ Error playing audio:', error);
    }
  };

  // Handle text messages
  const handleSendMessage = async (messageText: string, useVoice: boolean) => {
    if (!apiServiceRef.current || isLoading) return;

    if (!isTextMode && !isVoiceCallActive) {
      setIsTextMode(true);
      setAssistantState("active");
      setIsChatMinimized(false);
    }

    setIsLoading(true);
    setAssistantState("processing");

    // Add user message only if not in voice mode
    if (!isVoiceCallActive) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
    }

    try {
      const apiKeys = {
        openai: settings.openaiApiKey,
        elevenlabs: settings.elevenLabsApiKey,
        voiceId: settings.voiceId,
        agentId: settings.agentId,
        webhookUrl: settings.webhookUrl
      };

      const response = await apiServiceRef.current.sendMessage({
        query: messageText,
        useVoice: useVoice || isVoiceCallActive, // Consider voice mode if either flag is true
        apiKeys
      });

      console.log('Full API Response:', response); // Debug log

      // For voice calls, only handle map display
      if (isVoiceCallActive) {
        if (response.type === 'map' && response.mapEmbed) {
          console.log('🗺️ Voice agent map response received:', response);
          console.log('📍 Current map state before update:', { currentMapUrl, isMapMinimized });
          setCurrentMapUrl(response.mapEmbed);
          setIsMapMinimized(false);
          console.log('📍 Map state updated:', { newMapUrl: response.mapEmbed, isMapMinimized: false });
        }
        setAssistantState("active");
        return;
      }

      // For text mode, handle full response
      if (response.reply) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.reply,
          isUser: false,
          timestamp: new Date(),
          type: response.type || 'text',
          mapEmbed: response.mapEmbed  // Include map for text mode
        };
        
        setMessages(prev => [...prev, assistantMessage]);

        // Show floating map if it's a map response
        if (response.type === 'map' && response.mapEmbed) {
          console.log('Showing floating map from text response:', response.mapEmbed);
          setCurrentMapUrl(response.mapEmbed);
          setIsMapMinimized(false);
        }
        
        // Play audio if available, regardless of useVoice flag
        if (response.audio) {
          setAssistantState("speaking");
          await playAudio(response.audio);
          setAssistantState("active");
        } else {
          setAssistantState("active");
        }
      } else if (response.error) {
        if (!isVoiceCallActive) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `Error: ${response.error}`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        setAssistantState("active");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (!isVoiceCallActive) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting. Please try again.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      setAssistantState("active");
    }

    setIsLoading(false);
  };

  // Chat control functions
  const handleCloseChat = () => {
    setIsTextMode(false);
    setIsChatMinimized(false);
    setMessages([]);
    setAssistantState("idle");
  };

  const handleMinimizeChat = () => {
    setIsChatMinimized(true);
  };

  const handleRestoreChat = () => {
    setIsChatMinimized(false);
  };

  // Handle mouse down on disc
  const handleDiscMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartDragX(e.clientX);
    
    const lottiePlayer = document.getElementById('eve-disc-lottie') as any;
    if (lottiePlayer) {
      console.log('Animation paused');
      lottiePlayer.pause();
      // Store initial progress
      setDragProgress(lottiePlayer.getLottie().currentFrame / lottiePlayer.getLottie().totalFrames);
    }
  };

  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        const lottiePlayer = document.getElementById('eve-disc-lottie') as any;
        if (lottiePlayer) {
          console.log('Mouse up - resuming animation');
          lottiePlayer.play();
        }
      }
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const lottiePlayer = document.getElementById('eve-disc-lottie') as any;
      if (!lottiePlayer) return;

      const lottie = lottiePlayer.getLottie();
      if (!lottie) return;

      const deltaX = e.clientX - startDragX;
      const width = discContainerRef.current?.offsetWidth || 300;
      const sensitivity = 0.15;
      
      const progressChange = (deltaX * sensitivity) / width;
      const newProgress = Math.max(0, Math.min(1, dragProgress + progressChange));
      
      const frame = Math.floor(newProgress * lottie.totalFrames);
      
      lottie.goToAndStop(frame, true);
      setDragProgress(newProgress);
      
      if (newProgress > 0 && newProgress < 1) {
        setStartDragX(e.clientX);
      }
    };

    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [isDragging, startDragX, dragProgress]);

  // Add these keyframes at the top of the component, before the return statement
  const glowingTextKeyframes = `
  @keyframes glowingText {
    0% {
      background-position: 500% 0;
    }
    100% {
      background-position: -500% 0;
    }
  }
  `;

  const handleCloseMap = () => {
    // Clear map data on backend
    fetch(`${settings.backendUrl}/clear-map`, {
      method: 'POST',
    }).catch(error => {
      console.error('❌ Error clearing map data:', error);
    });

    // Clear local map state
    setCurrentMapUrl(undefined);
    setIsMapMinimized(false);
  };

  const handleMinimizeMap = () => {
    setIsMapMinimized(true);
  };

  const handleRestoreMap = () => {
    setIsMapMinimized(false);
  };

  return (
    <>
      <style>{glowingTextKeyframes}</style>
      <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
        {/* Floating Messages */}
        <FloatingMessages 
          messages={messages} 
          isVisible={isTextMode && !isChatMinimized} 
          onClose={handleCloseChat}
          onMinimize={handleMinimizeChat}
        />

        {/* Floating Map */}
        {currentMapUrl && (
          <FloatingMap
            mapUrl={currentMapUrl}
            isVisible={!!currentMapUrl && !isMapMinimized}
            onClose={handleCloseMap}
            onMinimize={handleMinimizeMap}
            onRestore={handleRestoreMap}
          />
        )}

        {/* Map Minimized Indicator */}
        {currentMapUrl && isMapMinimized && (
          <button
            onClick={() => setIsMapMinimized(false)}
            className="fixed right-[15%] top-[15%] px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-white/80 text-sm z-30"
          >
            Show Map
          </button>
        )}

        {/* Minimized Chat Indicator */}
        {isTextMode && isChatMinimized && (
          <button
            onClick={handleRestoreChat}
            className="fixed right-[15%] top-[25%] px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors text-white/80 text-sm z-30"
          >
            Show Chat ({messages.length})
          </button>
        )}

        {/* Main Orb Interface */}
        <div className="relative flex flex-col items-center justify-center w-full">
          {/* Orb animation */}
          <div className="relative w-[350px] h-[350px] flex items-center justify-center mb-0 mt-2">
            <ParticleBackground state={assistantState} />
            
            <div 
              className={`relative z-10 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                assistantState !== "idle" ? "eve-active" : ""
              }`}
              onClick={!isVoiceCallActive ? startVoiceCall : undefined}
            >
              <dotlottie-player 
                id="eve-lottie" 
                src="https://lottie.host/5510986b-0753-4f1c-9b98-66c4dd8547b0/seGZ4Qrljo.lottie" 
                background="transparent" 
                speed="0.2" 
                style={{ width: '300px', height: '300px' }} 
                loop 
                autoplay>
              </dotlottie-player>
            </div>
          </div>
          
          {/* Second animation */}
          <div className="relative z-5 -mt-32 mb-4">
            <div 
              ref={discContainerRef}
              className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleDiscMouseDown}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                position: 'absolute',
                top: '70px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '280px',
                height: '140px',
                borderRadius: '50%',
                zIndex: 10
              }}
            >
            </div>
            <dotlottie-player 
              id="eve-disc-lottie"
              src="https://lottie.host/880661a9-12ec-458a-9b72-2ec90355004c/v6BwZbiUk7.lottie" 
              background="transparent" 
              speed="0.5" 
              style={{ width: '300px', height: '300px' }} 
              loop 
              autoplay>
            </dotlottie-player>
          </div>

          {/* End Call Button */}
          {isVoiceCallActive && (
            <button
              onClick={endVoiceCall}
              disabled={isLoading}
              className="absolute top-8 right-8 p-3 bg-red-500/80 hover:bg-red-600/80 text-white rounded-full shadow-lg backdrop-blur-sm transition-colors disabled:opacity-50 z-50"
              title="End Voice Call"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Status Text */}
          <div className="text-center mb-8">
            <p 
              className="text-lg font-medium"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 191, 255, 0.2) 0%, rgba(0, 191, 255, 1) 50%, rgba(0, 191, 255, 0.2) 100%)',
                backgroundSize: '200% auto',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                animation: 'glowingText 24s linear infinite',
              }}
            >
              {isVoiceCallActive 
                ? `Voice call ${assistantState === "processing" ? "processing" : assistantState === "speaking" ? "active" : "connected"}`
                : !isTextMode
                ? "Click the orb to start a voice conversation" 
                : `Eve is ${assistantState === "processing" ? "thinking" : assistantState === "speaking" ? "speaking" : "ready"}`
              }
            </p>
          </div>
        </div>

        {/* Floating Text Input */}
        {!isVoiceCallActive && (
          <FloatingTextInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            voiceEnabled={voiceEnabled}
            onVoiceToggle={() => setVoiceEnabled(!voiceEnabled)}
          />
        )}
      </div>
    </>
  );
};

export default EveAssistant;
