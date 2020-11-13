# Steps for Raspberry Pi Custom Build

- install and boot raspbian
- adjust root filesystem to 5gb
- run: sudo apt update
- run: sudo apt dist-upgrade
- run: sudo apt-get clean
- run: update-nodejs-and-nodered
- run: sudo npm update -g
- run: sudo touch /boot/ssh
- set appropriate SSID and PSK into /etc/wpa_supplicant
- set static ip address info into /etc/dhcpcd.conf
- set hostname in /etc/hostname
- set hostname in /etc/hosts
- set aliases in ~/.bashrc (optional)
- copy cmdline.txt.preboot to /boot/cmdline.txt to re-enable auto- filesystem re-size on first boot
