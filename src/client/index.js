import "./public/styles/styles.scss";
import { handleSubmit } from "./scripts/handleform";

document.getElementById('tripForm').addEventListener('submit', handleSubmit);

export {
    handleSubmit
};
