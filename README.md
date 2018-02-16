# android-farm
Android devices farm with USB and emulated devices support

## TL;DR;

```console
$ helm install openstf
```

## Introduction

This project contains a chart that bootstraps an OpenSTF deployment on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

# Prerequisites
- Kubernetes cluster with KVM-capable nodes for emulators
- [helm](https://helm.sh)
- [rethinkdb installation](https://github.com/kubernetes/charts/tree/master/stable/rethinkdb)
- [adb-butler](https://github.com/agoda-com/adb-butler) image
- [docker-emulator-android](https://github.com/agoda-com/docker-emulator-android) images

## Installing the Chart

To install the chart with the release name `my-release`:

```console
$ helm install --name my-release openstf
```

The command deploys OpenSTF on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

You need to set `emulators.imagePrefix` and `adb.image.repository` values to the images of [docker-emulator-android](https://github.com/agoda-com/docker-emulator-android) and [adb-butler](https://github.com/agoda-com/adb-butler) you've built in order for the chart to work. This can be done either in `values.yaml` or via the command-line:

```console
$ helm install --name my-release \
    --set emulators.imagePrefix=docker-registry/agoda/docker-emulator-android- \
    --set adb.image.repository=docker-registry/agoda/adb-butler openstf
```

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```console
$ helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

# Nodes configuration
You need to label and taint the usb provider nodes and kvm nodes as following

USB providers:
```
$ kubectl label nodes node-x.cluster.local openstf.io/provider=true
$ kubectl taint nodes node-x.cluster.local openstf.io/provider=true:NoSchedule
```

Emulator nodes:
```
$ kubectl label nodes node-x.cluster.local openstf.io/emulator=kvm
```

# Configuration

The following tables lists the configurable parameters of the openstf chart and their default values.

Parameter | Description | Default
--- | --- | ---
`stf.image.repository` | OpenSTF container image repository | `openstf/stf`
`stf.image.tag` | OpenSTF container image tag | `v3.2.0`
`stf.image.pullPolicy` | OpenSTF container image pull policy | `IfNotPresent`
`stf.api.replicas` | Desired number of API pods | `3`
`stf.app.replicas` | Desired number of app pods | `1`
`stf.auth.replicas` | Desired number of auth pods | `1`
`stf.processor.replicas` | Desired number of processor pods | `5`
`stf.reaper.replicas` | Desired number of reaper pods | `1`
`stf.apkStorage.replicas` | Desired number of apk-storage pods | `1`
`stf.imgStorage.replicas` | Desired number of image-storage pods | `1`
`stf.storage.replicas` | Desired number of storage pods | `1`
`stf.triproxyDev.replicas` | Desired number of triproxy-dev pods | `1`
`stf.triproxyApp.replicas` | Desired number of triproxy-app pods | `1`
`stf.websocket.replicas` | Desired number of websocket pods | `1`
`nginx.image.repository` | nginx container image repository | `nginx`
`nginx.image.tag` | nginx container image repository tag | `1.13.8-alpine`
`nginx.image.pullPolicy` | nginx container image pullPolicy | `IfNotPresent`
`nginx.replicas` | Desired number of nginx pods | `1`
`adb.image.repository` | adb-butler container image repository | `agoda/adb-butler`
`adb.image.tag` | adb-butler container image repository tag | `latest`
`adb.image.pullPolicy` | adb-butler container image pullPolicy | `Always`
`db.url` | URL of RethinkDB  | `rethinkdb-rethinkdb-proxy.openstf`
`db.port` | TCP port of RethinkDB | `28015`
`db.password` | RethinkDB password | `rethinkdb`
`dns.resolver` | Address of DNS server | `kube-dns.kube-system`
`pullSecret` | Pull secret for pulling all the images | `""`
`ingress.enabled` | Enable ingress controller resource | `false`
`ingress.annotations` | Custom annotations on ingress resource | `nginx.org/websocket-services: nginx`
`ingress.hostname` | Hostname to your OpenSTF installation | `openstf.local`
`ingress.ssl.enabled` | Utilize TLS backend in ingress | `false`
`ingress.ssl.secret` | TLS Secret (certificates) | `openstf.local-tls-secret`
`emulators.imagePrefix` | Prefix of docker android container image  | `agoda/docker-emulator-android-`
`emulators.imageVersion` | Docker android container image tag | `25`
`emulators.pullPolicy` | Docker android container image pull policy | `IfNotPresent`
`emulator.types` | Types of docker android emulators to spawn | `see below for more info`
`telegraf.image.repository` | telegraf container image repository | `telegraf`
`telegraf.image.tag` | telegraf container image repository tag | `1.5-alpine`
`telegraf.image.pullPolicy` | telegraf container image pullPolicy | `IfNotPresent`
`telegraf.config.outputs.prometheus.enabled` | provide prometheus metrics on provider pods | `true`

```console
$ helm install openstf --name my-release \
    --set rethinkdb.password=strongpassword
```

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```console
$ helm install openstf --name my-release -f values.yaml
```

> **Tip**: You can use the default [values.yaml](openstf/values.yaml)

## Pod resources
All the pods have sane default resources set. To customize check the [values.yaml](openstf/values.yaml)

## Emulators
In order to create emulators you need to provide configuration inside `emulators.types`. For example you want the to name the batch of devices `tablet7i`, add `ci/uiTest/tablet/7inch` note to all these devices in OpenSTF and change the `config.ini` variable for emulator. You also want 3 instances of such config with API version 26 and 3 instances with API version 19.

```YAML
- name: tablet7i
  note: ci/uiTest/tablet/7inch
  args: "skin.name=600x1024;hw.lcd.density=160;hw.lcd.height=600;hw.lcd.width=1024;hw.device.name=7in WSVGA (Tablet);avd.ini.displayname=7  WSVGA (Tablet) API 23;"
  instances:
  - version: 26
    count: 3
  - version: 19
    count: 3
```

By default you'll have phones with API versions 17 to 26 and 7' + 10' tablets with API version 25.

# License

android-farm is open source and available under the [Apache License, Version 2.0](LICENSE).

OpenSTF is open source and available under the [Apache License, Version 2.0](https://github.com/openstf/stf/blob/master/LICENSE)

Android SDK components are available under the [Android Software Development Kit License](https://developer.android.com/studio/terms.html)

# Related projects

The emulators are spawned using the
[docker-emulator-android](https://github.com/agoda-com/docker-emulator-android) container image

Default adb side container image with self-healing and metrics is [adb-butler](https://github.com/agoda-com/adb-butler)

Connecting to OpenSTF devices with filtering support and reconnect logic is done using [stf-client](https://github.com/Malinskiy/stf-client)

[fork](https://github.com/agoda-com/fork) is an instrumentation runner with support for reconnecting to adb devices on-the-go and more

[example of ci agent container](https://github.com/Malinskiy/docker-android)
