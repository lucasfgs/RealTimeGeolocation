import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Text,
  SafeAreaView,
} from 'react-native';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Permissions, {PERMISSIONS} from 'react-native-permissions';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = -0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function App() {
  const [latitude, setLatitude] = useState(LATITUDE);
  const [longitude, setLongitude] = useState(LONGITUDE);
  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  );
  const [watchId, setWatchId] = useState();

  useEffect(() => {
    watchLocation();

    return Geolocation.clearWatch(watchId);
  }, []);

  const watchLocation = () => {
    Permissions.request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    const watchID = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude);

        const newCoordinate = {
          latitude,
          longitude,
        };

        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500, // 500 is the duration to animate the marker
            );
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        setWatchId(watchID);
        setLatitude(latitude);
        setLongitude(longitude);
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
  };

  const getMapRegion = () => ({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showUserLocation
          followUserLocation
          loadingEnabled
          region={getMapRegion()}>
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={coordinate}
          />
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
