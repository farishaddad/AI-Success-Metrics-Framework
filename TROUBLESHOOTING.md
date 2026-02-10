# 🔧 Troubleshooting Guide

Common issues and solutions for the AI Success Metrics Dashboard.

---

## 🚫 Installation Issues

### "npm not found" or "node not found"

**Problem**: Node.js is not installed on your computer.

**Solution**:
1. Go to https://nodejs.org
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Follow the installation wizard (click Next/Continue)
5. **Restart your computer**
6. Try running the dashboard again

**How to verify**:
- Open Command Prompt (Windows) or Terminal (Mac/Linux)
- Type: `node --version`
- Should show something like `v18.17.0`
- Type: `npm --version`
- Should show something like `9.6.7`

---

### "Permission denied" (Mac/Linux)

**Problem**: Script doesn't have execute permissions.

**Solution**:
```bash
chmod +x START_DASHBOARD.sh
chmod +x BUILD_FOR_SHARING.sh
./START_DASHBOARD.sh
```

---

### Installation takes forever or fails

**Problem**: Slow internet or network issues.

**Solution**:
1. Check your internet connection
2. Try again later
3. If behind corporate firewall, contact IT
4. Try using a different network
5. Clear npm cache: `npm cache clean --force`

---

## 🌐 Browser Issues

### Dashboard won't open automatically

**Problem**: Browser doesn't launch automatically.

**Solution**:
1. Look at the terminal/command window
2. Find the line that says: `Local: http://localhost:5173`
3. Copy that URL
4. Open your browser manually
5. Paste the URL in the address bar
6. Press Enter

---

### Blank page or white screen

**Problem**: JavaScript not loading or browser compatibility.

**Solution**:
1. **Hard refresh**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear cache**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Settings → Privacy → Clear Data
   - Edge: Settings → Privacy → Clear browsing data
3. **Try different browser**: Chrome, Edge, or Firefox
4. **Check browser console**:
   - Press F12
   - Look for red error messages
   - Share errors with support team

---

### Charts not displaying

**Problem**: Recharts library not loading properly.

**Solution**:
1. Refresh the page (F5)
2. Check internet connection (if loading from CDN)
3. Clear browser cache
4. Try incognito/private mode
5. Reinstall: Delete `node_modules` folder and run `npm install`

---

### Slow performance or lag

**Problem**: Too many browser tabs or low system resources.

**Solution**:
1. Close other browser tabs
2. Close unnecessary applications
3. Restart browser
4. Restart computer
5. Use Chrome or Edge (best performance)
6. Check system requirements (4GB RAM minimum)

---

## 🖥️ Server Issues

### "Port 5173 already in use"

**Problem**: Another instance is already running or port is occupied.

**Solution**:
1. **Find and close other instances**:
   - Look for other terminal/command windows
   - Close them
2. **Kill the process** (Windows):
   ```cmd
   netstat -ano | findstr :5173
   taskkill /PID <PID_NUMBER> /F
   ```
3. **Kill the process** (Mac/Linux):
   ```bash
   lsof -ti:5173 | xargs kill -9
   ```
4. **Restart computer** (easiest solution)

---

### "EADDRINUSE" error

**Problem**: Same as above - port already in use.

**Solution**: Follow the "Port already in use" solution above.

---

### Server crashes or stops

**Problem**: Node.js process terminated unexpectedly.

**Solution**:
1. Check error message in terminal
2. Restart the dashboard
3. Check system resources (RAM, CPU)
4. Update Node.js to latest LTS version
5. Reinstall dependencies: `npm install`

---

## 📊 Data Issues

### No data showing

**Problem**: Data not loading or mock data not generating.

**Solution**:
1. Refresh the page
2. Check browser console for errors (F12)
3. Verify all components are loading
4. Check if specific dashboard or all dashboards affected

---

### Incorrect data or calculations

**Problem**: Mock data generation or calculation error.

**Solution**:
1. This is demo data - expected to be random
2. For real data, contact development team
3. Check component code for calculation logic

---

## 🎨 Display Issues

### Layout broken or overlapping

**Problem**: CSS not loading or browser compatibility.

**Solution**:
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Check browser zoom level (should be 100%)
4. Try different browser
5. Check screen resolution (minimum 1280x720)

---

### Colors look wrong

**Problem**: CSS variables not loading or browser doesn't support them.

**Solution**:
1. Update browser to latest version
2. Use modern browser (Chrome, Edge, Firefox, Safari)
3. Check if custom CSS was modified
4. Restore original `src/index.css` file

---

### Responsive design not working

**Problem**: Mobile/tablet view not adapting.

**Solution**:
1. Refresh page
2. Check browser zoom level
3. Try rotating device (portrait/landscape)
4. Clear cache
5. Update browser

---

## 🔄 Build Issues

### Build fails

**Problem**: Error during `npm run build`.

