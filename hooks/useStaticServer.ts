import StaticServer from "@dr.pogodin/react-native-static-server";
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import RNFS from 'react-native-fs';

export const useStaticServer = (folderWasCreated: boolean) => {
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        let server: StaticServer | null = null;

        const pathPlatform = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath
        RNFetchBlob.fs.ls(pathPlatform).then(files => {
            console.log('pathPlatform:', files);
        }).catch(error => console.log(error))

        const startServer = async (): Promise<void> => {
            const path: string = `${pathPlatform}/build`;
            server = new StaticServer(9090, path, { localOnly: true });

            try {
                const url = await server.start();
                setUrl(url);
                console.log('server started successfully')
            } catch (error) {
                console.error('Failed to start server:', error);
            }
        };
        if (Platform.OS === 'android') {
            if (folderWasCreated) {
                startServer();
            }
        } else {
            startServer()
        }


        return () => server?.stop();
    }, [folderWasCreated,]);


    return url;
}