import ProjectMenu from "@/components/ProjectMenu";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import styles from "@/styles/Output.module.css";
import { useReducer, useState } from "react";
import { store } from "@/redux/store";
import TodoList from "@/components/TodoList";
import ColorsDashboard from "@/components/ColorsDashboard";
import { ProjectData } from "@/types/typedefs";
import ModelDashboard from "@/components/ModelDashboard";
import FrameworkDashboard from "@/components/FrameworkDashboard";
import { useRouter } from "next/router";

export default function OutputPage() {
  const [selectedComponent, setSelectedComponent] = useState<string>("");

  const handleButtonClick = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  const project: ProjectData = store.getState().currentProject;
  let content = null;
  let router = useRouter();

  if (selectedComponent === "todosBE") {
    content = <TodoList todos={project.backend.toDoList} />
  } else if (selectedComponent === "frameworkBE") {
    content = <FrameworkDashboard framework={project.backend.framework} />;
  } else if (selectedComponent === "model") {
    content = <ModelDashboard model={project.backend.database} />;
  } else if (selectedComponent === "todosFE") {
    content = <TodoList todos={project.frontend.toDoList} />
  } else if (selectedComponent === "frameworkFE") {
    content = <FrameworkDashboard framework={project.frontend.framework} />
  } else if (selectedComponent === "colors") {
    content = <ColorsDashboard colorScheme={project.frontend.colorScheme} />;
  } else {
    content = (
      <>
        <div>{project.idea}</div>
        <div>{project.summary}</div>
      </>
    )
  }

  return (
    <>
      <SignedIn>
        <div className={styles.outputPage}>
          <ProjectMenu onButtonClick={handleButtonClick} />
          <div className={styles.outputContent}>{content}</div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
