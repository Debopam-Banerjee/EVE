import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; 

type AssistantState = "idle" | "listening" | "processing" | "speaking" | "active";

interface ParticleBackgroundProps {
  state: AssistantState;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ state }) => {
  const [config, setConfig] = useState<any>({});
  
  useEffect(() => {
    // Adjust particles based on state with increased counts and slower speeds
    if (state === "idle") {
      setConfig({
        particles: {
          number: { value: 280, density: { enable: true, value_area: 1000 } },
          opacity: { value: 0.6 },
          size: { value: 4 },
          move: { speed: 0.3 },
        }
      });
    } else if (state === "listening") {
      setConfig({
        particles: {
          number: { value: 320, density: { enable: true, value_area: 1000 } },
          opacity: { value: 0.7 },
          size: { value: 5 },
          move: { speed: 0.5 },
        }
      });
    } else if (state === "processing") {
      setConfig({
        particles: {
          number: { value: 380, density: { enable: true, value_area: 1000 } },
          opacity: { value: 0.8 },
          size: { value: 6 },
          move: { speed: 0.7 },
        }
      });
    } else if (state === "speaking") {
      setConfig({
        particles: {
          number: { value: 400, density: { enable: true, value_area: 1000 } },
          opacity: { value: 0.9 },
          size: { value: 7 },
          move: { speed: 0.9 },
        }
      });
    } else if (state === "active") {
      setConfig({
        particles: {
          number: { value: 350, density: { enable: true, value_area: 1000 } },
          opacity: { value: 0.75 },
          size: { value: 5.5 },
          move: { speed: 0.6 },
        }
      });
    }
  }, [state]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded
  }, []);

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-10" 
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ["bubble", "repulse"],
              parallax: {
                enable: false
              }
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 40,
              size: 6,
              duration: 0.3,
              opacity: 0.8,
              speed: 0.3
            },
            repulse: {
              distance: 50,
              duration: 0.4,
              speed: 0.5,
              factor: 20,
              easing: "ease-out-cubic"
            }
          },
        },
        particles: {
          color: {
            value: "#00BFFF",
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: config.particles?.move?.speed || 0.3,
            straight: false,
            trail: {
              enable: false
            }
          },
          number: {
            density: {
              enable: true,
              area: 1200,
            },
            value: config.particles?.number?.value || 280,
          },
          opacity: {
            value: config.particles?.opacity?.value || 0.6,
            animation: {
              enable: true,
              speed: 0.15,
              minimumValue: 0.1,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: config.particles?.size?.value || 4,
            animation: {
              enable: true,
              speed: 0.4,
              minimumValue: 1,
              sync: false,
            },
          },
          links: {
            enable: false,
          },
          glow: {
            enable: true,
            color: "#00BFFF",
            frequency: 0.05,
            intensity: 7
          },
          life: {
            duration: {
              sync: false,
              value: 0,
            },
            count: 1
          },
          effect: {
            type: "pulsate",
            options: {
              frequency: 1.5,
              intensity: 20
            }
          }
        },
        detectRetina: true,
        emitters: {
          position: {
            x: 50,
            y: 50
          },
          rate: {
            quantity: 5,
            delay: 0.25
          },
          size: {
            width: 100,
            height: 100
          },
          life: {
            duration: 0,
            count: 1
          }
        }
      }}
    />
  );
};

export default ParticleBackground;
