@echo off
echo =====================================================================
echo  Running Automated Test Suite for All Five Project Units (U1 - U5)
echo =====================================================================
cd /d "%~dp0\backend"
python -m pytest tests -p no:cacheprovider -v
pause
