import styles from "./assets/spinner.module.css";

const Spinner = () => {
  return `
      <div class="${styles["dot-flashing"]}">
        <span></span>
        <span></span>
        <span></span>  
      </div>
`;
};

export default Spinner;
