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
  keyframes,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { httpRecipeSteps } from "../../../../hooks/requests";
import { Recipe } from "../../../../models/recipe.model";
import { useVoiceAssistantResponse } from "../../../../queries/mutations/useVoiceAssistantResponse";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

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
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const currentStepRef = useRef<string>("");
  const allStepsRef = useRef<string[]>([]);
  const manuallyStopped = useRef<boolean>(false);
  const recognition = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const {
    mutate: voiceAssistantResponse,
    isPending: voiceAssistantResponseLoading,
  } = useVoiceAssistantResponse({
    onSuccess: (response: any) => {
      handleResponse(response);
    },
  });

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
      setIsListening(true);
      resetInactivityTimer();
    };

    instance.onend = () => {
      setIsListening(false);
      setIsSpeaking(false);
      if (!manuallyStopped.current) {
        try {
          instance.start();
        } catch (e) {
          console.warn("Restart error:", e);
        }
      }
    };

    instance.onerror = () => {
      setIsListening(false);
      setIsSpeaking(false);
    };

    instance.onspeechstart = () => {
      setIsSpeaking(true);
    };

    instance.onspeechend = () => {
      setIsSpeaking(false);
    };

    instance.onresult = (event: any) => {
      resetInactivityTimer();
      const lastResult = event.results[event.results.length - 1];
      const spokenText = lastResult[0].transcript;
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

    voiceAssistantResponse({
      currentStep: currentStepRef.current,
      allSteps: allStepsRef.current,
      question,
      recipe,
    });
  };

  const handleResponse = (response: any) => {
    try {
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

  const handleCloseDilaog = () => {
    stopListening();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDilaog} fullWidth maxWidth="sm">
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
        <IconButton onClick={handleCloseDilaog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 4 }}>
        {!isSupported ? (
          <Typography color="error">הדפדפן שלך לא תומך בזיהוי קולי.</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              שלב נוכחי
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {currentStep || <CircularProgress size={20} />}
            </Typography>

            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <IconButton
                onClick={
                  voiceAssistantResponseLoading
                    ? undefined
                    : isListening
                    ? stopListening
                    : startListening
                }
                sx={{
                  backgroundColor: isListening ? "error.main" : "primary.main",
                  color: "white",
                  width: 80,
                  height: 80,
                  animation: isSpeaking ? `${pulse} 1.5s infinite` : "none",
                  opacity: voiceAssistantResponseLoading ? 0.7 : 1,
                  pointerEvents: voiceAssistantResponseLoading
                    ? "none"
                    : "auto",
                  "&:hover": {
                    backgroundColor: isListening
                      ? "error.dark"
                      : "primary.dark",
                  },
                }}
              >
                {voiceAssistantResponseLoading ? (
                  <CircularProgress size={36} sx={{ color: "white" }} />
                ) : isListening ? (
                  <StopIcon fontSize="large" />
                ) : (
                  <MicIcon fontSize="large" />
                )}
              </IconButton>

              {voiceAssistantResponseLoading && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  רק רגע...
                </Typography>
              )}
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
