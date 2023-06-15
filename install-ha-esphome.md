### Install Docker, Home Assistan Core and ESP Home
```
sudo apt-get install -y jq wget curl avahi-daemon udisks2 libglib2.0-bin network-manager dbus docker-compose  
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo service docker start
```

### Make dirs and create Docker Compose file
```
mkdir ./apps/ha 
cd ./apps/ha
nano ./docker-compose.yml
```

### paste this yaml into the docker-compose.yml file

```
version: '3'
services:
  homeassistant:
    container_name: homeassistant
    image: "ghcr.io/home-assistant/home-assistant:stable"
    volumes:
      - /apps/ha/config:/config
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    privileged: true
    network_mode: host
  esphome:
    container_name: esphome
    image: ghcr.io/esphome/esphome
    volumes:
      - /apps/ha/esphome/config:/config
      - /etc/localtime:/etc/localtime:ro
    restart: always
    privileged: true
#    network_mode: host
    devices:
      - /dev/ttyUSB0:/dev/ttyACM0
    ports:
      - 80:6052
```
* change port 80 to port you want to use for ESPHome Dashboard or remove the "ports" code block and uncomment network_mode: host to use default port of 6052
* then run docker compose    

`docker compose up -d`

### start ESPHome daskboard on deman with 

`docker run --rm --net=host -v "${PWD}":/config -it ghcr.io/esphome/esphome`
