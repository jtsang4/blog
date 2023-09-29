---
author: James Tsang
pubDatetime: 2022-02-06T19:04:32.737Z
title: Linux 一键 DD 重装脚本
postSlug: linux-one-click-dd-reinstall-script
featured: false
ogImage: https://vip2.loli.io/2023/09/16/pC6whR1yMm7Yjer.webp
tags:
  - Linux
  - CLI
description: Linux 一键 DD 重装脚本
---

# Table of Contents

> 脚本来源: [https://github.com/liyanglan/KVM-install](https://github.com/liyanglan/KVM-install)

Debian/Ubuntu/CentOS 网络安装/网络重装/纯净安装 一键脚本

# 背景

适用于由GRUB引导的CentOS,Ubuntu,Debian系统.

使用官方发行版去掉模板预装的软件.

同时也可以解决内核版本与软件不兼容的问题。

只要有root权限,还您一个纯净的系统。

注意:

全自动安装默认root密码: `MoeClub.org` 指定密码参数后面加 `-p 密码`

使用默认密码安装完成后请立即更改密码.

能够全自动重装Debian/Ubuntu/CentOS等系统.

同时提供dd安装镜像功能,例如: 全自动无救援dd安装windows系统.

全自动安装CentOS时默认提供VNC功能,可使用VNC Viewer查看进度, VNC端口为1或者5901,可自行尝试连接.(成功后VNC功能会消失.) 目前CentOS系统只支持任意版本重装为 CentOS 6.x 及以下版本.

# 准备工作

特别注意:OpenVZ构架不适用.

确保安装了所需软件:

\***\*Debian/Ubuntu:\*\***

```bash
apt-get install -y xz-utils openssl gawk file
```

\***\*RedHat/CentOS:\*\***

```bash
yum install -y xz openssl gawk file
```

如果出现了错误,请运行:

\***\*Debian/Ubuntu:\*\***

```bash
apt-get update
```

\***\*RedHat/CentOS:\*\***

```bash
yum update
```

# 下载

```bash
wget https://raw.githubusercontent.com/jtsang4/KVM-install/master/InstallNET.sh
```

# 使用方法

```bash
Usage:
        bash InstallNET.sh      -d/--debian [dist-name]
                                -u/--ubuntu [dist-name]
                                -c/--centos [dist-version]
                                -v/--ver [32/i386|64/amd64]
                                --ip-addr/--ip-gate/--ip-mask
                                -apt/-yum/--mirror
                                -dd/--image
                                -a/-m

# dist-name: 发行版本代号
# dist-version: 发行版本号
# -apt/-yum/--mirror : 使用定义镜像
# -a/-m : 询问是否能进入VNC自行操作. -a 为不提示(一般用于全自动安装), -m 为提示.
# --ip-addr :IP Address/IP地址
# --ip-gate :Gateway   /网关
# --ip-mask :Netmask   /子网掩码
# 以下示例中,将X.X.X.X替换为自己的网络参数.
```

# 快速示例

### **centos 6:**

```bash
bash InstallNET.sh -c 6.9 -v 64 -a --mirror 'http://mirror.centos.org/centos'
```

### **debian 7:**

```bash
bash InstallNET.sh -d 7 -v 64 -a
```

### **debian 8:**

```bash
bash InstallNET.sh -d 8 -v 64 -a
```

### **debian 9:**

```bash
bash InstallNET.sh -d 9 -v 64 -a
```

### **debian 10:**

```bash
bash InstallNET.sh -d 10 -v 64 -a
```

### **debian 11:**

```bash
bash InstallNET.sh -d 11 -v 64 -a
```

### **ubuntu 14.04:**

```bash
bash InstallNET.sh -u 14.04 -v 64 -a
```

### **ubuntu 16.04:**

```bash
bash InstallNET.sh -u 16.04 -v 64 -a
```

### **ubuntu 18.04:**

```bash
bash InstallNET.sh -u 18.04 -v 64 -a
```

### **ubuntu 20.04:**

```bash
bash InstallNET.sh -u 20.04 -v 64 -a
```

### **甲骨文ARM:**

```bash
bash InstallNET.sh -d 10 -v arm64 -a
```

### **CentOS系统用萌咖dd脚本出现Not Found grub.的解决方法**

```bash
grub2-mkconfig -o /boot/grub2/grub.cfg
```

### **VPS或者独立服务器有多个网卡.**

### **例:安装debian9，网卡名称enp0s5和enp0s6,enp0s6可用.**

```bash
bash InstallNET.sh -d 9 -v 64 -a -i enp0s6
```

### **VPS安装debian9并且自定义源.**

```bash
bash InstallNET.sh -d 9 -v 64 -a --mirror 'http://archive.ubuntu.com/ubuntu'
```

### **VPS安装debian9无法识别IP地址并且自定义源.**

```bash
bash InstallNET.sh -d 9 -v 64 -a --ip-addr x.x.x.x --ip-gate x.x.x.x --ip-mask x.x.x.x  --mirror 'http://archive.ubuntu.com/ubuntu'
```

### **VPS DD方式安装windwos 7.**

```bash
bash InstallNET.sh --ip-addr x.x.x.x --ip-gate x.x.x.x --ip-mask x.x.x.x -dd 'https://moeclub.org/get-win7embx86-auto'
```

# \***\*一些提示\*\***

特别注意:

萌咖提供的dd安装镜像

远程登陆账号为: `Administrator`

远程登陆密码为: `Vicer`

仅修改了主机名,可放心使用.(建议自己制作.)

在dd安装系统镜像时:

在你的机器上全新安装,如果你有VNC,可以看到全部过程.

在dd安装镜像的过程中,不会走进度条(进度条一直显示为0%).完成后将会自动重启.

分区界面标题一般显示为: “Starting up the partitioner“

使用谷歌网盘中储存的镜像: [无限制大小] 获取谷歌网盘文件临时直接下载链接

在全自动安装CentOS时:

如果看到 “Starting graphical installation” 或者类似表达,则表示正在安装.

正常情况下只需要耐心等待安装完成即可.

如果需要查看进度,使用VNC Viewer(或者其他VNC连接工具)

连接提示中的IP地址:端口进行连接.(端口一般为1或者5901)

# 国内软件源

[阿里巴巴开源镜像站-OPSX镜像站-阿里云开发者社区](https://developer.aliyun.com/mirror/)
