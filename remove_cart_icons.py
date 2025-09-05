#!/usr/bin/env python3
import os

def remove_old_icons():
    # الملفات القديمة المشبوهة (أيقونات سلة المشتريات)
    old_files = [
        # drawable folders
        "android/app/src/main/res/drawable-hdpi/notification_icon.png",
        "android/app/src/main/res/drawable-hdpi/splashscreen_logo.png",
        "android/app/src/main/res/drawable-mdpi/notification_icon.png", 
        "android/app/src/main/res/drawable-mdpi/splashscreen_logo.png",
        "android/app/src/main/res/drawable-xhdpi/notification_icon.png",
        "android/app/src/main/res/drawable-xhdpi/splashscreen_logo.png",
        "android/app/src/main/res/drawable-xxhdpi/notification_icon.png",
        "android/app/src/main/res/drawable-xxhdpi/splashscreen_logo.png",
        "android/app/src/main/res/drawable-xxxhdpi/notification_icon.png",
        "android/app/src/main/res/drawable-xxxhdpi/splashscreen_logo.png",
        
        # mipmap adaptive icons (old)
        "android/app/src/main/res/mipmap-hdpi/ic_launcher_adaptive_back.png",
        "android/app/src/main/res/mipmap-hdpi/ic_launcher_adaptive_fore.png",
        "android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-mdpi/ic_launcher_adaptive_back.png",
        "android/app/src/main/res/mipmap-mdpi/ic_launcher_adaptive_fore.png", 
        "android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher_adaptive_back.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher_adaptive_fore.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_adaptive_back.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_adaptive_fore.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_adaptive_back.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_adaptive_fore.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png"
    ]
    
    for file_path in old_files:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"حذف: {file_path}")
    
    print("تم حذف الأيقونات القديمة!")

if __name__ == "__main__":
    remove_old_icons()