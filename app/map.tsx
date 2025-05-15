import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// images / icons
import ArrowIcon from "@/assets/icons/black-arrow.png";

// constants
import { colors } from "../constants/colors";

// modals
import SignalMapModal from "@/components/modals/SignalMapModal";
import SignalModal from "@/components/modals/SignalModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import RouteModal from "../components/modals/RouteModal";

// API
import { sendResponse } from "@/api/responsesApi";
import {
  acceptSignal,
  cancelSignal,
  deleteSignal,
  getAllSignals,
  getMySignals,
} from "../api/signalApi";
import { endWalkSession, startWalkSession } from "../api/walkSessionApi";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  clearActiveSession,
  setActiveSession,
} from "../redux/slices/sessionSlice";
import { setWalkStatus } from "../redux/slices/walkSlice";
import { RootState } from "../redux/store";

/**
 * <TODO>
 * 추천 루트와 modal이 함께 뜨지 않는 문제 (새로고침 시 루트 사라지고 modal이 뜸)
 * accept한 signal 마커가 바로 지도에 나타나지 않는 문제
 * 
 * <TODO - later>
 * 내가 응답한 IN_PROGRESS 시그널 다르게 표시하기 (Figma와 똑같이 구현하기에는 google map url 문제가 있어서 조금 어려워 보임) 
 * 왜 산책로 루트 안뜨는지 - google 맵 데이터에 있는 도보 경로 좌표만 루트 표시 가능

 * <주석 type에 대한 설명>
 * HACK : 추후 수정 필요
 * FIXME : 당장 수정 필요
 */

interface Signal {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  createdAt: string;
  timeLimit: number;
  status: string;
  selectedUserId: number;
  expiresAt: string;
}

interface SignalModalProps {
  visible: boolean;
  onPress: (signalId: number) => void;
  onClose: () => void;
  data: {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    categoryId: number;
    expiresAt: string;
  };
  buttonText: string;
  isAccept: boolean;
  message?: string;
  setMessage?: (msg: string) => void;
}

