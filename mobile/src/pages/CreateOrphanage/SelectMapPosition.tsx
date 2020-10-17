import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, PROVIDER_GOOGLE, MapEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import Spinner from 'react-native-loading-spinner-overlay';


import mapMarkerImg from '../../images/point.png';

interface MapLocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function SelectMapPosition() {
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const navigation = useNavigation();

  const [location, setLocation] = useState<MapLocation>();

  useEffect(() => {
    async function loadInitialPosition() {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para acessar localização negada');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = coords;
      
      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      });
    };

    loadInitialPosition();
  }, []);

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  function handleSelectMapPosition(e: MapEvent) {
    setPosition(e.nativeEvent.coordinate);
  }

  if (!location) {
    return (
        <Spinner
          visible={true}
          color={'#0089a5'}
          size={"large"}
          overlayColor={'rgba(255, 255, 255, 1)'}
        />
    )
  }

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        initialRegion={location}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        { position.latitude !== 0 && (
          <Marker 
            icon={mapMarkerImg}
            coordinate={{ latitude: position.latitude, longitude: position.longitude }}
          />
        )}
      </MapView>

      { position.latitude !== 0 && (
          <RectButton style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Próximo</Text>
          </RectButton>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})