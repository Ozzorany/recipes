import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import {
  httpRecipeSteps,
  httpVoiceAssistantResponse,
} from "../../../../hooks/requests";
import { Recipe } from "../../../../models/recipe.model";

interface RecipeAssistantProps {
  recipe: Recipe;
  open: boolean;
  onClose: () => void;
}

const RecipeAssistant: React.FC<RecipeAssistantProps> = ({
  recipe,
  open,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [allSteps, setAllSteps] = useState<string[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const currentStepRef = useRef<string>("");
  const allStepsRef = useRef<string[]>([]);
  const manuallyStopped = useRef<boolean>(false);
  const recognition = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      if (!manuallyStopped.current && recognition.current) {
        try {
          recognition.current.stop();
        } catch (e) {
          console.warn("Error forcing restart:", e);
        }
      }
    }, 10000);
  };

  const createRecognitionInstance = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const instance = new SpeechRecognition();

    instance.lang = "he-IL";
    instance.continuous = true;
    instance.interimResults = false;

    instance.onstart = () => {
      console.log("Started listening");
      setIsListening(true);
      resetInactivityTimer();
    };

    instance.onend = () => {
      console.log("Stopped listening");
      setIsListening(false);
      if (!manuallyStopped.current) {
        try {
          instance.start();
        } catch (e) {
          console.warn("Restart error:", e);
        }
      }
    };

    instance.onerror = (event: { error: any }) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
    };

    instance.onnomatch = () => console.warn("Speech not recognized");
    instance.onspeechend = () => console.log("Speech ended");

    instance.onresult = (event: any) => {
      resetInactivityTimer();
      const lastResult = event.results[event.results.length - 1];
      const spokenText = lastResult[0].transcript;
      console.log("You said:", spokenText);
      getAnswerFromServer(spokenText);
    };

    return instance;
  };

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      recognition.current = createRecognitionInstance();
    } else {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    allStepsRef.current = allSteps;
  }, [allSteps]);

  const getAnswerFromServer = async (question: string) => {
    if (!question) return;
    try {
      const response = await httpVoiceAssistantResponse(
        currentStepRef.current,
        allStepsRef.current,
        question,
        recipe
      );
      if (!response) return;
      if (response.nextStep) setCurrentStep(response.nextStep);
      if (response.allSteps && allSteps.length === 0)
        setAllSteps(response.allSteps);
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
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      manuallyStopped.current = false;
      try {
        recognition.current.start();
      } catch (error) {
        console.warn("Already started:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      manuallyStopped.current = true;
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      recognition.current.stop();
    }
  };

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
  }, [recipe.id]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      const audio = audioRef.current;

      setIsListening(false);
      stopListening();
      audio.load();

      audio.onended = () => {
        manuallyStopped.current = false;
        setTimeout(() => {
          recognition.current = createRecognitionInstance();
          recognition.current.start();
        }, 500);
      };

      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
  }, [audioSrc]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          label="Alpha"
          color="warning"
          size="small"
          sx={{
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        />
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 4 }}>
        {!isSupported ? (
          <Typography color="error">
            Your browser does not support speech recognition.
          </Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              שלב נוכחי
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {currentStep || <CircularProgress size={20} />}
            </Typography>

            <Box mt={4} display="flex" justifyContent="center">
              <IconButton
                onClick={isListening ? stopListening : startListening}
                sx={{
                  backgroundColor: isListening ? "error.main" : "primary.main",
                  color: "white",
                  width: 80,
                  height: 80,
                  "&:hover": {
                    backgroundColor: isListening
                      ? "error.dark"
                      : "primary.dark",
                  },
                }}
              >
                {isListening ? (
                  <StopIcon fontSize="large" />
                ) : (
                  <MicIcon fontSize="large" />
                )}
              </IconButton>
            </Box>

            {audioSrc && (
              <Box mt={3}>
                <audio ref={audioRef} controls style={{ width: "100%" }}>
                  <source src={audioSrc} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeAssistant;
