import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader
} from "@react-google-maps/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// images / icons
import ArrowIcon from "@/assets/icons/black-arrow.png";

// constants
import { colors } from "../constants/colors";

// modals
import RouteModal from "@/components/modals/RouteModal";

// API
import { getAllSignals, getMySignals } from "../api/signalApi";
import { startWalkSession } from "../api/walkSessionApi";

// import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * <TODO>
 * 왜 산책로 루트 안뜨는지
 * 모달 연결
 * 백엔드와 추가 연결
 * 내가 응답한 IN_PROGRESS 시그널 마커 다르게 표시하기 (Figma와 똑같이 구현하기에는 google map url 문제가 있어서 조금 어려워 보임) 
 * 
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

export default function MapScreen() {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null); // 선택된 signal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 모달 창 표시 여부
  const [signalList, setSignalList] = useState<Signal[]>([]); // 현재 signal 리스트 상태
  const [myProgressSignals, setMyProgressSignals] = useState<Signal[]>([]); // 내가 응답한 IN_PROGRESS 시그널
  const [routeModalVisible, setRouteModalVisible] = useState(true);
  const [isWalking, setIsWalking] = useState(false); // 산책 중 여부

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

  const router = useRouter();
  // call the recommended route through redux
  const recommendedRoute = useSelector(
    (state: RootState) => state.route?.recommendedRoute
  );

  const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string,
});

  // 현재 위치 추적
  useEffect(() => {
  if (!isLoaded || !navigator.geolocation) return;

  const watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
      setMapCenter({ lat: latitude, lng: longitude });
    },
    (err) => {
      console.warn("위치 정보를 가져올 수 없습니다.", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000, // 5초
    }
  );

  // cleanup 함수 반환
  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, [isLoaded]);


  // PENDING 시그널 데이터 가져오기
  useEffect(() => {
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
    // 사용자 데이터 가져오기
    const fetchUserData = async () => {
      try {
        // AsyncStorage에서 사용자 정보 가져오기
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error("사용자 데이터를 가져오는데 실패했습니다:", error);
      }
    };
    fetchSignals();
    fetchUserData();
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
          error
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

  // 마커 클릭 시
  const handleMarkerClick = (signal: Signal) => {
    setSelectedSignal(signal);
    setModalVisible(true);
  };

  // signal 수락 시 상태를 "accepted"로 변경
  const handleAccept = () => {
    if (!selectedSignal) return;
    setSignalList((prev) =>
      prev.map((s) =>
        s.id === selectedSignal.id ? { ...s, status: "IN_PROGRESS" } : s
      )
    );
    setModalVisible(false);
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

  // RouteModal의 Take Route 버튼 핸들러
  const handleTakeRoute = async () => {
    try {
      // userData 등 필요한 정보 전달
      await startWalkSession(userData); // userData는 이미 state에 있음
      setRouteModalVisible(false);
      setIsWalking(true);
    } catch (error) {
      console.error("산책 시작에 실패했습니다:", error);
      // 필요시 에러 안내
    }
  };

  // 경로 좌표 배열 생성 함수
  const getRoutePath = () => {
    if (!recommendedRoute) return [];
    const path = [];
    if (recommendedRoute.origin)
      path.push(recommendedRoute.origin);
    if (Array.isArray(recommendedRoute.waypoints)) {
      recommendedRoute.waypoints.forEach((wp) => {
        if (wp.location) path.push(wp.location);
      });
    }
    if (recommendedRoute.destination)
      path.push(recommendedRoute.destination);
    return path;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {/* 백버튼 */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image source={ArrowIcon} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>

        {/* Finish Walk 버튼: 산책 중일 때만 표시 */}
        {isWalking && (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => {
              // HACK: finish walk 로직
            }}
          >
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
      <GoogleMap mapContainerStyle={containerStyle} 
      center={mapCenter} 
      zoom={16}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
        gestureHandling: "greedy", // 모바일에서 제스처 허용
        fullscreenControl: false,  
        streetViewControl: false,  
        mapTypeControl: false,     
      }}>
        
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
            onClick={() => handleMarkerClick(signal)}
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
            onClick={() => handleMarkerClick(signal)}
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
              strokeColor: "#00C851",
              strokeOpacity: 0.8,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>
    )}

    {/* RouteModal: 처음에만 표시, Take Route 누르면 닫힘 */}
    {routeModalVisible && (
      <RouteModal
        themeId={1}
        distance={1}
        onPress={handleTakeRoute}
      />
    )}
  </View>
)};

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