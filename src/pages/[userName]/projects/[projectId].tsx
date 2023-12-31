'use client';
import { useEffect, type ReactElement, useState } from 'react';
import { RootState } from '@/redux/store';
import { ProjectData } from '@/types/typedefs';
import { NextPageWithLayout } from '@/pages/_app';
import NestedLayout from '@/components/NestedLayout';
import FrameworkDashboard from '@/components/FrameworkDashboard';
import Layout from '@/components/Layout';
import TodoList from '@/components/TodoList';
import { useSelector } from 'react-redux';
import ModelDashboard from '@/components/ModelDashboard';
import ColorsDashboard from '@/components/ColorsDashboard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAuth, useUser } from '@clerk/nextjs';
import { Auth } from '@/types/Auth';
import { getProjectById } from '@/services/projectsService';
import { addCurrentProject } from '@/redux/currentProjectSlice';
import { useRouter } from 'next/router';
import SummaryDashboard from '@/components/SummaryDashboard';

const Page: NextPageWithLayout = () => {
  let [project, setProject] = useState<ProjectData>({
    id: '',
    summary: '',
    idea: '',
    title: '',
    frontend: {
      todoList: [
        {
          id: '',
          title: '',
          done: false,
          createdAt: 0,
        },
      ],
      framework: {
        name: '',
        whyGoodOption: '',
        description: '',
        link: '',
      },
      colorScheme: {
        whyGoodOption: '',
        colorPalette: {
          colors: [],
        },
      },
    },
    backend: {
      todoList: [
        {
          id: '',
          title: '',
          done: false,
          createdAt: '',
        },
      ],
      framework: {
        name: '',
        whyGoodOption: '',
        description: '',
        link: '',
      },
      database: {
        name: '',
        whyGoodOption: '',
        description: '',
        link: '',
        schema: '',
      },
    },
    createdAt: 0,
  });

  const select: string = useSelector((state: RootState) => state.selected);
  const router = useRouter();
  const id = router.query.projectId;
  const { user } = useUser();
  const dispatch = useAppDispatch();
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

  let currentProjectFromRedux = useAppSelector((state: RootState) => state.currentProject);

  useEffect(() => {
    if (user && project.idea === '') {
      getProject(auth, id!).then((res) => {
        project = res;
        setProject(res);
        dispatch(addCurrentProject(res));
      });
    }
    setProject(currentProjectFromRedux);
  }, [user]);

  async function getProject(auth: Auth, id: string | string[]) {
    return await getProjectById(auth, id!);
  }

  if (project && select === 'todosBE') {
    return <TodoList />;
  } else if (select === 'frameworkBE') {
    return <FrameworkDashboard />;
  } else if (select === 'model') {
    return <ModelDashboard model={project.backend.database} />;
  } else if (select === 'todosFE') {
    return <TodoList />;
  } else if (select === 'frameworkFE') {
    return <FrameworkDashboard />;
  } else if (select === 'colors') {
    return <ColorsDashboard colorScheme={project.frontend.colorScheme} />;
  } else if (select === 'overview' || select === '') {
    return <SummaryDashboard project={project} />;
  } else {
    return <p>404</p>
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
