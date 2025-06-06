export interface User {
  id: number;
  name: string;
}

export interface WalkLog {
  distance: number;
  walkedAt: string;
  theme: {
    id: number;
    name: string;
  };
  respondedSignals: {
    title: string;
    description: string;
    categoryId: number;
    category: string;
    respondedAt: string;
  }[];
}

export const DefaultSignalData = {
  title: "",
  description: "",
  lat: null,
  lng: null,
  timeLimit: 10, // default 10 minutes
  categoryId: null,
};

export interface Route {
  id: number;
  userId: number;
  distance: number;
  themeId: number;
  createdAt: string;
  completedAt: string | null;
}

export interface Session {
  id: number;
  userId: number;
  routeId: number;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  route: Route;
}
