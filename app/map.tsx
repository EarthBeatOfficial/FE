import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSelector } from 'react-redux';
import { getAllSignals, getMySignals } from "../api/signalApi";
import { RootState } from '../store/store';

const { width, height } = Dimensions.get('window');

/**
 * <TODO>
 * 백엔드와 연결해야 할 것들 연결
 *  추천 루트 띄우기
 * 모달 연결
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

const INITIAL_REGION = {
  latitude: 37.544582,
  longitude: 127.037589,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [signalList, setSignalList] = useState<Signal[]>([]);
  const [myProgressSignals, setMyProgressSignals] = useState<Signal[]>([]);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION);
  const [userData, setUserData] = useState<{ userId: number; nickname: string } | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);

  const router = useRouter();
  const recommendedRoute = useSelector((state: RootState) => state.route?.recommendedRoute);

  // 현재 위치 추적
  useEffect(() => {
    (async () => {
      // 위치 권한 요청 및 현재 위치 가져오기
      try {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
            setMapRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          },
          (err) => {
            console.warn("위치 정보를 가져올 수 없습니다.", err);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } catch (e) {
        console.warn("위치 권한 오류", e);
      }
    })();
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

  // 추천 루트가 변경될 때 Polyline 좌표 업데이트
  useEffect(() => {
    if (recommendedRoute) {
      const coords = [
        recommendedRoute.origin,
        ...recommendedRoute.waypoints.map((wp: any) => wp.location),
        recommendedRoute.destination,
      ].map((p: any) => ({ latitude: p.lat, longitude: p.lng }));
      setRouteCoords(coords);
      setMapRegion({
        latitude: recommendedRoute.origin.lat,
        longitude: recommendedRoute.origin.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [recommendedRoute]);

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

  // Return icon require path based on signal type
  const getIcon = (categoryId: number, isMySignal = false) => {
    // 커스텀 마커 이미지를 직접 프로젝트에 추가해야 함
    // 예시: assets/markers/category-plant.png, assets/markers/category-plant-large.png
    switch (categoryId) {
      case 1:
        return isMySignal
          ? require("../assets/markers/category-plant-large.png")
          : require("../assets/markers/category-plant.png");
      case 2:
        return isMySignal
          ? require("../assets/markers/category-repair-large.png")
          : require("../assets/markers/category-repair.png");
      case 3:
        return isMySignal
          ? require("../assets/markers/category-delivery-large.png")
          : require("../assets/markers/category-delivery.png");
      // ... 나머지 카테고리도 동일하게 추가
      default:
        return isMySignal
          ? require("../assets/markers/category-default-large.png")
          : require("../assets/markers/category-default.png");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {/* 백버튼 */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/home")}> 
          <Text style={styles.backBtnText}>{"<"}</Text>
        </TouchableOpacity>
        {/* Finish Walk 버튼 */}
        <TouchableOpacity style={styles.finishBtn} onPress={() => {}}>
          <Text style={styles.finishBtnText}>Finish Walk</Text>
        </TouchableOpacity>
        <Image source={require("../assets/images/user-head.png")} style={styles.userIcon} />
      </View>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* PENDING 시그널 마커 */}
        {signalList.map((signal) => (
          <Marker
            key={`pending-${signal.id}`}
            coordinate={{ latitude: signal.lat, longitude: signal.lng }}
            onPress={() => handleMarkerClick(signal)}
            image={getIcon(signal.categoryId, false)}
          />
        ))}
        {/* IN_PROGRESS(내가 응답한) 시그널 마커 (더 큰 아이콘) */}
        {myProgressSignals.map((signal) => (
          <Marker
            key={`my-${signal.id}`}
            coordinate={{ latitude: signal.lat, longitude: signal.lng }}
            onPress={() => handleMarkerClick(signal)}
            image={getIcon(signal.categoryId, true)}
          />
        ))}
        {/* 추천 경로 Polyline */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#2d6a4f"
            strokeWidth={6}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, width: width, height: height },
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