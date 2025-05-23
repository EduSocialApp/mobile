module.exports = {
    "expo": {
        "name": "EduSocial",
        "slug": "edusocial-app",
        "version": "0.0.1",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "light",
        "scheme": "com.felipesobral.edusocial",
        "owner": "felipesobral",
        "githubUrl": "https://github.com/EduSocialApp/mobile",
        "platforms": [
            "ios",
            "android"
        ],
        "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
        },
        "assetBundlePatterns": [
            "**/*"
        ],
        "ios": {
            "supportsTablet": true,
            "bundleIdentifier": "com.felipesobral.edusocial",
            "googleServicesFile": process.env.GOOGLESERVICE_INFO_PLIST,
            "buildNumber": "1",
            "infoPlist": {
                "NSCameraUsageDescription": "O recurso câmera deste aplicativo é utilizado para escanear códigos de barras, códigos QR e para capturar imagens.",
                "NSPhotoLibraryUsageDescription": "Utilizamos esta permissão para salvar as fotos dos seus produtos.",
                "NSPhotoLibraryAddUsageDescription": "Utilizamos esta permissão caso queira enviar uma foto para nosso aplicativo.",
                "ITSAppUsesNonExemptEncryption": false
            }
        },
        "android": {
            "package": "com.felipesobral.edusocial",
            "googleServicesFile": process.env.GOOGLESERVICE_JSON,
            "versionCode": 1,
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "permissions": [
                "android.permission.CAMERA",
                "android.permission.ACCESS_MEDIA_LOCATION",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE",
                "android.permission.RECORD_AUDIO",
                "android.permission.CAMERA",
                "android.permission.ACCESS_MEDIA_LOCATION",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE",
                "android.permission.RECORD_AUDIO"
            ]
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "plugins": [
            "expo-router",
            [
                "expo-media-library",
                {
                    "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
                    "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
                    "isAccessMediaLocationEnabled": true
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos to let you share them with your friends."
                }
            ],
            [
                "expo-camera",
                {
                    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
                    "recordAudioAndroid": true
                }
            ],
            "expo-build-properties",
            "expo-secure-store"
        ],
        "extra": {
            "eas": {
                "projectId": "ffb90975-66fc-4cfd-aa3e-9486cfe50465"
            }
        },
        "runtimeVersion": {
            "policy": "appVersion"
        },
        "updates": {
            "url": "https://u.expo.dev/ffb90975-66fc-4cfd-aa3e-9486cfe50465"
        }
    }
}