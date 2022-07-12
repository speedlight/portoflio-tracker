terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "docker" {}

resource "docker_container" "energy" {
  image = "energy"
  name  = "nergy"
  restart = "always"
  volumes {
    container_path  = "/app"
    host_path = "app" 
    read_only = false
  }
  ports {
    internal = 4000
    external = 4000
  }
}
