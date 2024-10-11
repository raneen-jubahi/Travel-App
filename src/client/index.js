import "./public/styles/styles.scss";
import { handleSubmit } from "./scripts/handleform";

// Attach event listener for form submission
document.getElementById('tripForm').addEventListener('submit', handleSubmit);

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

// Export for potential testing or future use
export { handleSubmit };
