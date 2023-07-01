"use client";
import { useRef, useState, useEffect } from "react";
import styles from "@/styles/IdeaInputForm.module.css";
import { BiSend } from "react-icons/bi";
import { ProjectData } from "@/types/typedefs";
import { Auth } from "@/types/Auth";
import { useCompletion } from "ai/react";
import { useAppDispatch } from "@/redux/hooks";
import { addNewProject, addProjects } from "@/redux/projectsSlice";
import Spinner from "./Spinner";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { addCurrentProject } from "@/redux/currentProjectSlice";
import { postProjects } from "@/services/projectsService";
// import * as Yup from "yup";
// import dynamic from "next/dynamic";

// const formSchema = Yup.object().shape({
//   idea: Yup.string().required("Tell me your idea for an app."),
// });

export default function IdeaInputForm() {
  const [cardData, setCardData] = useState<ProjectData | null>(null);
  let dispatch = useAppDispatch();
  // CLERK AUTH
  const { user } = useUser();
  const {
    userId,
    sessionId,
    isLoaded,
    getToken,
    isSignedIn,
    signOut,
    orgId,
    orgRole,
    orgSlug,
  } = useAuth();


  const auth: Auth = {
    userId: userId?.toString(),
    sessionId: sessionId?.toString(),
    sessionToken: getToken,
    isLoaded: isLoaded,
    isSignedIn: isSignedIn,
    signOut: signOut,
    orgId: orgId?.toString(),
    orgRole: orgRole?.toString(),
    orgSlug: orgSlug?.toString(),
  };


  const router = useRouter();
  let projectName: string = '';
  let projectId: string = '';

  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    completion,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/chat/openai_api",
    onError: handleError,
    onResponse: handleResponse,
    onFinish: handleFinish,
  });

  // ***********
  // WORK IN PROGRESS!
  // The idea is to dynamically import components based on the completion.
  // The components would be cards that display the project data as it is being generated.
  // ***********
  // const DynamicSummaryCard = dynamic(() => import("@/components/SummaryCard"));
  // const DynamicColorCard = dynamic(() => import("@/components/ColorCard"));
  // const DynamicFrameworkCard = dynamic(
  //   () => import("@/components/FrameworkCard")
  // );
  // const DynamicModelCard = dynamic(() => import("@/components/ModelCard"));
  // const DynamicToDoList = dynamic(() => import("@/components/ToDoList"));

  // ***********

  // Handler functions

  function handleError(error: Error) {
    console.error(error);
  }

  function handleResponse(response: Response) {
    if (formRef.current) {
      formRef.current.style.translate = "0 -100vh";
      formRef.current.style.filter = "blur(10px)";
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.display = "none";
        }
      }, 1000);
    }
  }

  async function handleFinish(prompt: string, completion: string) {
    console.log("Finished completion!");
    console.log("Completion:", completion);
    console.log("Prompt:", prompt);
    try {
      const projectJson: ProjectData = await JSON.parse(`{${completion}`);
      projectJson.idea = prompt;
      dispatch(addNewProject(projectJson));
      dispatch(addCurrentProject(projectJson));

      setCardData(projectJson);
      await postProjects(auth, projectJson);
      projectName = projectJson.title;
      projectId = projectJson.id;

      const url = `/${user?.username ? user.username : user?.firstName}/${projectName}/${projectId}/output`;
      router.push(url);
    } catch (error) {
      console.error(error);
    }
  }

  // ***********
  // Regex functions

  async function regexDataExtractor(data: string) {
    //WORK IN PROGRESS
    let projectNameRegex = /"projectName":\s*"([^"]*)"/;
    let toDoListRegex = /"toDoList":\s*\[\s*"([^"]*)"\s*\]/;
    let summaryRegex = /"summary":\s*"([^"]*)"/;
    let frontendRegex = /"frontend":\s*{([^}]*)}/;
    let backendRegex = /"backend":\s*{([^}]*)}/;

    //TODO: memoize regexes
    let regexes: RegExp[] = [
      summaryRegex,
      projectNameRegex,
      toDoListRegex,
      frontendRegex,
      backendRegex,
    ];

    while (regexes.length > 0 && isLoading) {
      let regex = regexes.pop();
      if (regex) {
        let match = data.match(regex);
        if (match) {
          console.log(match);
        }
      }
    }

    if (projectNameRegex.test(data)) {
      let projectName = data.match(projectNameRegex);
      console.log(projectName);
    }
  }

  // ***********

  useEffect(() => {
    // regexDataExtractor(completion);
    console.log(completion);
  }, [completion]);

  // const projectName = "seismica";

  return (
    <>
      <div className={styles.inputContainer}>
        {!isLoading && (
          <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
            <textarea
              className={styles.ideaTextArea}
              // ref={textAreaRef}
              autoFocus={true}
              onChange={handleInputChange}
              value={input}
              name="idea"
              rows={1}
              id="idea"
              required={true}
              autoComplete="off"
            ></textarea>
            {/* <DynamicSummaryCard summary={cardData?.summary} /> */}
            {/* <DynamicColorCard colorScheme={cardData?.frontend.colorScheme} /> */}
            {/* <DynamicFrameworkCard framework={cardData?.frontend.framework} /> */}
            {/* <DynamicModelCard model={cardData?.backend.database} /> */}
            {/* <DynamicToDoList todos={cardData?.frontend.toDoList} /> */}
            {/* <DynamicToDoList todos={cardData?.backend.toDoList} /> */}
            <label className={styles.ideaLabel} htmlFor="name">
              <span className={styles.ideaSpan}>Type in your app idea....</span>
            </label>
            <button type="submit" className={styles.sendBtn}>
              <BiSend />
            </button>
          </form>
        )}
        {isLoading && (
          <div className={styles.spinnerContainer}>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}
