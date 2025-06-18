/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert, StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import MaskedView from '@react-native-masked-view/masked-view';
import moment from 'moment';
import * as emoji from 'node-emoji';
import {get, map, filter} from 'lodash';
import CryptoJS from 'crypto-js';
import {Realm, RealmProvider, useRealm, useQuery} from '@realm/react';
import RNFetchBlob from 'rn-fetch-blob';

// Realm Schema
class Task extends Realm.Object {
  static schema = {
    name: 'Task',
    properties: {
      _id: 'objectId',
      name: 'string',
      createdAt: 'date',
    },
    primaryKey: '_id',
  };
}

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 16px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 8px 0;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: #666;
  margin: 4px 0;
`;

// Navigation Stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const LegacyStack = createStackNavigator();

// Demo Screen Component
function DemoScreen(): React.JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);
  const [sheetIndex, setSheetIndex] = useState(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['25%', '50%'];

  // Animated value for reanimated demo
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  // Demo functions for each library
  const handleBottomSheet = useCallback(() => {
    setSheetIndex(0);
    bottomSheetRef.current?.expand();
  }, []);

  const handleAnimation = () => {
    translateX.value = withSpring(translateX.value === 0 ? 100 : 0);
  };

  const handleCrypto = () => {
    const encrypted = CryptoJS.AES.encrypt('Hello World', 'secret').toString();
    Alert.alert('Crypto Demo', `Encrypted: ${encrypted.substring(0, 20)}...`);
  };

  const handleLodash = () => {
    const data = [1, 2, 3, 4, 5];
    const result = filter(
      map(data, x => x * 2),
      x => x > 4,
    );
    Alert.alert('Lodash Demo', `Result: ${result.join(', ')}`);
  };

  const handleMoment = () => {
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    Alert.alert('Moment Demo', `Current time: ${now}`);
  };

  const handleEmoji = () => {
    const randomEmoji = emoji.random();
    Alert.alert(
      'Emoji Demo',
      `Random emoji: ${randomEmoji.emoji} (${randomEmoji.key})`,
    );
  };

  const handleRealm = () => {
    realm.write(() => {
      realm.create(Task, {
        _id: new Realm.BSON.ObjectId(),
        name: `Task ${tasks.length + 1}`,
        createdAt: new Date(),
      });
    });
  };

  const handleFetchBlob = () => {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', 'https://jsonplaceholder.typicode.com/posts/1')
      .then(res => {
        Alert.alert('Fetch Blob Demo', 'Data fetched successfully!');
      })
      .catch(() => {
        Alert.alert('Fetch Blob Demo', 'Failed to fetch data');
      });
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Container>
          <InfoText>Demo Screen - Sử dụng tất cả thư viện</InfoText>
          <InfoText>Current time: {moment().format('HH:mm:ss')}</InfoText>
          <InfoText>Tasks in Realm: {tasks.length}</InfoText>

          {/* Reanimated Demo */}
          <Animated.View
            style={[
              {
                width: 50,
                height: 50,
                backgroundColor: 'red',
                marginVertical: 10,
              },
              animatedStyle,
            ]}
          />

          <StyledButton onPress={handleAnimation}>
            <ButtonText>Animate Box (Reanimated)</ButtonText>
          </StyledButton>

          <StyledButton onPress={handleBottomSheet}>
            <ButtonText>Show Bottom Sheet</ButtonText>
          </StyledButton>

          {/* Popup Menu Demo */}
          <Menu>
            <MenuTrigger>
              <StyledButton>
                <ButtonText>Show Popup Menu</ButtonText>
              </StyledButton>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={handleCrypto} text="Crypto Demo" />
              <MenuOption onSelect={handleLodash} text="Lodash Demo" />
              <MenuOption onSelect={handleMoment} text="Moment Demo" />
            </MenuOptions>
          </Menu>

          <StyledButton onPress={handleEmoji}>
            <ButtonText>{emoji.get('rocket')} Emoji Demo</ButtonText>
          </StyledButton>

          <StyledButton onPress={handleRealm}>
            <ButtonText>Add Task to Realm</ButtonText>
          </StyledButton>

          <StyledButton onPress={handleFetchBlob}>
            <ButtonText>Fetch Blob Demo</ButtonText>
          </StyledButton>

          {/* Masked View Demo */}
          <MaskedView
            style={{height: 60, marginVertical: 10}}
            maskElement={
              <View
                style={{
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
                  MASKED TEXT
                </Text>
              </View>
            }>
            <View style={{flex: 1, backgroundColor: 'blue'}} />
          </MaskedView>

          {/* Bottom Sheet */}
          <BottomSheet
            ref={bottomSheetRef}
            index={sheetIndex}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={() => setSheetIndex(-1)}>
            <BottomSheetView style={{flex: 1, padding: 20}}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
                Bottom Sheet Demo
              </Text>
              <InfoText>Sử dụng @gorhom/bottom-sheet</InfoText>
              <InfoText>Gesture Handler đang hoạt động</InfoText>
              <InfoText>Safe Area Context đang được áp dụng</InfoText>
            </BottomSheetView>
          </BottomSheet>
        </Container>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Demo"
        component={DemoScreen}
        options={{
          title: `${emoji.get('star')} Demo`,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={() => (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Settings Screen</Text>
            <InfoText>Stack Navigation đang hoạt động</InfoText>
          </View>
        )}
        options={{title: `${emoji.get('gear')} Settings`}}
      />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{title: 'Main App'}}
      />
      <Drawer.Screen
        name="About"
        component={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
              About Screen
            </Text>
            <InfoText>Drawer Navigation đang hoạt động</InfoText>
            <InfoText>Legacy Stack có thể được sử dụng khi cần</InfoText>
          </View>
        )}
      />
    </Drawer.Navigator>
  );
}

// Main App Component
function App(): React.JSX.Element {
  return (
    <RealmProvider schema={[Task]}>
      <SafeAreaProvider>
        <MenuProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
            <DrawerNavigator />
          </NavigationContainer>
        </MenuProvider>
      </SafeAreaProvider>
    </RealmProvider>
  );
}

export default App;
