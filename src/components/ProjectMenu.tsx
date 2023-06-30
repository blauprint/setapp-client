import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/ProjectMenu.module.css';

type MenuProps = {
  onButtonClick: (componentName: string) => void;
};

export default function ProjectMenu({ onButtonClick }: MenuProps) {
  function handleClick(componentName: string) {
    onButtonClick(componentName);
  }

  return (
    <>
      <div className={styles.menu}>
        <button className={styles.menuButton} onClick={() => handleClick('')}>
          Summary
        </button>
        <div>
          <Accordion className={styles.accordion} defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.expandIcon} />}
              aria-controls="backend"
              id="backend-panel"
            >
              <div className={styles.accordionTitle}>Backend</div>
            </AccordionSummary>
            <AccordionDetails>
              <button
                className={styles.menuButton}
                onClick={() => handleClick('todosBE')}
              >
                To-do
              </button>
              <button
                className={styles.menuButton}
                onClick={() => handleClick('frameworkBE')}
              >
                Framework
              </button>
              <button
                className={styles.menuButton}
                onClick={() => handleClick('model')}
              >
                Model
              </button>
            </AccordionDetails>
          </Accordion>
        </div>

        <div>
          <Accordion className={styles.accordion} defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className={styles.expandIcon} />}
              aria-controls="frontend"
              id="frontend-panel"
            >
              <div className={styles.accordionTitle}>Frontend</div>
            </AccordionSummary>
            <AccordionDetails>
              <button
                className={styles.menuButton}
                onClick={() => handleClick('todosFE')}
              >
                To-do
              </button>
              <button
                className={styles.menuButton}
                onClick={() => handleClick('frameworkFE')}
              >
                Framework
              </button>
              <button
                className={styles.menuButton}
                onClick={() => handleClick('colors')}
              >
                Color Schema
              </button>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </>
  );
}
