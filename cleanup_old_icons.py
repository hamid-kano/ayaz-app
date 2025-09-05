#!/usr/bin/env python3
import os

def cleanup_old_icons():
    # الملفات القديمة في assets
    old_files = [
        "assets/adaptive-icon.png",
        "assets/favicon.png", 
        "assets/ic_launcher.png",
        "assets/icon_256.png",
        "assets/icon.png",
        "assets/net.png",
        "assets/splash-icon.png",
        "assets/splash-img-256x256.png",
        "assets/splash-img.png"
    ]
    
    for file_path in old_files:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"حذف: {file_path}")
    
    print("تم حذف جميع الملفات القديمة!")

if __name__ == "__main__":
    cleanup_old_icons()