export default function MapScreen() {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null); // 선택된 signal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 모달 창 표시 여부
  const [signalList, setSignalList] = useState<Signal[]>([]); // 현재 signal 리스트 상태
  const [myProgressSignals, setMyProgressSignals] = useState<Signal[]>([]); // 내가 응답한 IN_PROGRESS 시그널
  const [routeModalVisible, setRouteModalVisible] = useState(true); // RouteModal 표시 여부
  const [isWalking, setIsWalking] = useState(false); // 산책 중 여부
  const [signalModalVisible, setSignalModalVisible] = useState(false);
  const [signalMapModalVisible, setSignalMapModalVisible] = useState(false);
  const [selectedInProgressSignal, setSelectedInProgressSignal] =
    useState<Signal | null>(null);
  // const [activeSession, setActiveSession] = useState<Session | null>(null); // 활성화된 산책 세션
  const [sessionId, setSessionId] = useState<number | null>(null); // 세션 ID
  const [routeDetails, setRouteDetails] = useState<{
    distance: string | null;
    themeId: number | null;
  }>({ distance: null, themeId: null });
  const [signalModalType, setSignalModalType] = useState<
    "accept" | "responded"
  >("accept");
  const [responseMessage, setResponseMessage] = useState("");

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // const [directions, setDirections] =
  //   useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.544582,
    lng: 127.037589,
  });
  const [userData, setUserData] = useState<{
    userId: number;
    nickname: string;
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  // themeId, distance 가져오기
  const { distance, themeId } = useLocalSearchParams();
  const parsedDistance = distance ? JSON.parse(distance as string) : null;
  const parsedTheme = themeId ? JSON.parse(themeId as string) : null;

  // call the recommended route through redux
  const recommendedRoute = useSelector(
    (state: RootState) => state.route?.recommendedRoute
  );

  const activeSession = useSelector(
    (state: RootState) => state.session.activeSession
  );

  // call the current walk status through redux
  const walkStatus = useSelector((state: RootState) => state.walk.status);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  // 현재 위치 추적
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted" || !isLoaded) {
        console.log("Permission to access location was denied");
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (location) {
          const { latitude, longitude } = location.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        }
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    }
    getCurrentLocation();
  }, [isLoaded]);

  // PENDING 시그널 데이터 가져오기
  useEffect(() => {
    // 최초 1회 즉시 실행
    const fetchSignals = async () => {
      try {
        const signals = await getAllSignals();
        setSignalList(signals);
      } catch (error) {
        console.error(
          "PENDING 시그널 데이터를 가져오는데 실패했습니다:",
          error
        );
      }
    };

    fetchSignals(); // mount 시 1회

    // 1초마다 polling
    const interval = setInterval(fetchSignals, 1000);

    // 사용자 데이터 가져오기
    const fetchUserDataAndSession = async () => {
      try {
        // 사용자 정보 가져오기
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);

          // 활성화된 산책 세션 확인
          // const session = await getActiveWalkSession(parsedData.userId);
          // if (session && session.id) {
          //   setActiveSession(session);
          //   setSessionId(session.id);
          //   setIsWalking(true);
          //   setRouteModalVisible(false);
          // } else {
          //   setActiveSession(null);
          //   setIsWalking(false);
          //   setRouteModalVisible(true); // RouteModal(혹은 SignalModal) 표시
          // }
        }
      } catch (error) {
        console.error("유저/세션 데이터 가져오기 실패:", error);
      }
    };
    if (walkStatus === "IN_PROGRESS") {
      setRouteModalVisible(false);
    }
    console.log(activeSession);
    if (activeSession) {
      setIsWalking(true);
    }

    fetchUserDataAndSession();

    // 언마운트 시 인터벌 해제
    return () => {
      clearInterval(interval);
    };
  }, []);

  // 내가 응답한 IN_PROGRESS 시그널 데이터 가져오기
  useEffect(() => {
    const fetchMySignals = async () => {
      if (!userData?.userId) return;

      try {
        const mySignals = await getMySignals(userData.userId);
        setMyProgressSignals(mySignals);
      } catch (error) {
        console.error(
          "내가 응답한 IN_PROGRESS 시그널 데이터를 가져오는데 실패했습니다:",
          (error as any)?.response || error
        );
      }
    };

    fetchMySignals();
  }, [userData]);

  // recommendedRoute가 변경될 때마다 경로와 지도 중심 업데이트
  // useEffect(() => {
  // if (!isLoaded || !recommendedRoute) return;

  // const directionsService = new window.google.maps.DirectionsService();

  // destination의 lat, lng에 각각 0.5001을 더함
  // const adjustedDestination = {
  //   lat: recommendedRoute.destination.lat + 0.5001,
  //   lng: recommendedRoute.destination.lng + 0.5001,
  // };

  // const directionsRequest = {
  //   origin: recommendedRoute.origin,
  //   destination: adjustedDestination,
  //   // waypoints: recommendedRoute.waypoints,
  //   travelMode: google.maps.TravelMode.WALKING,
  // };

  //   directionsService.route(directionsRequest, (result, status) => {
  //     if (status === "OK" && result) {
  //       setDirections(result);
  //       setMapCenter(recommendedRoute.origin);
  //     } else {
  //       console.error("DirectionsService 실패:", status);
  //       console.error("요청한 경로:", directionsRequest);
  //     }
  //   });
  // }, [recommendedRoute, isLoaded]);

  // // DirectionsService 요청 결과 처리
  // const directionsCallback = (
  //   result: google.maps.DirectionsResult | null,
  //   status: google.maps.DirectionsStatus
  // ) => {
  //   if (status === "OK" && result) {
  //     setDirections(result);
  //   }
  // };

  // PENDING 마커 클릭 시
  const handlePendingMarkerClick = (signal: Signal) => {
    setSelectedSignal(signal);
    setSignalModalType("accept");
    setSignalModalVisible(true);
  };

  // IN_PROGRESS 마커 클릭 시
  const handleInProgressMarkerClick = (signal: Signal) => {
    setSelectedInProgressSignal(signal);
    setSignalMapModalVisible(true);
  };

  // signal 수락 시 상태를 "IN_PROGRESS"로 변경
  const handleAccept = async () => {
    if (!selectedSignal || !userData?.userId) return;

    try {
      await acceptSignal(selectedSignal.id, {
        userId: userData.userId,
        message: responseMessage,
      });

      setSignalList((prev) =>
        prev.map((s) =>
          s.id === selectedSignal.id ? { ...s, status: "IN_PROGRESS" } : s
        )
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Signal 수락 실패:", error);
      // TODO: 사용자에게 오류 안내 UI 필요 시 처리
    }
  };

  // Handle modal cancel/close
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Return icon URL based on signal type
  const getIcon = (categoryId: number) => {
    const baseUrl =
      "https://raw.githubusercontent.com/HEEKGH/EARTHBEAT-assets/main/";

    switch (categoryId) {
      case 1: // 'Water Plants / Plant - Related'
        return `${baseUrl}category-plant.png`;
      case 2: // 'Repair / Tools'
        return `${baseUrl}category-repair.png`;
      case 3: // 'Delivery'
        return `${baseUrl}category-delivery.png`;
      case 4: // 'Catch the Bug'
        return `${baseUrl}category-bug.png`;
      case 5: // 'Translate'
        return `${baseUrl}category-translate.png`;
      case 6: // 'Pet-Related'
        return `${baseUrl}category-pet.png`;
      case 7: // 'Lend / Borrow Batteries'
        return `${baseUrl}category-battery.png`;
      case 8: // 'Lost & Found'
        return `${baseUrl}category-find.png`;
      case 9: // 'Take picture(s)'
        return `${baseUrl}category-picture.png`;
      case 10: // 'etc.'
        return `${baseUrl}category-etc.png`;
      default:
        return `${baseUrl}category-default.png`;
    }
  };

  // RouteModal의 Take Route 버튼 핸들러 - routeId BE에서 받아온 이후 사용
  const handleTakeRoute = async () => {
    if (!userData?.userId || !recommendedRoute?.id) return;
    try {
      const session = await startWalkSession({
        userId: userData.userId,
        routeId: recommendedRoute.id,
      });
      dispatch(setActiveSession(session));
      // setActiveSession(session);
      setSessionId(session.id);
      setRouteModalVisible(false);
      setIsWalking(true);
      setShowConfirmModal(true);
      // Store session in redux (NO GET request needed for active walk sessions)
    } catch (error) {
      console.error("산책 시작에 실패했습니다:", error);
    }
  };

  // 경로 좌표 배열 생성 함수
  const getRoutePath = () => {
    if (!recommendedRoute) return [];
    const path = [];
    if (recommendedRoute.origin) path.push(recommendedRoute.origin);
    if (Array.isArray(recommendedRoute.waypoints)) {
      recommendedRoute.waypoints.forEach((wp) => {
        if (wp.location) path.push(wp.location);
      });
    }
    if (recommendedRoute.destination) path.push(recommendedRoute.destination);
    return path;
  };

  const handleAcceptSignal = async (signalId: number) => {
    if (!selectedSignal || !userData?.userId) return;
    try {
      const body = {
        userId: userData.userId,
        message: responseMessage,
      };
      console.log("acceptSignal body:", body);
      await acceptSignal(signalId, body);
      setSignalModalVisible(false);
    } catch (error) {
      console.error("Signal 수락 실패:", error);
    }
  };

  const handleMarkasResponded = async () => {
    if (!selectedInProgressSignal) return;
    try {
      const responseData = { message: responseMessage };
      await sendResponse(selectedInProgressSignal.id, responseData);
      console.log("보내는 메시지:", responseMessage);
      setResponseMessage(""); // 전송 후 초기화
    } catch (error) {
      console.error("응답 완료 처리 실패:", error);
    }
    setSelectedSignal(selectedInProgressSignal);
    setSignalModalType("responded");
    setSignalModalVisible(true);
    setSelectedInProgressSignal(null);
  };

  const handleCancelSignal = async () => {
    if (!selectedInProgressSignal) return;
    try {
      await cancelSignal(selectedInProgressSignal.id, userData);
      setSelectedInProgressSignal(null); // 모달 닫기 등 후처리
    } catch (error) {
      console.error("Signal 취소 실패:", error);
    }
  };

  const handleFinishWalk = async () => {
    if (!activeSession?.id || !userData?.userId) return;
    try {
      await endWalkSession(activeSession.id, { userId: userData.userId });
      dispatch(clearActiveSession());
      setIsWalking(false);
      // setActiveSession(null);
      setSessionId(null);
      // 홈으로 이동
      router.replace("/home");
    } catch (error) {
      console.error("산책 종료 실패:", error);
    }
  };

  const handleBack = () => {
    // If there's an active session, set the status before going back
    if (activeSession) {
      dispatch(setWalkStatus("IN_PROGRESS"));
    }
    router.back();
  };

  const handleSignalExpired = async (signalId: number) => {
    // setExpiredSignals((prev) => new Set([...prev, signalId]));
    // // You can also update the signal's status in your signalList here if needed
    // setSignalList((prev) =>
    //   prev.map((signal) =>
    //     signal.id === signalId ? { ...signal, status: "EXPIRED" } : signal
    //   )
    // );
    if (signalId) {
      try {
        const deleted = await deleteSignal(signalId, userData?.userId);
        console.log("deleted!", deleted);
      } catch (error) {
        console.error("Error marking expired signals as expired");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {/* Update the back button to use handleBack */}
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Image source={ArrowIcon} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>

        {/* Finish Walk 버튼: 산책 중일 때만 표시 */}
        {isWalking && (
          <TouchableOpacity style={styles.finishBtn} onPress={handleFinishWalk}>
            <Text style={styles.finishBtnText}>Finish Walk</Text>
          </TouchableOpacity>
        )}

        <Image
          source={require("../assets/images/user-head.png")}
          style={styles.userIcon}
        />
      </View>

      {/* map */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={16}
          options={{
            disableDefaultUI: true,
            zoomControl: false,
            scaleControl: true,
            gestureHandling: "greedy", // 모바일에서 제스처 허용
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* 현재 위치 마커 */}
          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                url: "https://raw.githubusercontent.com/HEEKGH/EARTHBEAT-assets/main/user-location.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          )}

          {/* PENDING 시그널 마커 */}
          {signalList.map((signal) => (
            <Marker
              key={`pending-${signal.id}`}
              position={{ lat: signal.lat, lng: signal.lng }}
              onClick={() => handlePendingMarkerClick(signal)}
              icon={{
                url: getIcon(signal.categoryId),
                scaledSize: new window.google.maps.Size(80, 80),
              }}
            />
          ))}

          {/* IN_PROGRESS 시그널 마커 */}
          {myProgressSignals.map((signal) => (
            <Marker
              key={`my-${signal.id}`}
              position={{ lat: signal.lat, lng: signal.lng }}
              onClick={() => handleInProgressMarkerClick(signal)}
              icon={{
                url: getIcon(signal.categoryId),
                scaledSize: new window.google.maps.Size(120, 120),
              }}
            />
          ))}

          {/* Polyline으로 경로 표시 */}
          {recommendedRoute && (
            <Polyline
              path={getRoutePath()}
              options={{
                strokeColor: "#336666",
                strokeOpacity: 0.8,
                strokeWeight: 5,
              }}
            />
          )}
        </GoogleMap>
      )}

      {/* RouteModal: 처음에만 표시, Take Route 누르면 닫힘 - routeId BE에서 받아온 이후 사용 */}
      {routeModalVisible && (
        <RouteModal
          themeId={parsedTheme}
          distance={parsedDistance}
          onPress={() => {
            handleTakeRoute();
          }}
        />
      )}

      <ConfirmModal
        message={"Walk started!"}
        isVisible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      {/* SignalModal: 처음에만 표시, Accept 누르면 닫힘 */}
      {signalModalVisible && selectedSignal && (
        <SignalModal
          visible={true}
          onPress={handleAcceptSignal}
          onClose={() => setSignalModalVisible(false)}
          data={{
            id: selectedSignal.id,
            title: selectedSignal.title,
            description: selectedSignal.description,
            createdAt: selectedSignal.createdAt,
            categoryId: selectedSignal.categoryId,
            expiresAt: selectedSignal.expiresAt,
          }}
          buttonText={
            signalModalType === "accept" ? "Accept" : "Mark as Responded"
          }
          isAccept={signalModalType === "accept"}
          handleExpired={handleSignalExpired}
        />
      )}

      {/* SignalMapModal */}
      {selectedInProgressSignal && (
        <SignalMapModal
          onRespond={handleMarkasResponded}
          onCancel={handleCancelSignal}
          data={{
            id: selectedInProgressSignal.id,
            title: selectedInProgressSignal.title,
            description: selectedInProgressSignal.description,
            createdAt: selectedInProgressSignal.createdAt,
            categoryId: selectedInProgressSignal.categoryId,
            expiresAt: selectedInProgressSignal.expiresAt,
          }}
        />
      )}
    </View>
  );
}

// Define styles for the screen
const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderBottomLeftRadius: -20,
    borderBottomRightRadius: -20,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 8,
    borderRadius: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  finishBtn: {
    backgroundColor: colors.green.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  finishBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  userIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
  },
});
