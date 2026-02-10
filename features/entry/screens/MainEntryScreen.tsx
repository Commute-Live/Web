import React, {useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../theme';
import AuthScreen from '../../auth/screens/AuthScreen';

export default function MainEntryScreen() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(false), 750);
    return () => clearTimeout(timer);
  }, []);

  if (showLogo) {
    return (
      <SafeAreaView style={styles.logoScreen} edges={['top', 'left', 'right']}>
        <Image
          source={require('../../../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  }

  return <AuthScreen />;
}

const styles = StyleSheet.create({
  logoScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {width: 160, height: 160},
});
