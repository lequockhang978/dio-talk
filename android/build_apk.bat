@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo [Dio Talk] Using JDK 21 at %JAVA_HOME%
call "%~dp0gradlew.bat" assembleDebug
