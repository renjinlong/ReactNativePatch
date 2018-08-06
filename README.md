# base on

fork from https://github.com/Microsoft/react-native-code-push examples

# iOS eg.

```shell
$ cd /path/to/code-push-demo-app
$ npm install
$ open ios/CodePushDemoApp.xcodeproj
```

# android eg.

```shell
$ cd /path/to/code-push-demo-app
$ npm install
$ cd android
$ ./gradlew assembleRelease
$ cd app/build/outputs/apk #install app-release.apk into your phone
```

# codepush 热更新

```shell
$ code-push login http://api.XXX.com:8080 #登录code-push-server
$ code-push app add CodePushReactNativeDemo-ios ios react-native  #iOS版
$ code-push app add CodePushReactNativeDemo-android android react-native #android版
$ cd /path/to/code-push-demo-app
$ npm install
$ code-push release-react CodePushReactNativeDemo-ios ios -d Production #发布到code-push-server ios
$ code-push release-react CodePushReactNativeDemo-android android -d Production #发布code-push-server android

$ code-push release-react CodePushReactNativeDemo-android  android -d Staging --dev false --des updateTestDes --mandatory true
#-d 发布到哪个环境
#--dev 是否是开发
#--des 更新提示语
#--mandatory  是否强制更新
```
