#!/bin/bash


while true
do
    clear
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║    Wade Dev: Docker Menu                                                     ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Current Working Directory: $(pwd)"
    echo ""
   echo "Please Select an Option"
    echo
    echo "1) Build and Start Containers"
    echo "2) Stop Containers"
    echo "3) Restart Containers"
    echo "4) Refresh Local SSL Certificate (Caddy)"
    echo "5) Caddy Nuke"
    echo "6) Docker Force Rebuild (No Table Loss)"
    echo "q) Return to Main Menu"
    echo ""

    read -p "Enter your choice ...:  " CHOICE

    case "$CHOICE" in
        1) 
            echo "Building and starting all containers in detached mode..."
            docker compose up -d --build
            echo "Done."
            read -p "Press [Enter] to continue..."
            ;;
        2)
            echo "Stopping and removing all containers..."
            docker compose down
            echo "Done."
            read -p "Press [Enter] to continue..."
            ;;
        3)
            echo "Restarting all containers..."
            docker compose restart
            echo "Done."
            read -p "Press [Enter] to continue..."
            ;;
        4)
            echo "This will stop all containers, delete the Caddy SSL certificate volume, and restart."
            read -p "Are you sure you want to continue? (y/n): " CONFIRM
            if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
                echo "Stopping and removing all containers..."
                docker compose down

                # Dynamically get the project name from the current directory to find the correct volume
                PROJECT_NAME=$(basename "$PWD")
                CADDY_VOLUME="${PROJECT_NAME}_caddy_data"

                echo "Removing Caddy data volume: $CADDY_VOLUME"
                docker volume rm "$CADDY_VOLUME"

                echo "Building and starting all containers..."
                docker compose up -d --build
                
                echo "Waiting for Caddy to initialize and generate certificates (10s)..."
                sleep 10

                echo "Extracting Root Certificate..."
                docker cp wade_usa_caddy:/data/caddy/pki/authorities/local/root.crt ./caddy_root.crt

                echo "Installing to System Trust Store (Requires Sudo)..."
                sudo cp ./caddy_root.crt /usr/local/share/ca-certificates/caddy.crt
                sudo update-ca-certificates

                echo "Installing to Chrome/Chromium NSS Database..."
                # Check for NSS DB existence
                if [ -d "$HOME/.pki/nssdb" ]; then
                    certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "Caddy Local Authority" -i ./caddy_root.crt
                    echo "Certificate added to Chrome DB."
                else
                    echo "Chrome NSS DB not found at $HOME/.pki/nssdb. Skipping Chrome-specific install."
                fi

                echo "Restarting Chrome..."
                # Kill existing chrome processes to force a clean reload
                pkill -f chrome || true
                sleep 2

                # Open tabs in the system's default browser
                xdg-open "https://wade.localhost"
                xdg-open "https://admin.localhost" &
                
                echo "Certificate refresh process complete."
            else
                echo "Operation cancelled."
            fi
            read -p "Press [Enter] to continue..."
            ;;
        5) 
            echo "Nuking Caddy by removing its data volume and rebuilding..."
            read -p "This is a destructive action for Caddy. Are you sure? (y/n): " CONFIRM
            if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
                echo "Stopping and removing all containers..."
                docker compose down

                # Dynamically get the project name to find the correct volume
                PROJECT_NAME=$(basename "$PWD")
                CADDY_VOLUME="${PROJECT_NAME}_caddy_data"

                echo "Removing Caddy data volume: $CADDY_VOLUME"
                docker volume rm "$CADDY_VOLUME"

                echo "Building and starting all containers..."
                docker compose up -d --build
                echo "Caddy has been reset."
            else
                echo "Operation cancelled."
            fi
            read -p "Press [Enter] to continue..."
            ;;
        6)
            echo "Nuking Docker: Forcing a rebuild of all images and recreation of containers..."
            docker compose down
            docker compose up -d --build --force-recreate
            read -p "Press [Enter] to continue..."
            ;;
        q)
            echo "Returning to Main Menu"
            break
            ;;
        *)
            echo "Invalid Choice"
            read -p "Press [Enter] to continue..."
            ;;
    esac
done
