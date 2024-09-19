import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import StaticServer from '@dr.pogodin/react-native-static-server';
import RNFetchBlob from 'rn-fetch-blob'
import { WebView } from 'react-native-webview'
import RNFS from 'react-native-fs';
import React from 'react';
import { useStaticServer } from '@/hooks/useStaticServer';

// For android 
const copyAssetsFolderContents = async (
  sourcePath: string,
  targetPath: string,
): Promise<void> => {

  try {
    const items = await RNFS.readDirAssets(sourcePath);
    const targetExists = await RNFS.exists(targetPath);
    if (!targetExists) {
      await RNFS.mkdir(targetPath);
    }

    for (const item of items) {
      const sourceItemPath = `${sourcePath}/${item.name}`;
      const targetItemPath = `${targetPath}/${item.name}`;


      if (item.isDirectory()) {
        await copyAssetsFolderContents(sourceItemPath, targetItemPath);
      } else {
        await RNFS.copyFileAssets(sourceItemPath, targetItemPath);
      }
    }
  } catch (error) {
    console.error('Failed to copy assets folder contents:', error);
    throw error;
  }
};

export default function HomeScreen() {
  const [folderWasCreated, setFolderWasCreated] = useState<boolean>(false);
  const url = useStaticServer(folderWasCreated);
  console.log(url)
  const ASSETS_FOLDER_NAME: string = 'build';
  const DOCUMENT_FOLDER_PATH: string = `${RNFS.DocumentDirectoryPath}/${ASSETS_FOLDER_NAME}`;


  useEffect(() => {
    if (Platform.OS === 'android') {
      copyAssetsFolderContents(ASSETS_FOLDER_NAME, DOCUMENT_FOLDER_PATH)
        .then(() => {
          console.log('Build folder contents copied successfully.');
          setFolderWasCreated(true);
        })
        .catch(error => {
          console.error('Error copying build folder contents:', error);
        });
    }

  }, []);

  if (url !== '') {
    return (<WebView
      webviewDebuggingEnabled
      source={{ uri: url }}
      style={styles.webview}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />)
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  webview: { flex: 1 }
});
