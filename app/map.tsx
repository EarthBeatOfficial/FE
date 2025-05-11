import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function NicknameScreen() {
  const router = useRouter();
  // call the recommended route through redux
  const recommendedRoute = useSelector(
    (state: RootState) => state.route.recommendedRoute
  );

  return <>{/* import google map API, etc. */}</>;
}
