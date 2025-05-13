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
