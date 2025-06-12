@echo off
echo ========================================
echo    REBUILDANDO APK DE DEBUG
echo ========================================

echo.
echo 1. Limpando builds anteriores...
cd android
call gradlew clean

echo.
echo 2. Gerando APK de debug...
call gradlew assembleDebug

echo.
echo 3. Verificando se o APK foi gerado...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✅ APK gerado com sucesso!
    echo 📁 Localização: android\app\build\outputs\apk\debug\app-debug.apk
    for %%A in ("app\build\outputs\apk\debug\app-debug.apk") do echo 📏 Tamanho: %%~zA bytes
) else (
    echo ❌ Erro: APK não foi gerado!
    exit /b 1
)

echo.
echo 4. Instalando APK no dispositivo conectado...
adb install -r app\build\outputs\apk\debug\app-debug.apk

echo.
echo ========================================
echo    BUILD CONCLUÍDO!
echo ========================================
echo.
echo 📱 APK instalado no dispositivo
echo 🔍 Use o botão "Testar Módulo Nativo" para verificar
echo 📋 Verifique os logs no console para mais detalhes
echo.
pause 