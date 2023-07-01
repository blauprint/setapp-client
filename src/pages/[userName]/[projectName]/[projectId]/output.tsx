import { useEffect, type ReactElement, useState } from "react";
import { RootState } from "@/redux/store";
import { ProjectData } from "@/types/typedefs";
import { NextPageWithLayout } from "@/pages/_app";
import NestedLayout from "@/components/NestedLayout";
import FrameworkDashboard from "@/components/FrameworkDashboard";
import Layout from "@/components/Layout";
import TodoList from "@/components/TodoList";
import { useSelector } from "react-redux";
import ModelDashboard from "@/components/ModelDashboard";
import ColorsDashboard from "@/components/ColorsDashboard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useAuth, useUser } from "@clerk/nextjs";
import { Auth } from "@/types/Auth";
import { getProjectById } from "@/services/projectsService";
import { addCurrentProject } from "@/redux/currentProjectSlice";


const Page: NextPageWithLayout = () => {

  let [project, setProject] = useState<ProjectData>({
    id: '',
    userId: '',
    summary: '',
    idea: '',
    title: '',
    forontendId: '',
    frontend: {
      id: '',
      todoList: [],
      frameworkId: '',
      framework: {
        name: '',
        whyGoodOption: '',
        description: '',
        link: ''
      },
      colorSchemeId: '',
      colorScheme: {
        whyGoodOption: '',
        colorPalette: {
          color: []
        }
      },
    },
    backendId: '',
    backend: {
      id: '',
      todoList: [],
      frameworkId: '',
      framework: {
        name: '',
        whyGoodOption: '',
        description: '',
        link: ''
      },
      databaseId: '',
      database: {
        name: '',
        whyGoodOption: '',
        description: '',
        link: '',
        schema: ''
      },
    },
    createdAt: 0
  });
  let select: string = useSelector((state: RootState) => state.selected);
  let url = '';
  let id = '';
  const { user } = useUser();
  let dispatch = useAppDispatch();
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

  useEffect(() => {
    url = window.location.href;
    id = (url.match(/\/\w+\/(\w+)\/output/) || [])[1] || '';
    // console.log(url);
    // console.log(id);

    if (user && project.idea === "") {
      getProject(auth, id.toString()).then((res) => {
        // console.log(res, 'res');
        setProject(res);
        dispatch(addCurrentProject(res));
      })
    }
  }, [user])

  useState(useAppSelector((state: RootState) => state.currentProject));

  async function getProject(auth: Auth, id: string) {
    return await getProjectById(auth, id);
  }


  if (project && select === "todosBE") {
    return <TodoList todos={project.backend.todoList} />;
  } else if (select === "frameworkBE") {
    return <FrameworkDashboard framework={project.backend.framework} />;
  } else if (select === "model") {
    return <ModelDashboard model={project.backend.database} />;
  } else if (select === "todosFE") {
    return <TodoList todos={project.frontend.todoList} />;
  } else if (select === "frameworkFE") {
    return <FrameworkDashboard framework={project.frontend.framework} />;
  } else if (select === "colors") {
    return <ColorsDashboard colorScheme={project.frontend.colorScheme} />;
  } else {
    return (
      <>
        <div>{project.idea}</div>
        <div>{project.summary}</div>
      </>
    );
  }
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

export default Page;
