import { useState, useRef, useEffect } from "react";
import {
  httpRecipeSteps,
  httpVoiceAssistantResponse,
} from "../../../../hooks/requests";
import { Recipe } from "../../../../models/recipe.model";

// Ensure TypeScript recognizes SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface RecipeAssistantProps {
  recipe: Recipe;
}

const RecipeAssistant: React.FC<RecipeAssistantProps> = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [allSteps, setAllSteps] = useState<string[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false); // For controlling listening state

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // SpeechRecognition instance
  const recognition = useRef<any>(null);

  // Set up SpeechRecognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "he-IL"; // Set language to Hebrew
      recognition.current.continuous = true;
      recognition.current.interimResults = false;

      recognition.current.onstart = () => {
        console.log("Speech Recognition started...");
        setIsListening(true);
      };

      recognition.current.onend = () => {
        console.log("Speech Recognition stopped.");
        setIsListening(false);
      };

      recognition.current.onerror = (event: { error: any }) => {
        console.error("Speech Recognition error:", event.error);
        setIsListening(false);
      };

      recognition.current.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const spokenText = lastResult[0].transcript;
        console.log("Spoken text:", spokenText);

        // Only process the text after "Hey Baroz"
        if (spokenText.toLowerCase().includes("הי")) {
          const questionText = spokenText.replace("הי", "").trim();
          getAnswerFromServer(questionText);
        }
      };
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, []);

  // Send question to the server to get the response
  const getAnswerFromServer = async (question: string) => {
    if (!question) return;

    setAllSteps((prevSteps) => {
      setCurrentStep((prevStep) => {
        httpVoiceAssistantResponse(prevStep, prevSteps, question, recipe)
          .then((response) => {
            if (!response) return;

            // Update the current step safely
            setCurrentStep(response.nextStep || prevStep);

            // Update allSteps only if they were not set before
            setAllSteps((prev) =>
              prev.length > 0 ? prev : response.allSteps || prev
            );

            if (response.audio) {
              const audioBlob = new Blob(
                [
                  new Uint8Array(
                    atob(response.audio)
                      .split("")
                      .map((c) => c.charCodeAt(0))
                  ),
                ],
                { type: "audio/mp3" }
              );
              const audioUrl = URL.createObjectURL(audioBlob);
              setAudioSrc(audioUrl);
            }
          })
          .catch((error) => console.error("Error fetching response:", error));

        return prevStep; // Keep previous step during async execution
      });

      return prevSteps; // Keep previous steps during async execution
    });
  };

  const startListening = () => {
    if (recognition.current) {
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  // Fetch all recipe steps when the component first mounts
  useEffect(() => {
    const fetchRecipeSteps = async () => {
      try {
        const steps = await httpRecipeSteps(recipe.method);
        if (steps) {
          setAllSteps(steps);
          setCurrentStep(steps[0]);
        }
      } catch (error) {
        console.error("Error fetching recipe steps:", error);
      }
    };

    fetchRecipeSteps();
  }, [recipe.id]); // Runs only when `recipe.id` changes

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.load(); // Reload the audio element
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
  }, [audioSrc]); // Trigger effect when audioSrc changes

  return (
    <div>
      <h3>Current Step: {currentStep}</h3>
      <button onClick={startListening} disabled={isListening}>
        {isListening ? "Listening..." : "Start Listening"}
      </button>
      {audioSrc && (
        <audio ref={audioRef} controls>
          <source src={audioSrc} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default RecipeAssistant;
