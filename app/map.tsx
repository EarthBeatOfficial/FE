import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getAllSignals } from "../api/signalApi";

// import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * <주석 type에 대한 설명>
 * HACK : 추후 수정 필요
 * FIXME : 당장 수정 필요
 */

interface Signal {
  id: number;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "waiting" | "accepted" | "resolved";
  resolveMessage?: string; // HACK : 수정 필요
}

// API 응답 데이터 타입
interface RawSignal {
  id: number;
  type: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  status: "waiting" | "accepted" | "resolved";
  resolveMessage?: string;
}

// Dummy signal data for testing
// const signals: Signal[] = [
//   {
//     id: 1,
//     type: "plant",
//     title: "Please help water my plant!",
//     description: "기숙사 방 안의 식물에 물을 주세요.",
//     latitude: 37.5902,
//     longitude: 127.0331,
//     status: "waiting",
//   },
//   {
//     id: 2,
//     type: "pet",
//     title: "산책을 못 나가요",
//     description: "강아지 산책 부탁드립니다. 정문 근처에 있어요.",
//     latitude: 37.5887,
//     longitude: 127.0318,
//     status: "waiting",
//   },
//   {
//     id: 3,
//     type: "delivery",
//     title: "문 앞에 음식 좀 가져다 주세요",
//     description: "서관 건물 앞에 음식이 도착했어요.",
//     latitude: 37.5898,
//     longitude: 127.0342,
//     status: "waiting",
//   },
// ];

const MOCK_DIRECTIONS_REQUEST = {
  origin: { lat: 37.544582, lng: 127.037589 },
  destination: { lat: 37.58000, lng: 127.035589 },
  waypoints: [
    { location: { lat: 37.546070, lng: 127.038879 } },
    { location: { lat: 37.549907, lng: 127.033275 } },
    { location: { lat: 37.531693, lng: 127.066134 } }
  ],
  travelMode: "WALKING" as google.maps.TravelMode,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapScreen() {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null); // 선택된 signal
  const [modalVisible, setModalVisible] = useState<boolean>(false);         // 모달 창 표시 여부
  const [signalList, setSignalList] = useState<Signal[]>([]);          // 현재 signal 리스트 상태
  
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(MOCK_DIRECTIONS_REQUEST.origin);

  const router = useRouter();

  // 현재 위치 추적
  useEffect(() => {
    if (navigator.geolocation) {
      // watchPosition은 위치가 바뀔 때마다 콜백을 실행
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude }); // 내 위치로 지도 중심 이동
        },
        (err) => {
          console.warn("위치 정보를 가져올 수 없습니다.", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      // 언마운트 시 추적 해제
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // 시그널 데이터 가져오기
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const signals = await getAllSignals();
        // RawSignal을 Signal로 변환
        const parsedSignals = signals.map((signal: RawSignal): Signal => ({
          ...signal,
          latitude: parseFloat(signal.latitude),
          longitude: parseFloat(signal.longitude)
        }));
        setSignalList(parsedSignals);
      } catch (error) {
        console.error('시그널 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    fetchSignals();
  }, []);

  // DirectionsService 요청 결과 처리
  const directionsCallback = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status === "OK" && result) {
      setDirections(result);
    }
  };

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
        s.id === selectedSignal.id ? { ...s, status: "accepted" } : s
      )
    );
    setModalVisible(false);
  };

  // HACK : resolved icon 표현 방법 결정 후 수정 필요
  // 해결 메시지를 포함해 signal 상태를 "resolved"로 변경
  const handleResolve = (message: string) => {
    if (!selectedSignal) return;
    setSignalList((prev) =>
      prev.map((s) =>
        s.id === selectedSignal.id
          ? { ...s, status: "resolved", resolveMessage: message }
          : s
      )
    );
    setModalVisible(false);
  };

  // Handle modal cancel/close
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Return icon URL based on signal type
  const getIcon = (type: string) => {
    const baseUrl = 'https://raw.githubusercontent.com/HEEKGH/EARTHBEAT-assets/main/';
  
    switch (type) {
      case 'pet':
        return `${baseUrl}category-pet.png`;
      case 'plant':
        return `${baseUrl}category-plant.png`;
      case 'battery':
        return `${baseUrl}category-battery.png`;
      case 'bug':
        return `${baseUrl}category-bug.png`;
      case 'delivery':
        return `${baseUrl}category-delivery.png`;
      case 'etc':
        return `${baseUrl}category-etc.png`;
      case 'find':
        return `${baseUrl}category-find.png`;
      case 'picture':
        return `${baseUrl}category-picture.png`;
      case 'repair':
        return `${baseUrl}category-repair.png`;
      case 'translate':
        return `${baseUrl}category-translate.png`;
      default:
        return `${baseUrl}category-default.png`;
    }
  };  

  // Define styles for the screen
const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 24,
    color: "#222",
  },
  finishBtn: {
    backgroundColor: "#2d6a4f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
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

  return (
  <View style={styles.container}>
    <View style={styles.topBar}>
      {/* 백버튼 */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/home")}>
        <Text style={styles.backBtnText}>{"<"}</Text>
      </TouchableOpacity>

      {/* Finish Walk 버튼 */}
      <TouchableOpacity style={styles.finishBtn} onPress={() => {
        // HACK: finish walk 로직
      }}>
        <Text style={styles.finishBtnText}>Finish Walk</Text>
      </TouchableOpacity>

      {/* HACK: 실제 사용자 아이콘 연결 필요 */}
      <Image
        source={require("../assets/images/user-head.png")}
        style={styles.userIcon}
      />
    </View>

    {/* Load Google Maps API */}
    <LoadScript googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      {window.google ? (
        <>
          {/* Render Google Map */}
          <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={16}>
            
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

            {/* 신호 마커 */}
            {signalList.map((signal) => (
              <Marker
                key={signal.id}
                position={{ lat: signal.latitude, lng: signal.longitude }}
                onClick={() => handleMarkerClick(signal)}
                icon={
                  window.google
                    ? {
                        url: getIcon(signal.type),
                        scaledSize: new window.google.maps.Size(100, 100),
                      }
                    : undefined
                }
              />
            ))}

            {/* DirectionsService: 경로 요청 */}
            <DirectionsService
              options={MOCK_DIRECTIONS_REQUEST}
              callback={directionsCallback}
            />

            {/* DirectionsRenderer: 경로 표시 */}
            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions,
                  suppressMarkers: true, // 마커는 직접 표시
                  polylineOptions: {
                    strokeColor: "#2d6a4f",
                    strokeWeight: 6,
                  },
                }}
              />
            )}
          </GoogleMap>
        </>
      ) : (
        <Text>Loading Map...</Text>
      )}
    </LoadScript>
  </View>
)};