**Solution**:
1. **Check error message** - read carefully
2. **Common fixes**:
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   
   # Clear npm cache
   npm cache clean --force
   
   # Update npm
   npm install -g npm@latest
   ```
3. **Check disk space** - need at least 500MB free
4. **Check file permissions**
5. **Try on different computer** to isolate issue

---

### Build succeeds but dist folder empty

**Problem**: Build process completed but no output.

**Solution**:
1. Check for error messages (even if build "succeeded")
2. Verify `vite.config.js` is present
3. Check `package.json` scripts
4. Try: `npm run build -- --debug`
5. Reinstall Vite: `npm install vite@latest`

---

## 🔐 Security Issues

### Antivirus blocking

**Problem**: Antivirus software blocking Node.js or npm.

**Solution**:
1. Add exception for Node.js in antivirus
2. Add exception for project folder
3. Temporarily disable antivirus (not recommended)
4. Contact IT department

---

### Firewall blocking

**Problem**: Corporate firewall blocking npm or localhost.

**Solution**:
1. Contact IT department
2. Request exception for npm registry
3. Request exception for localhost:5173
4. Use company VPN if available

---

## 💻 Platform-Specific Issues

### Windows Issues

**Problem**: "execution policy" error with PowerShell.

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Problem**: Path too long error.

**Solution**:
1. Move project to shorter path (e.g., `C:\dashboard`)
2. Enable long paths in Windows:
   ```cmd
   reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1
   ```

---

### Mac Issues

**Problem**: "App can't be opened" security warning.

**Solution**:
1. Right-click script → Open
2. Click "Open" in security dialog
3. Or: System Preferences → Security → Allow

**Problem**: Rosetta 2 needed (M1/M2 Macs).

**Solution**:
```bash
softwareupdate --install-rosetta
```

---

### Linux Issues

**Problem**: Missing dependencies.

**Solution**:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install build-essential

# Fedora/RHEL
sudo dnf install gcc-c++ make

# Arch
sudo pacman -S base-devel
```

---

## 🔍 Debugging Steps

### General Debugging Process

1. **Read the error message** - carefully!
2. **Check browser console** (F12)
3. **Check terminal/command window** for errors
4. **Try in incognito mode** (rules out extensions)
5. **Try different browser**
6. **Restart everything**:
   - Close dashboard
   - Close browser
   - Close terminal
   - Restart computer
7. **Reinstall**:
   ```bash
   rm -rf node_modules
   npm install
   ```
8. **Check system requirements**
9. **Search error message** online
10. **Ask for help** (see below)

---

## 📞 Getting Help

### Before Asking for Help

Gather this information:
- [ ] Operating system and version
- [ ] Node.js version (`node --version`)
- [ ] npm version (`npm --version`)
- [ ] Browser and version
- [ ] Exact error message (copy/paste)
- [ ] Screenshot of error
- [ ] Steps to reproduce
- [ ] What you've already tried

### Where to Get Help

1. **Check documentation**:
   - README.md
   - USER_GUIDE.md
   - This file (TROUBLESHOOTING.md)

2. **Search online**:
   - Google the error message
   - Stack Overflow
   - GitHub Issues

3. **Contact support**:
   - Your IT department
   - Development team
   - Project maintainers

4. **Community**:
   - React community
   - Vite community
   - Recharts community

---

## 🛠️ Advanced Troubleshooting

### Check Node.js Installation

```bash
node --version
npm --version
which node  # Mac/Linux
where node  # Windows
```

### Check npm Configuration

```bash
npm config list
npm config get registry
```

### Verify Project Structure

```bash
ls -la  # Mac/Linux
dir     # Windows
```

Should see:
- package.json
- node_modules/
- src/
- public/
- index.html

### Check Dependencies

```bash
npm list
npm outdated
```

### Reinstall Everything

```bash
# Backup first!
rm -rf node_modules package-lock.json
npm install
```

### Update Everything

```bash
npm update
npm install -g npm@latest
```

---

## 📋 Diagnostic Commands

Run these to gather system information:

```bash
# System info
node --version
npm --version
npm config get registry

# Project info
npm list --depth=0
npm outdated

# Check for issues
npm doctor

# Verify installation
npm ls react
npm ls recharts
npm ls vite
```

---

## ✅ Prevention Tips

### To Avoid Issues:

1. **Keep software updated**:
   - Node.js LTS version
   - npm latest version
   - Browser latest version

2. **Regular maintenance**:
   - Clear npm cache monthly: `npm cache clean --force`
   - Update dependencies: `npm update`
   - Clear browser cache weekly

3. **Good practices**:
   - Don't modify `node_modules`
   - Keep backups
   - Document changes
   - Test before sharing

4. **System health**:
   - Keep 10% disk space free
   - Close unnecessary applications
   - Restart computer weekly
   - Run antivirus scans

---

## 🆘 Emergency Recovery

### If Nothing Works:

1. **Backup your data** (if any custom changes)
2. **Delete everything**
3. **Download fresh copy**
4. **Reinstall Node.js**
5. **Start from scratch**

### Nuclear Option:

```bash
# Backup first!
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

---

**Still having issues? Don't hesitate to ask for help! 💪**
