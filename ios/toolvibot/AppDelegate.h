#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import <UMCore/UMAppDelegateWrapper.h>
 
@interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) NSDictionary *launchOptions;

@end
