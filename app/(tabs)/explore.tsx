import { StyleSheet, Platform } from 'react-native';

import { WebView } from 'react-native-webview'
import RNFS from 'react-native-fs';
import React from 'react';


const PolicyHTML = require('../../build/index.html');

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


export default function TabTwoScreen() {
  if (Platform.OS === 'android')
    return <WebView
      originWhitelist={['*']}
      source={{ uri: 'file:///android_asset/build/index.html' }}
      style={{ marginTop: 20, flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}

    />

  return <WebView
    originWhitelist={['*']}
    source={{ uri: `${RNFS.MainBundlePath}/build/index.html` }}
    style={{ marginTop: 20, flex: 1 }}
    javaScriptEnabled={true}
    domStorageEnabled={true}

  />
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
