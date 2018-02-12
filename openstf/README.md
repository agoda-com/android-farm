## OpenSTF on kubernetes

# Run OpenSTF
- helm install --name openstf --namespace openstf .

# Node labels
- openstf.io/provider=true for usb providers
- openstf.io/emulator=kvm for emulator runners with kvm enabled
