/* global __DEV__ */
import crashlytics from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';

const WEBHOOK: string =
  'https://discord.com/api/webhooks/818075047339098132/SVItUX2wgXOuQs1-KpEh3FF2WTp21NCGYyluXCOKMC9Aj2gChZb6sHblanpgi4Aq0SQ0';

export function sendMessage(content: any) {
  try {
    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    }).then();
  } catch (error) {
    console.log('error', error);
  }
}

export const log = {
  error(title: any, message?: any) {
    try {
      if (__DEV__) {
        console.log(title, message);
      } else {
        let text;
        if (message.componentStack) {
          text = message.componentStack.slice(0, 2000);
        } else {
          text = message.toString();
        }

        const platform = Platform.OS;
        const extras: any = [];
        extras.push({
          name: 'Platform',
          value: platform,
        });
        if (platform == 'web') {
          extras.push(
            {
              name: 'Browser',
              value: navigator.appCodeName,
            },
            {
              name: 'OS',
              value: navigator.platform,
            },
          );
        } else if (platform == 'android') {
          extras.push({
            name: 'Android Version',
            value: Platform.Version,
          });
        }
        const content = {
          username: 'error-logs',
          avatar_url: 'https://i.imgur.com/4M34hi2.png',
          content: title.toString(),
          embeds: [
            {
              title: arguments.callee.name,
              fields: extras,
              description: text,
              color: 14177041,
            },
          ],
        };
        sendMessage(content);
      }
      crashlytics().recordError(message);
    } catch (error) {
      console.log(error);
    }
  },

  debug(title: string, message: string) {
    try {
      if (__DEV__) {
        console.log(title, message);
      } else {
        const content = {
          username: 'debug-logs',
          avatar_url: 'https://i.imgur.com/4M34hi2.png',
          content: 'log message',
          embeds: [
            {
              title: title,
              description: message,
              color: 15258703,
            },
          ],
        };
        sendMessage(content);
        crashlytics().log(message);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
