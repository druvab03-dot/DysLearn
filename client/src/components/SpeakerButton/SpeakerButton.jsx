import { useTranslation } from "react-i18next";
import "./SpeakerButton.css";

function SpeakerButton({ text }) {
    const { i18n } = useTranslation();

    const speak = () => {
        if (!text) return;

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        switch (i18n.language) {
            case "kn":
                utterance.lang = "kn-IN";
                break;
            case "hi":
                utterance.lang = "hi-IN";
                break;
            default:
                utterance.lang = "en-IN";
        }

        const voices = speechSynthesis.getVoices();
        const matchedVoice = voices.find(
            (voice) =>
                voice.lang.toLowerCase().startsWith(
                    utterance.lang.toLowerCase().split("-")[0]
                )
        );

        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        speechSynthesis.speak(utterance);
    };

    return (
        <button
            type="button"
            className="speakerButton"
            onClick={speak}
            aria-label="Speak content"
        >
            🔊
        </button>
    );
}

export default SpeakerButton;