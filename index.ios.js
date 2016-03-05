/**
 * Sample React Native App using react-native-simple-auth.
 * To run on a mac from the project home dir:
 *
 * 1. Create secrets.js from secrets.example.js template
 * 2. `npm install`
 * 3. `pod install`
 * 3. `open ./ReactNativeSimpleAuth.xcworkspace/`
 * 4. Then in xcode hit cmd + r
 *
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  Component,
  View,
  Image,
  Text,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AlertIOS,
  NavigatorIOS,
  AppRegistry,
  StyleSheet
} from 'react-native';

import simpleAuthClient from './lib/simpleauthclient';
import secrets from './secrets';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.getName(props.provider),
      picture: this.getPictureLink(props.provider)
    };
  }

  render() {
    let { state, props } = this;
    return (
      <View style={styles.content}>
        <Image style={styles.pic} source={{uri: state.picture }} />
        <Text style={styles.header}>{state.name}</Text>
        <View style={styles.scroll}>
          <Text style={styles.mono}>{JSON.stringify(props.info, null, 4)}</Text>
        </View>
      </View>
    );
  }

  getName(provider) {
    let { info } = this.props;
    switch (provider) {
      case 'instagram':
        return info.data.full_name;
      case 'linkedin-web':
        return `${info.firstName} ${info.lastName}`;
      default:
        return info.name;
    }
  }

  getPictureLink(provider) {
    let { info } = this.props;
    switch (provider) {
      case 'google-web':
        return info.picture;
      case 'facebook':
        return `http://graph.facebook.com/${info.id}/picture?type=square`
      case 'twitter':
        return info.profile_image_url;
      case 'instagram':
        return info.data.profile_picture;
      case 'tumblr':
        return `http://api.tumblr.com/v2/blog/${info.name}.tumblr.com/avatar/96`;
      case 'linkedin-web':
        let profileUrl = `https://api.linkedin.com/v1/people/~:(picture-url)?oauth2_access_token=${info.token}&format=json`
        fetch(profileUrl)
          .then(response => response.json())
          .then(responseJson => {
            this.setState({ picture: responseJson.pictureUrl });
          });
        return '';
    }
  }

}

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentWillMount() {
    simpleAuthClient.configure(secrets);
  }

  render() {
    return (
      <View style={styles.content}>
        {
          this.state.loading ? null : this.props.authProviders.map((provider) => {
            return (
              <TouchableHighlight
                style={[styles.button, styles[provider]]}
                onPress={() => this.onBtnPressed(provider)}>
                <Text style={[styles.buttonText]}>{[provider.split('-')]}</Text>
              </TouchableHighlight>
            );
          })
        }
        <ActivityIndicatorIOS
            animating={this.state.loading}
            style={[styles.loading]}
            size='large' />
      </View>
    );
  }

  onBtnPressed(provider) {
    this.setState({
      loading: true
    });
    simpleAuthClient.authorize(provider)
      .then((info) => {
        this.props.navigator.push({
          title: provider,
          component: Profile,
          passProps: {
            info,
            provider
          }
        });
        this.setState({
          loading: false
        });
      })
      .catch((error) => {
          AlertIOS.alert(
              'Authorize Error',
              error && error.description || 'Unknown');
        this.setState({
          loading: false
        });
      });
  }

}

class ReactNativeSimpleAuth extends Component {

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Simple Auth',
          component: Login,
          passProps: {
            authProviders: [
              'google-web',
              'facebook',
              'twitter',
              'instagram',
              'tumblr',
              'linkedin-web'
            ]
          }
        }}/>
    );
  }
}

let styles = StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30
  },
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    marginTop: 80,
    marginRight: 10,
    marginLeft: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center'
  },
  pic: {
    width: 100,
    height: 100
  },
  mono: {
    fontFamily: 'Menlo',
    paddingTop: 10
  },
  scroll: {
    marginTop: 0,
    paddingTop: 0,
    backgroundColor: '#f2f2f2',
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row'
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  'google-web': {
    backgroundColor: '#ccc'
  },
  facebook: {
    backgroundColor: '#3b5998'
  },
  twitter: {
    backgroundColor: '#48BBEC'
  },
  instagram: {
    backgroundColor: '#3F729B'
  },
  tumblr: {
    backgroundColor: '#36465D'
  },
  'linkedin-web': {
    backgroundColor: '#0077B5'
  }
});

AppRegistry.registerComponent('ReactNativeSimpleAuth', () => ReactNativeSimpleAuth);
