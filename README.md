# Arke Console

![arke_console](https://github.com/arkemishub/arke-console/assets/81776297/37776261-63f6-4046-baef-3f5886b1d999)

## Installation with Git

Clone this repo and install the project dependencies
```bash
git clone git@github.com:arkemishub/arke-console.git
pnpm install
```

## Environment variables

Create a NEXTAUTH_SECRET with:
```bash
openssl rand -base64 32 | pbcopy
```

Create a `.env.local` file with the following variables:
```bash
NEXT_PUBLIC_ARKE_SERVER_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_ARKE_PROJECT=
```

### Build & Run the production server

```bash
pnpm build && pnpm start
```

## Installation with Docker

Pull the Docker image from the Github Container Registry
```bash
docker pull ghcr.io/arkemishub/arke-console:latest
```

Run the Docker container on 3100 port
```bash
docker run -p 3100:3100 ghcr.io/arkemishub/arke-console:latest
```

Visit the console on http://localhost:3100

## Installation with Docker Compose

Run the Docker compose build passing the environment variables
```bash
docker-compose build --build-arg --build-arg NEXTAUTH_URL="http://localhost:3100" --build-arg NEXT_PUBLIC_ARKE_SERVER_URL="http://localhost:4000" --build-arg NEXTAUTH_SECRET=<NEXTAUTH_SECRET> NEXT_PUBLIC_ARKE_PROJECT=<ARKE_PROJECT> 
docker-compose up 
```