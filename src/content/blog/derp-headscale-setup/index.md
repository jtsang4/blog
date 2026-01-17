---
author: James Tsang
pubDatetime: 2025-02-08T16:28:22.737Z
title: 搭建 DERP 中转节点与 Headscale，实现多设备组网
postSlug: derp-headscale-setup
featured: false
ogImage: https://cdn.sa.net/2025/02/09/Y8NRz13fduSqoO5.webp
tags:
  - DigitalProducts
  - Network
description: 最近好友送了我一台性能非常强劲的 Mac Mini，使用体验非常好，功耗也很低，适合长期运行作为小的家庭开发服务器，但出门以后就连接不上了，为了能够远程连接，又折腾了一下多设备组网。Tailscale 在多设备组网上比较好用，但因为 Tailscale 官方的 DERP 节点都在海外，中转连接以后延迟高、速度慢，所以干脆自己搭建了一个 DERP 节点搭配 Headscale 来使用，本文是折腾的记录。
---

## Table of Contents

> 更新：笔者目前最新的组网方案已经换成了 [Easytier](https://github.com/EasyTier/Easytier)，非常轻量好用，推荐给大家。

最近好友送了我一台性能非常强劲的 Mac Mini，使用体验非常好，功耗也很低，适合长期运行作为小的家庭开发服务器，但出门以后就连接不上了，为了能够远程连接，又折腾了一下多设备组网。Tailscale 在多设备组网上比较好用，但因为 Tailscale 官方的 DERP 节点都在海外，中转连接以后延迟高、速度慢，所以干脆自己搭建了一个 DERP 节点搭配 Headscale 来使用，本文是折腾的记录。

## 获取 SSL 证书

> 使用 [acme.sh](https://github.com/acmesh-official/acme.sh) 项目获取 SSL 证书

1.安装 acme.sh

```sh
curl https://get.acme.sh | sh -s email=my@example.com
```

2.生成证书

```sh
./acme.sh --issue -d my-site.com --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

执行此命令后，acme.sh 会生成一个需要添加到 DNS 服务器的 TXT 记录。

3.添加 DNS 记录

去域名托管的地方添加 TXT 记录。

4.确认证书生成

```sh
acme.sh --renew -d my-site.com --yes-I-know-dns-manual-mode-enough-go-ahead-please --debug
```

这将检查 DNS 记录并生成 SSL 证书。

5.续约证书
证书过期后，可以通过如下脚本手动续约证书。

```sh
/root/acme.sh//acme.sh --renew -d my-site.com --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

## 搭建 DERP 中转节点

> 项目地址: https://github.com/fredliang44/derper-docker

其中的重点是 DERP 服务端口以及 STUN 服务端口(还有一个 HTTP 端口用来检测服务状态的，访问会返回一个页面，可以不开)，可以这样写 docker-compose.yaml 文件:

```yaml
services:
  derper:
    image: fredliang/derper
    environment:
      - DERP_DOMAIN=my-site.com
    volumes:
      - /root/.acme.sh/my-site.com:/app/certs
    ports:
      - 1680:80 # 检测页面端口
      - 12444:443
      - 3478:3478
```

之后 `docker compose up -d` 启动 DERP 服务，注意其中 acme.sh 生成的证书需要挂载到容器的正确目录下。

## 启动 Headscale

> 项目地址: https://github.com/juanfont/headscale

1.下载安装 Headscale
在 [release](https://github.com/juanfont/headscale/releases) 里下载最新的版本，然后运行以下命令(注意 `.deb` 安装包名要改成实际的)：

```sh
dpkg --install headscale_0.25.0-beta.1_linux_amd64.deb
```

2.配置 DERP

> 参考：[示例配置文件](https://github.com/juanfont/headscale/blob/main/derp-example.yaml)

配置默认在 `/etc/headscale` 目录，创建 DERP 配置文件 derp.yaml

```yaml
# If you plan to somehow use headscale, please deploy your own DERP infra: https://tailscale.com/kb/1118/custom-derp-servers/
regions:
  901:
    regionid: 901
    regioncode: jtsang-regioncode # 按需求取名
    regionname: jtsang-regionname # 按需求取名
    nodes:
      - name: 901a
        regionid: 901
        hostname: <hostname>
        ipv4: <IPV4>
        # ipv6: <IPV6>
        stunport: 3478
        stunonly: false
        derpport: 12444
```

3.配置 Headscale

> 参考：[示例配置文件](https://github.com/juanfont/headscale/blob/main/config-example.yaml)

配置默认在 `/etc/headscale` 目录，创建 DERP 配置文件 config.yaml，先把示例配置文件下载下来，然后改掉以下几项即可：

```yaml
server_url: http://<IP>:8080

listen_addr: 0.0.0.0:8080

derp:
  server:
    region_id: 901 # 和上面 derp.yaml 中的对应
	regioncode: jtsang-regioncode
    regionname: jtsang-regionname
  paths:
    - /etc/headscale/derp.yaml
```

4.升级 Headscale 版本
如果一段时间以后想升级 Headscale 的版本，直接重新下载 `.deb` 安装包重新运行 `dpkg --install xxx.deb` 命令即可。注意更新版本后可能会提示是否要覆盖 config.yaml 配置文件，建议升级前先备份好原来的配置，在升级覆盖配置文件后重新修改需要变更的项再重启服务：`service headscale restart`

## 客户端连接 Headscale

**MacOS 连接 Headscale:**

对于 MacOS，可以直接在 App Store 直接下载 Tailscale，也可以去官网下载，官网版本是基于系统扩展的，能力更强不过权限也会更高。对我个人来说，用 App Store 下载的版本即可。如果需要也可以去下载命令行版本使用。

下载完成后访问上面 config.yaml 中配置的 `http://<IP>:8080/apple` 地址，按照页面中的提示完成连接即可。

**Linux 连接 Headscale:**

对于 Linux 系统，先参考[官方文档](https://tailscale.com/kb/1031/install-linux)选择自己版本的系统进行客户端安装，安装完成以后运行以下命令进行连接：

```sh
tailscale up --login-server=http://<IP>:8080 --accept-routes=true --accept-dns=falss
```

## Headscale 常用命令行

- 用户管理: headscale users list/create
- 查看节点列表: `headscale nodes list`
- 删除特定节点: `headscale nodes delete -i <ID>`
- 调试配置文件: `headscale serve -c /etc/headscale/config.yaml`

## 常见问题

Q: 组网的客户端无法与本地的 Clash/Shadowrocket 之类的代理共存怎么办

A：目前没有比较优雅的解决办法，如果是 MacOS 客户端的话，可以用 Surge 来做代理规避这个问题。不过如果是组网内被连接的客户端，同时开启代理是不会影响组网入流量的，只会影响出流量，换句话说开启代理的时候当前客户端无法连接到另一个客户端。所以还有一个简单的办法是先连接组网内的另一个客户端，再开启代理，这时候连接不会中断。

Q: 无法连接上另一个客户端，ping 也 ping 不同子网 IP

A: 这种情况可以检查一下另一个 Tailscale 客户端有没有开启 "Allow incoming connections"，如果没有的话需要勾上。

Q: 客户端报错连接不上了怎么办

A: 如果是 MacOS 客户端，可以在 Console 中查看 Tailscale 的日支。如果发现是证书过期了，可以借助上面“获取 SSL 证书”中提到的方法进行续签。

## 学习参考文档

- [Tailscale 基础教程：部署私有 DERP 中继服务器](https://icloudnative.io/posts/custom-derp-servers/#%E9%98%B2%E6%AD%A2-derp-%E8%A2%AB%E7%99%BD%E5%AB%96)
- [近期折腾 tailscale 的一些心得](https://blog.laisky.com/p/tailscale/#)
