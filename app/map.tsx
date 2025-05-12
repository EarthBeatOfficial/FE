import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { getAllSignals, getMySignals } from "../api/signalApi";

// import AsyncStorage from '@react-native-async-storage/async-storage';

/**
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

// 기본 경로 설정 (추후 Redux에서 데이터가 없을 경우 사용)
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
  const [myProgressSignals, setMyProgressSignals] = useState<Signal[]>([]); // 내가 응답한 IN_PROGRESS 시그널
  const [allSignals, setAllSignals] = useState<Signal[]>([]); // 모든 시그널을 합친 리스트
  
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.544582, lng: 127.037589 });
  const [userData, setUserData] = useState<{
      userId: number;
      nickname: string;
    } | null>(null);

  const router = useRouter();
   // call the recommended route through redux
  const recommendedRoute = useSelector(
    (state: RootState) => state.route?.recommendedRoute
  );

  // 현재 위치 추적
  useEffect(() => {
    if (navigator.geolocation && window.google) {
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

  // PENDING 시그널 데이터 가져오기
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const signals = await getAllSignals();
        setSignalList(signals);
      } catch (error) {
        console.error('PENDING 시그널 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    fetchSignals();
  }, []);

  // 사용자 데이터 가져오기
  useEffect(() => {
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
        console.error('내가 응답한 IN_PROGRESS 시그널 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    fetchMySignals();
  }, [userData]);

  // signalList와 myProgressSignals가 변경될 때마다 모든 시그널 목록 업데이트
  useEffect(() => {
    // 두 배열 결합 (중복 제거)
    const combinedSignals = [...signalList];
    
    // myProgressSignals 중 signalList에 없는 항목만 추가
    myProgressSignals.forEach(mySignal => {
      const exists = combinedSignals.some(signal => signal.id === mySignal.id);
      if (!exists) {
        combinedSignals.push(mySignal);
      }
    });
    
    // resolved 상태의 시그널 제외
    const filteredSignals = combinedSignals.filter(signal => signal.status !== "RESOLVED");
    
    setAllSignals(filteredSignals);
  }, [signalList, myProgressSignals]);

  // recommendedRoute가 변경될 때마다 경로와 지도 중심 업데이트
  useEffect(() => {
    if (recommendedRoute) {
      const directionsRequest = {
        ...recommendedRoute,
        travelMode: "WALKING" as google.maps.TravelMode,
      };
      
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(directionsRequest, (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setMapCenter(recommendedRoute.origin);
        }
      });
    }
  }, [recommendedRoute]);

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
    const baseUrl = 'https://raw.githubusercontent.com/HEEKGH/EARTHBEAT-assets/main/';
  
    switch (categoryId) {
      case 1 : // 'Water Plants / Plant - Related'
        return `${baseUrl}category-plant.png`;
      case 2 : // 'Repair / Tools'
        return `${baseUrl}category-repair.png`;
      case 3 : // 'Delivery'
        return `${baseUrl}category-delivery.png`;
      case 4 : // 'Catch the Bug'
        return `${baseUrl}category-bug.png`;
      case 5 : // 'Translate'
        return `${baseUrl}category-translate.png`;
      case 6 : // 'Pet-Related'
        return `${baseUrl}category-pet.png`;
      case 7 : // 'Lend / Borrow Batteries'
        return `${baseUrl}category-battery.png`;
      case 8 : // 'Lost & Found'
        return `${baseUrl}category-find.png`;
      case 9 : // 'Take picture(s)'
        return `${baseUrl}category-picture.png`;
      case 10 : // 'etc.'
        return `${baseUrl}category-etc.png`;
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

            {/* 모든 신호 마커 (PENDING + IN_PROGRESS) */}
            {allSignals.map((signal) => (
              <Marker
                key={signal.id}
                position={{ lat: signal.lat, lng: signal.lng }}
                onClick={() => handleMarkerClick(signal)}
                icon={
                  window.google
                    ? {
                        url: getIcon(signal.categoryId),
                        scaledSize: new window.google.maps.Size(100, 100),
                      }
                    : undefined
                }
              />
            ))}

            {/* DirectionsService: 경로 요청 */}
            {recommendedRoute ? (
              <DirectionsService
                options={{
                  ...recommendedRoute,
                  travelMode: "WALKING" as google.maps.TravelMode,
                }}
                callback={directionsCallback}
              />
            ) : (
              <DirectionsService
                options={MOCK_DIRECTIONS_REQUEST}
                callback={directionsCallback}
              />
            )}

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